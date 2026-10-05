import type { IconStatus, PluginSettings } from "./types";
import type { AreaIndex, RegistryIndex } from "./registry-types";
import { GitHubClient } from "./github-client";
import { hashIconVariants } from "./hashing";
import { groupRepoIcons } from "./repo-tree";
import type { RepoIcon } from "./repo-tree";
import { computeSyncState, figmaStateHash, syncStatusLabel, validateRowFields } from "./contract";
import type { RowFields, SyncState } from "./contract";
import {
  exportSetVariants,
  getOrCreateTableContainer,
  listIconComponentSets,
  readBases,
  readPendingPr,
  readSetIdentity,
  writeBases,
  writePendingPr,
} from "./figma-nodes";
import { migrateTable, readTableRows, writeSyncStatus } from "./table";
import type { TableRow } from "./table";

export interface RepoCatalogItem extends RepoIcon {
  /** From the generated registry; null when the icon was added after the registry was last generated. */
  status: IconStatus | null;
  aliases: string[];
}

export interface RepoCatalog {
  icons: RepoCatalogItem[];
  knownAreas: string[];
}

/** One tree listing plus the per-area indexes; no per-icon requests. */
export async function loadRepoCatalog(settings: PluginSettings, client: GitHubClient): Promise<RepoCatalog> {
  const [tree, index] = await Promise.all([
    client.listTree(settings.branch),
    client.getFileJson<RegistryIndex>("registry/generated/index.json", settings.branch),
  ]);
  const repoIcons = groupRepoIcons(tree, settings.brand);

  const brandEntry = index?.brands.find((b) => b.brand === settings.brand);
  const areaEntries = (brandEntry?.areas ?? []).filter((a) => a.file && a.iconCount > 0);
  const areaIndexes = await Promise.all(areaEntries.map((a) => client.getFileJson<AreaIndex>(a.file as string, settings.branch)));
  const info = new Map(areaIndexes.flatMap((a) => a?.icons ?? []).map((i) => [i.name, i] as const));

  const icons = repoIcons.map((icon) => ({
    ...icon,
    status: info.get(icon.name)?.status ?? null,
    aliases: info.get(icon.name)?.aliases ?? [],
  }));
  const knownAreas = [...new Set([...repoIcons.map((i) => i.area), ...(brandEntry?.areas ?? []).map((a) => a.area)])];
  return { icons, knownAreas };
}

export interface ScanEntry {
  /** Identity used to join Figma and the repo: the name recorded at the last sync, else the layer name. */
  name: string;
  /** The set's current layer name; differs from `name` after a rename. */
  currentName: string;
  state: SyncState;
  renamed: boolean;
  errors: string[];
  set: ComponentSetNode | null;
  row: TableRow | null;
  repo: RepoCatalogItem | null;
  figmaHash: string | null;
  repoHash: string | null;
  /** Number of an open pull request that carries this icon's pending change. */
  pendingPr: number | null;
}

export interface ScanResult {
  entries: ScanEntry[];
  knownAreas: string[];
}

function statusText(entry: ScanEntry): string {
  const parts = [syncStatusLabel(entry.state)];
  if (entry.renamed) parts.push(`renamed from ${entry.name}`);
  if (entry.pendingPr !== null) parts.push(`PR #${entry.pendingPr} open`);
  if (entry.errors.length > 0) parts.push("invalid");
  return parts.join(" \u00b7 ");
}

