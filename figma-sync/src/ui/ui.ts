import type { PluginSettings, SyncPlanEntry, WriteMode } from "../main/types";
import type { PullResult } from "../main/pull";
import type { LibraryItem } from "../main/library";
import type { CommitOutcome } from "../main/commit-changes";
import type { TableMigration } from "../main/table";
import { syncStatusLabel } from "../main/contract";

type Tab = "library" | "activity" | "settings";
type FilterId = "all" | "push" | "pull" | "conflict" | "invalid" | "unknown";
type Tone = "ok" | "info" | "warn" | "bad" | "pr" | "";
type EventKind = "pr" | "scan" | "error" | "pull" | "push" | "info";

interface ActivityEvent {
  kind: EventKind;
  title: string;
  detail: string;
  link?: string;
  at: number;
}

const MAX_EVENTS = 20;
const FILTERS: { id: FilterId; label: string; test: (i: LibraryItem) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "push", label: "To push", test: (i) => i.pushable },
  { id: "pull", label: "To pull", test: (i) => i.pullable },
  { id: "conflict", label: "Conflicts", test: (i) => i.state === "conflict" || i.state === "duplicate" },
  { id: "invalid", label: "Invalid", test: (i) => i.errors.length > 0 },
  { id: "unknown", label: "No baseline", test: (i) => i.state === "unknown" },
];
const EVENT_BADGES: Record<EventKind, { letter: string; tone: Tone }> = {
  pr: { letter: "PR", tone: "pr" },
  scan: { letter: "S", tone: "info" },
  error: { letter: "!", tone: "bad" },
  pull: { letter: "\u2193", tone: "ok" },
  push: { letter: "\u2191", tone: "ok" },
  info: { letter: "i", tone: "" },
};

function byId<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

type Attrs = Record<string, string | boolean | (() => void)>;

/** Builds elements with textContent only, so icon names and error messages are never parsed as markup. */
function h(tag: string, attrs: Attrs = {}, ...kids: (Node | string | null | false)[]): HTMLElement {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") el.className = value as string;
    else if (key === "onclick") el.onclick = value as () => void;
    else if (typeof value === "boolean") {
      if (value) el.setAttribute(key, "");
    } else el.setAttribute(key, value as string);
  }
  for (const kid of kids) if (kid) el.append(kid);
  return el;
}

const el = {
  target: byId("target"),
  modeTag: byId("mode-tag"),
  scan: byId<HTMLButtonElement>("scan"),
  countLibrary: byId("count-library"),
  countActivity: byId("count-activity"),
  banner: byId("banner"),
  bannerText: byId("banner-text"),
  baselineBanner: byId("baseline-banner"),
  baselineText: byId("baseline-text"),
  filters: byId("filters"),
  selectVisible: byId<HTMLInputElement>("select-visible"),
  listSummary: byId("list-summary"),
  list: byId("list"),
  selectedText: byId("selected-text"),
  selectChanged: byId<HTMLButtonElement>("select-changed"),
  pull: byId<HTMLButtonElement>("pull"),
  review: byId<HTMLButtonElement>("review"),
  reviewSub: byId("review-sub"),
  reviewMode: byId("review-mode"),
  allowNewArea: byId<HTMLInputElement>("allow-new-area"),
  plan: byId("plan"),
  reviewStatus: byId("review-status"),
  reviewHint: byId("review-hint"),
  cancelPush: byId<HTMLButtonElement>("cancel-push"),
  confirmPush: byId<HTMLButtonElement>("confirm-push"),
  activity: byId("activity"),
  token: byId<HTMLInputElement>("token"),
  owner: byId<HTMLInputElement>("owner"),
  repo: byId<HTMLInputElement>("repo"),
  branch: byId<HTMLInputElement>("branch"),
  brand: byId<HTMLInputElement>("brand"),
  connection: byId("connection"),
  grip: byId("grip"),
};

let tab: Tab = "library";
let reviewing = false;
let busy = false;
let scanned = false;
let filter: FilterId = "all";
let items: LibraryItem[] = [];
let previews: Record<string, string> = {};
const selected = new Set<string>();
let writeMode: WriteMode = "direct";
let plan: SyncPlanEntry[] | null = null;
let reviewError = "";
let pendingChanges = 0;
let events: ActivityEvent[] = [];
let explicitSave = false;

