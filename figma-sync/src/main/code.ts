import { loadSettings, saveSettings } from "./settings";
import { GitHubClient } from "./github-client";
import { pullIcons, postPublishSync } from "./pull";
import { buildPushPlan, applyPushPlan, finalizePush } from "./push";
import type { PushPlan } from "./push";
import { adoptBaseline, formatScan, scanLibrary } from "./scan";
import type { ScanEntry } from "./scan";
import { identitiesFor, pushableEntries, toLibraryItems } from "./library";
import { checkSelectionHashes, formatHashCheck } from "./hash-check";
import { getOrCreateTableContainer } from "./figma-nodes";
import { createMissingRows, formatTableScan, migrateTable, readTableRows, scanTable } from "./table";
import { mapWithConcurrency } from "./concurrency";
import type { RegistryIndex } from "./registry-types";
import type { PluginSettings } from "./types";

const MIN_WIDTH = 480;
const MIN_HEIGHT = 480;
const MAX_PREVIEW_CHARS = 20000;
const CHANGE_DEBOUNCE_MS = 500;

figma.showUI(__html__, { width: 560, height: 720, themeColors: true });

let pendingPush: PushPlan | null = null;
let lastScan: ScanEntry[] = [];
/** True while the plugin itself writes to the file, so its own edits are not reported as pending changes. */
let busy = false;
const changedOwners = new Set<string>();
let changeTimer: ReturnType<typeof setTimeout> | undefined;

function post(type: string, payload: Record<string, unknown> = {}): void {
  figma.ui.postMessage({ type, ...payload });
}

function githubClient(settings: PluginSettings): GitHubClient {
  return new GitHubClient({ token: settings.token, owner: settings.owner, repo: settings.repo });
}

/** Area names known to the repo for this brand, or null when the registry cannot be read. */
async function loadKnownAreas(settings: PluginSettings): Promise<string[] | null> {
  try {
    const index = await githubClient(settings).getFileJson<RegistryIndex>("registry/generated/index.json", settings.branch);
    const brand = index?.brands.find((b) => b.brand === settings.brand);
    return brand ? brand.areas.map((a) => a.area) : null;
  } catch {
    return null;
  }
}

/** The icon set or table row a changed node belongs to; null for anything the library does not track. */
function trackedOwner(node: BaseNode): string | null {
  let current: BaseNode | null = node;
  while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
    if (current.type === "COMPONENT_SET") return current.id;
    const parent: BaseNode | null = current.parent;
    if (parent && parent.type === "FRAME" && parent.getPluginData("fdsiTableContainer") === "true") return current.id;
    current = parent;
  }
  return null;
}

function onNodeChange(event: NodeChangeEvent): void {
  if (busy) return;
  for (const change of event.nodeChanges) {
    // Deleted nodes have no parent chain any more; a deletion on the page is worth a rescan.
    const owner = change.node.removed ? change.id : trackedOwner(change.node);
    if (owner) changedOwners.add(owner);
  }
  if (changedOwners.size === 0) return;
  clearTimeout(changeTimer);
  changeTimer = setTimeout(() => post("pending-changes", { count: changedOwners.size }), CHANGE_DEBOUNCE_MS);
}

figma.currentPage.on("nodechange", onNodeChange);
figma.on("currentpagechange", () => {
  figma.currentPage.on("nodechange", onNodeChange);
  changedOwners.clear();
  post("pending-changes", { count: 0 });
});

/** Small thumbnails for the list: the default variant as SVG, rendered by the UI as a mask so it follows the theme colour. */
async function postPreviews(entries: readonly ScanEntry[]): Promise<void> {
  const previews: Record<string, string> = {};
  await mapWithConcurrency(entries.filter((e) => e.set), 6, async (entry) => {
    try {
      const svg = await entry.set!.defaultVariant.exportAsync({ format: "SVG_STRING" });
      if (svg.length <= MAX_PREVIEW_CHARS) previews[entry.name] = svg;
    } catch {
      // A missing preview only leaves a placeholder.
    }
  });
  post("previews", { previews });
}

function postScan(entries: ScanEntry[], extra: Record<string, unknown> = {}): void {
  lastScan = entries;
  changedOwners.clear();
  clearTimeout(changeTimer);
  post("scan-result", { items: toLibraryItems(entries), lines: formatScan({ entries, knownAreas: [] }), ...extra });
}

