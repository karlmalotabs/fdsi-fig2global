import type { ScanEntry } from "./scan";
import type { SyncState } from "./contract";
import type { PushIdentity } from "./push";
import type { TableRow } from "./table";

/** Plain-data view of one scan entry; this is what crosses to the UI (no Figma nodes). */
export interface LibraryItem {
  /** Join key: stable across a rename, so the UI can keep selection between scans. */
  name: string;
  currentName: string;
  displayName: string;
  area: string;
  state: SyncState;
  renamed: boolean;
  errors: string[];
  pendingPr: number | null;
  hasSet: boolean;
  hasRow: boolean;
  /** Can be written to the repo from Figma. */
  pushable: boolean;
  /** Can be brought in from the repo. */
  pullable: boolean;
}

const PUSH_STATES: ReadonlySet<SyncState> = new Set(["changed-in-figma", "new-in-figma"]);
const PULL_STATES: ReadonlySet<SyncState> = new Set(["changed-in-repo", "new-in-repo"]);

export function toLibraryItems(entries: readonly ScanEntry[]): LibraryItem[] {
  return entries.map((e) => ({
    name: e.name,
    currentName: e.currentName,
    displayName: e.row?.fields.displayName ?? "",
    area: e.row?.fields.area || e.repo?.area || e.set?.getPluginData("fdsiArea") || "",
    state: e.state,
    renamed: e.renamed,
    errors: e.errors,
    pendingPr: e.pendingPr,
    hasSet: e.set !== null,
    hasRow: e.row !== null,
    pushable: e.set !== null && PUSH_STATES.has(e.state),
    pullable: PULL_STATES.has(e.state) && e.repo !== null && e.repo.status !== "deprecated" && e.repo.status !== "draft",
  }));
}

/** Entries to push for the chosen join keys; ignores keys that are not pushable any more (e.g. a stale selection). */
export function pushableEntries(entries: readonly ScanEntry[], names: readonly string[]): ScanEntry[] {
  const wanted = new Set(names);
  return entries.filter((e) => wanted.has(e.name) && e.set !== null && PUSH_STATES.has(e.state));
}

/** Identity per set from its live layer name and the freshly read rows (the scan may be stale); area falls back to the last pushed or repo area. */
export function identitiesFor(
  entries: readonly ScanEntry[],
  rows: readonly TableRow[],
  brand: string
): Record<string, PushIdentity> {
  const result: Record<string, PushIdentity> = {};
  for (const e of entries) {
    if (!e.set) continue;
    const name = e.set.name;
    const row = rows.find((r) => r.fields.name === name) ?? null;
    result[e.set.id] = {
      name,
      brand: e.set.getPluginData("fdsiBrand") || brand,
      area: row?.fields.area || e.set.getPluginData("fdsiArea") || e.repo?.area || "",
    };
  }
  return result;
}