function send(type: string, payload: Record<string, unknown> = {}): void {
  parent.postMessage({ pluginMessage: { type, ...payload } }, "*");
}

function currentSettings(): PluginSettings {
  return {
    token: el.token.value.trim(),
    owner: el.owner.value.trim(),
    repo: el.repo.value.trim(),
    branch: el.branch.value.trim() || "main",
    brand: el.brand.value.trim() || "core",
    writeMode,
  };
}

function isConfigured(): boolean {
  const s = currentSettings();
  return Boolean(s.token && s.owner && s.repo);
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function ago(at: number): string {
  const minutes = Math.floor((Date.now() - at) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours} h ago` : `${Math.floor(hours / 24)} d ago`;
}

function addEvent(kind: EventKind, title: string, detail = "", link?: string): void {
  events = [{ kind, title, detail, link, at: Date.now() }, ...events].slice(0, MAX_EVENTS);
  renderActivity();
}

function setBusy(next: boolean): void {
  busy = next;
  render();
}

// ---------- library ----------

function statusChip(item: LibraryItem): { label: string; tone: Tone; title: string } {
  if (item.pendingPr !== null) return { label: `PR #${item.pendingPr} open`, tone: "pr", title: "Waiting for the pull request to merge" };
  if (item.errors.length > 0) return { label: "Invalid", tone: "bad", title: item.errors.join("\n") };
  const label = syncStatusLabel(item.state);
  const tones: Record<string, Tone> = {
    "in-sync": "ok",
    "changed-in-figma": "info",
    "new-in-figma": "info",
    "changed-in-repo": "warn",
    "new-in-repo": "warn",
    conflict: "bad",
    duplicate: "bad",
    unknown: "",
    draft: "",
  };
  const short = item.state === "unknown" ? "No baseline" : item.state === "draft" ? "Draft" : label;
  return { label: short, tone: tones[item.state] ?? "", title: label };
}

function visibleItems(): LibraryItem[] {
  const active = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
  return items.filter(active.test);
}

function previewNode(name: string): HTMLElement {
  const svg = previews[name];
  const glyph = h("i");
  if (svg) glyph.style.setProperty("--mask", `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`);
  return h("div", { class: svg ? "preview" : "preview empty" }, glyph);
}

function renderItem(item: LibraryItem): HTMLElement {
  const chip = statusChip(item);
  const isSelected = selected.has(item.name);
  const box = h("input", { type: "checkbox", class: "check", "aria-label": `Select ${item.currentName}` }) as HTMLInputElement;
  box.checked = isSelected;
  box.disabled = !item.pushable || busy;
  box.onclick = (event) => {
    event.stopPropagation();
    if (box.checked) selected.add(item.name);
    else selected.delete(item.name);
    render();
  };

  const second = item.renamed ? `renamed from ${item.name}` : item.displayName || (item.hasSet ? "" : "not in this file yet");
  const info = h(
    "div",
    { style: "min-width:0" },
    h("div", { class: "name" }, item.currentName),
    second ? h("div", { class: "meta" }, second) : null,
    item.errors.length > 0 ? h("div", { class: "err" }, item.errors[0]) : null
  );
  const row = h(
    "div",
    { class: isSelected ? "item selected" : "item", title: item.hasSet ? "Select this icon in Figma" : "" },
    box,
    previewNode(item.name),
    info,
    h("div", { class: "area" }, item.area),
    h("span", { class: `chip ${chip.tone}`, title: chip.title }, chip.label)
  );
  row.onclick = () => {
    if (item.hasSet) send("focus-icon", { name: item.name });
  };
  return row;
}

function renderFilters(): void {
  el.filters.replaceChildren(
    ...FILTERS.map((f) => {
      const count = items.filter(f.test).length;
      if (f.id !== "all" && count === 0 && f.id !== filter) return null;
      return h(
        "button",
        {
          class: f.id === filter ? "filter active" : "filter",
          onclick: () => {
            filter = f.id;
            render();
          },
        },
        `${f.label} ${count}`
      );
    }).filter((node): node is HTMLElement => node !== null)
  );
}

function renderEmpty(): HTMLElement {
  if (!isConfigured()) {
    return h(
      "div",
      { class: "empty" },
      h("div", { class: "big" }, "Connect to GitHub"),
      h("div", {}, "Add your token and repository to compare this file with the icon repo."),
      h("button", { class: "btn primary", onclick: () => showTab("settings") }, "Open settings")
    );
  }
  if (!scanned) {
    return h("div", { class: "empty" }, h("div", { class: "big" }, busy ? "Scanning\u2026" : "Nothing scanned yet"), h("div", {}, "Scan compares every icon in this file with the repo."));
  }
  return h("div", { class: "empty" }, h("div", { class: "big" }, filter === "all" ? "No icons found" : "Nothing in this filter"));
}

function renderLibrary(): void {
  const visible = visibleItems();
  el.countLibrary.textContent = String(items.length);
  renderFilters();

  el.list.replaceChildren(...(visible.length ? visible.map(renderItem) : [renderEmpty()]));
  const pushableVisible = visible.filter((i) => i.pushable);
  el.selectVisible.disabled = pushableVisible.length === 0 || busy;
  el.selectVisible.checked = pushableVisible.length > 0 && pushableVisible.every((i) => selected.has(i.name));
  el.listSummary.textContent = items.length ? `${plural(visible.length, "icon")}${visible.length !== items.length ? ` of ${items.length}` : ""}` : "No icons";

  const pushable = items.filter((i) => i.pushable);
  const pullCount = items.filter((i) => i.pullable).length;
  el.selectedText.textContent = selected.size ? `${selected.size} selected` : "No icons selected";
  el.selectChanged.hidden = pushable.length === 0 || pushable.every((i) => selected.has(i.name));
  el.pull.textContent = pullCount ? `Pull ${pullCount} from repo` : "Pull from repo";
  el.pull.disabled = busy || pullCount === 0;
  el.review.textContent = selected.size ? `Review push \u00b7 ${selected.size}` : "Review push";
  el.review.disabled = busy || selected.size === 0;

  el.banner.hidden = pendingChanges === 0;
  el.bannerText.textContent = `${plural(pendingChanges, "change")} in this file since the last scan.`;
  const unknown = items.filter((i) => i.state === "unknown").length;
  el.baselineBanner.hidden = unknown === 0;
  el.baselineText.textContent = `${plural(unknown, "icon")} ha${unknown === 1 ? "s" : "ve"} no baseline yet, so the direction of change is unknown.`;
}

// ---------- review ----------

function parseChange(line: string): { field: string; before: string; after: string } | null {
  const match = /^([A-Za-z]+): (.*) \u2192 (.*)$/.exec(line);
  return match ? { field: match[1], before: match[2], after: match[3] } : null;
}

function actionChip(entry: SyncPlanEntry): { label: string; tone: Tone } {
  if (entry.action === "skip") return { label: "Blocked", tone: "bad" };
  const changes = (entry.metaChanges ?? []).map(parseChange).filter((c): c is NonNullable<typeof c> => c !== null);
  const moved = changes.some((c) => c.field === "area");
  if (entry.action === "rename") return { label: moved ? "Rename + move" : "Rename", tone: "pr" };
  if (entry.action === "create") return { label: "New icon", tone: "ok" };
  return moved ? { label: "Move", tone: "pr" } : { label: "Update", tone: "info" };
}

function renderCard(entry: SyncPlanEntry): HTMLElement {
  const blocked = entry.validationErrors.length > 0 || entry.action === "skip";
  const chip = actionChip(entry);
  const writes = entry.files.filter((f) => !f.delete);
  const deletes = entry.files.filter((f) => f.delete);

  const lines = entry.metaChanges ?? [];
  const changes = lines.map((line) => {
    const parsed = parseChange(line);
    if (!parsed) return h("div", { class: "meta" }, line);
    return h(
      "div",
      { class: "change" },
      h("span", { class: "field" }, parsed.field),
      h("span", { class: "del" }, parsed.before || "(empty)"),
      h("span", { class: "sub" }, "\u2192"),
      h("span", { class: "add" }, parsed.after || "(empty)")
    );
  });

  const fileSummary = `${plural(writes.length, "file")} written${deletes.length ? ` \u00b7 ${deletes.length} deleted` : ""}`;
  return h(
    "div",
    { class: blocked ? "card blocked" : "card" },
    h(
      "div",
      { class: "card-head" },
      h(
        "div",
        {},
        h("div", { class: "name", style: "font-size:13px;font-weight:600" }, entry.iconName),
        h("div", { class: "sub" }, entry.renamedFrom ? `was ${entry.renamedFrom} \u00b7 ${entry.brand}/${entry.area}` : `${entry.brand}/${entry.area}`)
      ),
      h("span", { class: `chip ${chip.tone}` }, chip.label)
    ),
    ...changes,
    entry.validationErrors.length > 0 ? h("div", { class: "errbox" }, ...entry.validationErrors.flatMap((e, i) => (i ? [h("br"), e] : [e]))) : null,
    entry.files.length > 0
      ? h("details", {}, h("summary", {}, fileSummary), h("pre", {}, entry.files.map((f) => `${f.delete ? "delete" : "write "} ${f.path}`).join("\n")))
      : null
  );
}

function renderReview(): void {
  const settings = currentSettings();
  const blocked = plan ? plan.filter((p) => p.validationErrors.length > 0 || p.action === "skip").length : 0;
  const ready = plan ? plan.length - blocked : 0;

  el.reviewSub.textContent = plan ? `${plural(plan.length, "icon")} \u00b7 target branch ${settings.branch}` : "Building the plan\u2026";
  el.reviewMode.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.mode === writeMode));
  el.plan.replaceChildren(
    ...(reviewError ? [h("div", { class: "errbox" }, reviewError)] : []),
    ...(plan ? plan.map(renderCard) : [])
  );
  el.reviewStatus.textContent = !plan ? "" : blocked ? `${plural(blocked, "icon")} blocked` : `${plural(ready, "icon")} ready`;
  el.reviewStatus.style.color = blocked ? "var(--bad)" : "";
  el.reviewHint.textContent = !plan
    ? ""
    : blocked
      ? "Fix it in the table or go back and deselect it"
      : writeMode === "pr"
        ? `Opens a pull request against ${settings.branch}`
        : `Commits directly to ${settings.branch}`;
  el.confirmPush.textContent = writeMode === "pr" ? "Open pull request" : `Commit to ${settings.branch}`;
  el.confirmPush.disabled = busy || !plan || plan.length === 0 || blocked > 0;
  el.cancelPush.disabled = busy;
}