async function runScan(settings: PluginSettings): Promise<void> {
  const scan = await scanLibrary(settings, githubClient(settings));
  postScan(scan.entries);
  await postPreviews(scan.entries);
}

figma.ui.onmessage = async (msg: { type: string; [key: string]: unknown }) => {
  busy = true;
  try {
    await handleMessage(msg);
  } catch (err) {
    post("error", { message: err instanceof Error ? err.message : String(err) });
  } finally {
    busy = false;
  }
};

async function handleMessage(msg: { type: string; [key: string]: unknown }): Promise<void> {
  switch (msg.type) {
    case "resize": {
      const width = Math.max(MIN_WIDTH, Math.round(Number(msg.width)));
      const height = Math.max(MIN_HEIGHT, Math.round(Number(msg.height)));
      figma.ui.resize(width, height);
      break;
    }
    case "focus-icon": {
      const set = lastScan.find((e) => e.name === msg.name)?.set;
      if (set && !set.removed) {
        figma.currentPage.selection = [set];
        figma.viewport.scrollAndZoomIntoView([set]);
      }
      break;
    }
    case "dismiss-changes": {
      changedOwners.clear();
      break;
    }
    case "ui-ready": {
      post("settings", { settings: await loadSettings() });
      break;
    }
    case "save-settings": {
      await saveSettings(msg.settings as PluginSettings);
      post("settings-saved");
      break;
    }
    case "pull": {
      const settings = msg.settings as PluginSettings;
      const result = await pullIcons(settings, githubClient(settings));
      post("pull-result", { result });
      await runScan(settings);
      break;
    }
    case "post-publish-sync": {
      const settings = msg.settings as PluginSettings;
      const result = await postPublishSync(settings, githubClient(settings));
      post("post-publish-result", { result });
      break;
    }
    case "scan": {
      const settings = msg.settings as PluginSettings;
      await runScan(settings);
      break;
    }
    case "adopt-baseline": {
      const settings = msg.settings as PluginSettings;
      const client = githubClient(settings);
      const adopted = adoptBaseline((await scanLibrary(settings, client, false)).entries);
      post("adopt-baseline-result", { adopted });
      await runScan(settings);
      break;
    }
    case "hash-check": {
      const settings = msg.settings as PluginSettings;
      const entries = await checkSelectionHashes(figma.currentPage.selection, settings.branch, githubClient(settings));
      post("hash-check-result", { lines: entries.flatMap(formatHashCheck) });
      break;
    }
    case "table-create-rows": {
      const container = getOrCreateTableContainer();
      const migration = await migrateTable(container);
      const created = await createMissingRows(container);
      post("table-create-rows-result", { migration, created });
      break;
    }
    case "table-read": {
      const settings = msg.settings as PluginSettings;
      const container = getOrCreateTableContainer();
      await migrateTable(container);
      const knownAreas = await loadKnownAreas(settings);
      post("table-read-result", { lines: formatTableScan(scanTable(container, knownAreas), knownAreas) });
      break;
    }
    case "prepare-push": {
      const settings = msg.settings as PluginSettings;
      const entries = pushableEntries(lastScan, (msg.names as string[]) ?? []);
      if (entries.length === 0) throw new Error("Nothing to push: scan again and select icons that changed in Figma");
      const rows = readTableRows(getOrCreateTableContainer());
      pendingPush = await buildPushPlan(
        entries.map((e) => e.set!),
        identitiesFor(entries, rows, settings.brand),
        settings,
        githubClient(settings),
        msg.allowNewArea === true
      );
      post("push-plan", { plan: pendingPush.plan });
      break;
    }
    case "confirm-push": {
      if (!pendingPush) throw new Error("No push plan is staged");
      const settings = msg.settings as PluginSettings;
      const outcome = await applyPushPlan(pendingPush.plan, settings, githubClient(settings));
      await finalizePush(pendingPush, outcome, settings, githubClient(settings));
      pendingPush = null;
      post("push-committed", { outcome });
      await runScan(settings);
      break;
    }
    case "cancel-push": {
      pendingPush = null;
      break;
    }
    default:
      break;
  }
}