/** Joins sets, table rows and repo icons, computes each icon's state, and (optionally) writes it to the row's sync-status cell. */
export async function scanLibrary(
  settings: PluginSettings,
  client: GitHubClient,
  writeStatus = true
): Promise<ScanResult> {
  const catalog = await loadRepoCatalog(settings, client);
  const repoByName = new Map(catalog.icons.map((i) => [i.name, i] as const));

  const container = getOrCreateTableContainer();
  await migrateTable(container);
  const rows = readTableRows(container);
  const rowsByName = new Map(rows.map((r) => [r.fields.name, r] as const));

  const sets = listIconComponentSets().filter((s) => {
    const { brand } = readSetIdentity(s);
    return brand === "" || brand === settings.brand;
  });
  const setsByIdentity = new Map<string, ComponentSetNode[]>();
  for (const set of sets) {
    const identity = readSetIdentity(set).name || set.name;
    setsByIdentity.set(identity, [...(setsByIdentity.get(identity) ?? []), set]);
  }

  const openPrBySet = await resolvePendingPrs(sets, repoByName, client);
  // A row belongs to the set whose current layer name it carries; only the rest become entries of their own.
  const claimedRowNames = new Set(sets.map((s) => s.name));
  const names = new Set<string>([
    ...setsByIdentity.keys(),
    ...repoByName.keys(),
    ...rows.map((r) => r.fields.name).filter((n) => !claimedRowNames.has(n)),
  ]);

  const entries: ScanEntry[] = [];
  for (const name of [...names].sort()) {
    const matched = setsByIdentity.get(name) ?? [];
    const set = matched[0] ?? null;
    const duplicate = matched.length > 1;
    const currentName = set ? set.name : name;
    const row = rowsByName.get(currentName) ?? rowsByName.get(name) ?? null;
    const recordedName = set ? readSetIdentity(set).name : "";
    const renamed = set !== null && recordedName !== "" && recordedName !== set.name;
    const repo = repoByName.get(name) ?? null;

    let figmaHash: string | null = null;
    if (set && !duplicate) {
      figmaHash = figmaStateHash(hashIconVariants(await exportSetVariants(set)), row?.fields ?? null);
    }
    const bases = set ? readBases(set) : { figmaBase: null, repoBase: null };

    let state = computeSyncState({
      duplicate,
      figmaHash,
      repoHash: repo?.hash ?? null,
      figmaBase: bases.figmaBase,
      repoBase: bases.repoBase,
    });
    // The name is not part of the metadata hash, so a rename has to be raised separately.
    if (state === "in-sync" && renamed) state = "changed-in-figma";

    const errors = row
      ? validateRowFields(row.fields, {
          knownAreas: catalog.knownAreas,
          allowNewArea: false,
          others: [
            ...rows.filter((r) => r !== row).map((r) => ({ name: r.fields.name, aliases: r.fields.aliases })),
            ...catalog.icons
              .filter((i) => i.name !== name && i.name !== currentName)
              .map((i) => ({ name: i.name, aliases: i.aliases })),
          ],
        })
      : [];

    entries.push({
      name,
      currentName,
      state,
      renamed,
      errors,
      set,
      row,
      repo,
      figmaHash,
      repoHash: repo?.hash ?? null,
      pendingPr: set ? openPrBySet.get(set) ?? null : null,
    });
  }

  if (writeStatus) {
    for (const entry of entries) {
      if (entry.row) await writeSyncStatus(entry.row.frame, statusText(entry));
    }
  }
  return { entries, knownAreas: catalog.knownAreas };
}

export function formatScan(scan: ScanResult): string[] {
  const counts = new Map<SyncState, number>();
  for (const e of scan.entries) counts.set(e.state, (counts.get(e.state) ?? 0) + 1);
  const summary = [...counts].map(([state, n]) => `${syncStatusLabel(state)} ${n}`).join(", ");
  const lines = [`Scan: ${scan.entries.length} icons \u2014 ${summary || "none"}`];

  for (const e of scan.entries) {
    if (e.state === "in-sync" && e.errors.length === 0) continue;
    const rename = e.renamed ? ` (renamed to ${e.currentName})` : "";
    const pr = e.pendingPr !== null ? ` (PR #${e.pendingPr} open)` : "";
    lines.push(`  ${e.name}${rename}: ${syncStatusLabel(e.state)}${pr}`);
    for (const error of e.errors) lines.push(`    ${error}`);
  }
  if (scan.entries.some((e) => e.state === "unknown")) {
    lines.push('  "Unknown" means no baseline is recorded yet; use "Adopt baseline" once you are happy with the current state.');
  }
  return lines;
}