function requestPlan(): void {
  plan = null;
  reviewError = "";
  setBusy(true);
  send("prepare-push", { settings: currentSettings(), names: [...selected], allowNewArea: el.allowNewArea.checked });
}

function leaveReview(): void {
  if (reviewing) send("cancel-push");
  reviewing = false;
  plan = null;
  reviewError = "";
  render();
}

// ---------- activity and settings ----------

function renderActivity(): void {
  el.countActivity.textContent = String(events.length);
  if (events.length === 0) {
    el.activity.replaceChildren(h("div", { class: "empty" }, h("div", { class: "big" }, "No activity yet"), h("div", {}, "Scans, pulls and pull requests show up here.")));
    return;
  }
  const rows = events.map((e) => {
    const badge = EVENT_BADGES[e.kind];
    const safeLink = e.link && /^https:\/\/github\.com\//.test(e.link) ? e.link : null;
    return h(
      "div",
      { class: e.kind === "error" ? "event bad" : "event" },
      h("div", { class: `badge ${badge.tone}` }, badge.letter),
      h(
        "div",
        { class: "body" },
        h("div", { class: "t" }, e.title),
        safeLink ? h("a", { class: "d", href: safeLink, target: "_blank", rel: "noopener", style: "color:var(--brand-text)" }, safeLink) : null,
        e.detail ? h("div", { class: "d" }, e.detail) : null
      ),
      h("div", { class: "when" }, ago(e.at))
    );
  });
  el.activity.replaceChildren(
    ...rows,
    h("button", { class: "link", style: "align-self:flex-start", onclick: () => ((events = []), renderActivity()) }, "Clear")
  );
}

function renderSettings(): void {
  const settings = currentSettings();
  el.target.textContent = isConfigured() ? `${settings.brand} \u00b7 ${settings.branch}` : "not configured";
  el.modeTag.hidden = writeMode !== "pr";
  document.querySelectorAll<HTMLLabelElement>("label.radio").forEach((label) => {
    const on = label.dataset.mode === writeMode;
    label.classList.toggle("on", on);
    (label.querySelector("input") as HTMLInputElement).checked = on;
  });
}

function setWriteMode(mode: WriteMode): void {
  writeMode = mode;
  send("save-settings", { settings: currentSettings() });
  render();
}

// ---------- shell ----------

function showTab(next: Tab): void {
  tab = next;
  render();
}

function render(): void {
  const showReview = reviewing && tab === "library";
  byId("chrome").hidden = showReview;
  byId("view-library").hidden = tab !== "library" || reviewing;
  byId("view-review").hidden = !showReview;
  byId("view-activity").hidden = tab !== "activity";
  byId("view-settings").hidden = tab !== "settings";
  document.querySelectorAll<HTMLButtonElement>(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
  el.scan.disabled = busy;
  el.scan.textContent = busy && !reviewing ? "Working\u2026" : "Scan";
  renderSettings();
  renderLibrary();
  if (showReview) renderReview();
}

function startScan(): void {
  if (!isConfigured()) {
    showTab("settings");
    return;
  }
  setBusy(true);
  send("scan", { settings: currentSettings() });
}

function summarise(list: readonly LibraryItem[]): string {
  const counts = new Map<string, number>();
  for (const i of list) counts.set(i.state, (counts.get(i.state) ?? 0) + 1);
  return [...counts].map(([state, n]) => `${syncStatusLabel(state as LibraryItem["state"])} ${n}`).join(" \u00b7 ");
}

function describeOutcome(outcome: CommitOutcome): void {
  if (outcome.mode === "pr") addEvent("pr", `Opened PR #${outcome.number}`, outcome.branch, outcome.url);
  else addEvent("push", "Committed to the base branch", outcome.sha.slice(0, 7));
}

window.onmessage = (event: MessageEvent) => {
  const msg = event.data.pluginMessage;
  if (!msg) return;

  switch (msg.type) {
    case "settings": {
      const s = msg.settings as PluginSettings | null;
      if (s) {
        el.token.value = s.token;
        el.owner.value = s.owner;
        el.repo.value = s.repo;
        el.branch.value = s.branch;
        el.brand.value = s.brand;
        writeMode = s.writeMode === "pr" ? "pr" : "direct";
      }
      render();
      if (isConfigured()) startScan();
      break;
    }
    case "settings-saved":
      if (explicitSave) {
        explicitSave = false;
        addEvent("info", "Settings saved");
        setBusy(false);
        if (isConfigured() && !scanned) startScan();
      }
      break;
    case "scan-result": {
      items = msg.items as LibraryItem[];
      scanned = true;
      pendingChanges = 0;
      const known = new Set(items.filter((i) => i.pushable).map((i) => i.name));
      for (const name of [...selected]) if (!known.has(name)) selected.delete(name);
      el.connection.textContent = `Connected \u00b7 ${plural(items.length, "icon")} found in ${currentSettings().brand}`;
      addEvent("scan", `Scan: ${plural(items.length, "icon")}`, summarise(items) || "none");
      setBusy(false);
      break;
    }
    case "previews":
      previews = msg.previews as Record<string, string>;
      render();
      break;
    case "pending-changes":
      pendingChanges = msg.count as number;
      render();
      break;
    case "pull-result": {
      const r = msg.result as PullResult;
      const lines = [
        ...r.errors.map((e) => `${e.icon}: ${e.error}`),
        ...r.attention.map((a) => `Not touched: ${a.name} (${syncStatusLabel(a.state)})`),
      ];
      addEvent(
        r.errors.length ? "error" : "pull",
        `Pull: ${r.created.length} created, ${r.updated.length} updated`,
        lines.join("\n")
      );
      break;
    }
    case "post-publish-result": {
      const updated = msg.result.updated as string[];
      addEvent("info", "Post-publish sync", updated.length ? `Recorded componentKey for ${updated.join(", ")}` : "Nothing to record");
      setBusy(false);
      break;
    }
    case "adopt-baseline-result": {
      const adopted = msg.adopted as string[];
      addEvent("info", `Baseline adopted for ${plural(adopted.length, "icon")}`, adopted.join(", "));
      break;
    }
    case "hash-check-result": {
      const lines = msg.lines as string[];
      addEvent("info", "Hash check", lines.length ? lines.join("\n") : "Select one or more icon component sets in Figma first.");
      setBusy(false);
      break;
    }
    case "table-create-rows-result": {
      const created = msg.created as string[];
      const m = msg.migration as TableMigration;
      const detail = [
        created.join(", "),
        m.headerRebuilt || m.rowsRebuilt || m.rowsRenamed || m.fieldsAdded || m.setsMoved
          ? `Updated layout: header rebuilt ${m.headerRebuilt}, rows rebuilt ${m.rowsRebuilt}, rows renamed ${m.rowsRenamed}, fields added ${m.fieldsAdded}, icon sets moved into rows ${m.setsMoved}`
          : "",
        m.unrecognisedRows.length ? `Left unchanged (unexpected layout): ${m.unrecognisedRows.join(", ")}` : "",
      ].filter(Boolean);
      addEvent("info", `Table: created ${plural(created.length, "row")}`, detail.join("\n"));
      setBusy(false);
      break;
    }
    case "table-read-result":
      addEvent("info", "Table check", (msg.lines as string[]).join("\n"));
      setBusy(false);
      break;
    case "push-plan":
      plan = msg.plan as SyncPlanEntry[];
      setBusy(false);
      break;
    case "push-committed":
      describeOutcome(msg.outcome as CommitOutcome);
      reviewing = false;
      plan = null;
      selected.clear();
      render();
      break;
    case "error": {
      const message = msg.message as string;
      addEvent("error", "Something went wrong", message);
      if (reviewing) reviewError = message;
      setBusy(false);
      break;
    }
    default:
      break;
  }
};

document.querySelectorAll<HTMLButtonElement>(".tab").forEach((t) => {
  t.onclick = () => showTab(t.dataset.tab as Tab);
});
document.querySelectorAll<HTMLLabelElement>("label.radio").forEach((label) => {
  label.onclick = (event) => {
    event.preventDefault();
    setWriteMode(label.dataset.mode as WriteMode);
  };
});
el.reviewMode.querySelectorAll("button").forEach((b) => {
  b.onclick = () => {
    writeMode = b.dataset.mode as WriteMode;
    send("save-settings", { settings: currentSettings() });
    render();
  };
});

el.scan.onclick = startScan;
byId<HTMLButtonElement>("banner-scan").onclick = startScan;
byId<HTMLButtonElement>("banner-dismiss").onclick = () => {
  pendingChanges = 0;
  send("dismiss-changes");
  render();
};
byId<HTMLButtonElement>("adopt-baseline").onclick = () => {
  setBusy(true);
  send("adopt-baseline", { settings: currentSettings() });
};
el.selectChanged.onclick = () => {
  for (const i of items) if (i.pushable) selected.add(i.name);
  render();
};
el.selectVisible.onclick = () => {
  const visible = visibleItems().filter((i) => i.pushable);
  for (const i of visible) {
    if (el.selectVisible.checked) selected.add(i.name);
    else selected.delete(i.name);
  }
  render();
};
el.pull.onclick = () => {
  setBusy(true);
  send("pull", { settings: currentSettings() });
};
el.review.onclick = () => {
  reviewing = true;
  render();
  requestPlan();
};
el.allowNewArea.onchange = requestPlan;
byId<HTMLButtonElement>("back").onclick = leaveReview;
el.cancelPush.onclick = leaveReview;
el.confirmPush.onclick = () => {
  reviewError = "";
  setBusy(true);
  send("confirm-push", { settings: currentSettings() });
};

byId<HTMLButtonElement>("save-settings").onclick = () => {
  explicitSave = true;
  setBusy(true);
  send("save-settings", { settings: currentSettings() });
  render();
};
for (const input of [el.token, el.owner, el.repo, el.branch, el.brand]) input.oninput = render;
byId<HTMLButtonElement>("table-create-rows").onclick = () => {
  setBusy(true);
  send("table-create-rows");
};
byId<HTMLButtonElement>("table-read").onclick = () => {
  setBusy(true);
  send("table-read", { settings: currentSettings() });
};
byId<HTMLButtonElement>("hash-check").onclick = () => {
  setBusy(true);
  send("hash-check", { settings: currentSettings() });
};
byId<HTMLButtonElement>("post-publish").onclick = () => {
  setBusy(true);
  send("post-publish-sync", { settings: currentSettings() });
};

let resizeFrame = 0;
el.grip.onpointerdown = (down: PointerEvent) => {
  el.grip.setPointerCapture(down.pointerId);
  const offsetX = window.innerWidth - down.clientX;
  const offsetY = window.innerHeight - down.clientY;
  el.grip.onpointermove = (move: PointerEvent) => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => send("resize", { width: move.clientX + offsetX, height: move.clientY + offsetY }));
  };
  el.grip.onpointerup = () => {
    el.grip.onpointermove = null;
    el.grip.onpointerup = null;
  };
};

render();
send("ui-ready");