/** Records the current state of every `unknown` icon as its baseline. Returns the names. */
export function adoptBaseline(entries: readonly ScanEntry[]): string[] {
  const adopted: string[] = [];
  for (const e of entries) {
    if (e.state !== "unknown" || !e.set || e.figmaHash === null || e.repoHash === null) continue;
    writeBases(e.set, { figmaBase: e.figmaHash, repoBase: e.repoHash });
    adopted.push(e.name);
  }
  return adopted;
}

/** Fields of the table row for `name`, or null when it has none. */
export function rowFieldsFor(name: string): RowFields | null {
  return readTableRows(getOrCreateTableContainer()).find((r) => r.fields.name === name)?.fields ?? null;
}

/** Records both baselines from the set's current Figma state and the given repo hash. */
export async function recordBases(set: ComponentSetNode, repoHash: string): Promise<void> {
  writeBases(set, { figmaBase: await currentFigmaBase(set), repoBase: repoHash });
}

/** The set's Figma-side state hash right now (artwork plus its table row). */
export async function currentFigmaBase(set: ComponentSetNode): Promise<string> {
  const artwork = hashIconVariants(await exportSetVariants(set));
  return figmaStateHash(artwork, rowFieldsFor(set.name));
}

/**
 * Settles sets whose change went out as a pull request: a merged PR becomes the new baseline on both sides,
 * a closed one is forgotten (the icon simply stays changed in Figma). Returns the open ones.
 */
async function resolvePendingPrs(
  sets: readonly ComponentSetNode[],
  repoByName: ReadonlyMap<string, RepoCatalogItem>,
  client: GitHubClient
): Promise<Map<ComponentSetNode, number>> {
  const open = new Map<ComponentSetNode, number>();
  const states = new Map<number, "open" | "merged" | "closed" | null>();
  for (const set of sets) {
    const pending = readPendingPr(set);
    if (!pending) continue;
    if (!states.has(pending.number)) {
      states.set(pending.number, await client.getPullRequestState(pending.number).catch(() => null));
    }
    const state = states.get(pending.number);
    const repo = repoByName.get(readSetIdentity(set).name || set.name);
    if (state === "merged" && repo) {
      writeBases(set, { figmaBase: pending.figmaBase, repoBase: repo.hash });
      writePendingPr(set, null);
    } else if (state === "closed") {
      writePendingPr(set, null);
    } else if (state === "open") {
      open.set(set, pending.number);
    }
  }
  return open;
}

async function repoHashesByName(settings: PluginSettings, client: GitHubClient): Promise<Map<string, string>> {
  const icons = groupRepoIcons(await client.listTree(settings.branch), settings.brand);
  return new Map(icons.map((i) => [i.name, i.hash] as const));
}

/** Re-reads the repo and records both baselines for sets that were just pushed. */
export async function refreshBases(
  settings: PluginSettings,
  client: GitHubClient,
  sets: readonly ComponentSetNode[]
): Promise<void> {
  const hashes = await repoHashesByName(settings, client);
  for (const set of sets) {
    const hash = hashes.get(readSetIdentity(set).name || set.name);
    if (hash) await recordBases(set, hash);
  }
}

/** Repo hashes by icon name, taken before a plugin commit so only unchanged icons are rebased afterwards. */
export function snapshotRepoHashes(settings: PluginSettings, client: GitHubClient): Promise<Map<string, string>> {
  return repoHashesByName(settings, client);
}

/** After a plugin commit that touched only repo files: moves `repoBase` forward for icons that had no other repo change. */
export async function rebaseRepoSide(
  settings: PluginSettings,
  client: GitHubClient,
  sets: readonly ComponentSetNode[],
  before: ReadonlyMap<string, string>
): Promise<void> {
  const after = await repoHashesByName(settings, client);
  for (const set of sets) {
    const name = readSetIdentity(set).name || set.name;
    const next = after.get(name);
    if (next && readBases(set).repoBase === before.get(name)) writeBases(set, { figmaBase: null, repoBase: next });
  }
}
