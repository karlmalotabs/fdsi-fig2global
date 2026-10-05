import { strict as assert } from "node:assert";
import { test } from "node:test";
import { identitiesFor, pushableEntries, toLibraryItems } from "../src/main/library";
import type { ScanEntry } from "../src/main/scan";
import type { SyncState } from "../src/main/contract";
import type { TableRow } from "../src/main/table";

function fakeSet(id: string, name: string, data: Record<string, string> = {}): ComponentSetNode {
  return { id, name, getPluginData: (key: string) => data[key] ?? "" } as unknown as ComponentSetNode;
}

function entry(name: string, state: SyncState, over: Partial<ScanEntry> = {}): ScanEntry {
  return {
    name,
    currentName: name,
    state,
    renamed: false,
    errors: [],
    set: fakeSet(`id-${name}`, name),
    row: null,
    repo: null,
    figmaHash: null,
    repoHash: null,
    pendingPr: null,
    ...over,
  };
}

const repo = (area: string, status: "active" | "deprecated" | "draft" = "active") =>
  ({ name: "x", area, brand: "core", path: `core/${area}/x`, hash: "h", status, aliases: [] }) as unknown as ScanEntry["repo"];

test("only changed-in-figma and new-in-figma sets are pushable", () => {
  const items = toLibraryItems([
    entry("a", "changed-in-figma"),
    entry("b", "new-in-figma"),
    entry("c", "in-sync"),
    entry("d", "conflict"),
    entry("e", "changed-in-figma", { set: null }),
  ]);
  assert.deepEqual(items.map((i) => i.pushable), [true, true, false, false, false]);
});

test("deprecated and draft repo icons are not offered for pull", () => {
  const items = toLibraryItems([
    entry("a", "changed-in-repo", { repo: repo("sb") }),
    entry("b", "new-in-repo", { set: null, repo: repo("sb", "deprecated") }),
    entry("c", "new-in-repo", { set: null, repo: repo("sb", "draft") }),
  ]);
  assert.deepEqual(items.map((i) => i.pullable), [true, false, false]);
});

test("pushableEntries drops unknown names and entries that are no longer pushable", () => {
  const entries = [entry("a", "changed-in-figma"), entry("b", "in-sync"), entry("c", "new-in-figma")];
  assert.deepEqual(pushableEntries(entries, ["a", "b", "zzz"]).map((e) => e.name), ["a"]);
});

test("identities use the live layer name and the fresh row area, falling back to the last pushed area", () => {
  const renamed = entry("old", "changed-in-figma", { set: fakeSet("s1", "new-name", { fdsiArea: "sb" }) });
  const plain = entry("plain", "new-in-figma", { set: fakeSet("s2", "plain", { fdsiBrand: "bx" }) });
  const rows = [{ fields: { name: "new-name", area: "global" } }] as unknown as TableRow[];

  const ids = identitiesFor([renamed, plain], rows, "core");
  assert.deepEqual(ids.s1, { name: "new-name", brand: "core", area: "global" });
  assert.deepEqual(ids.s2, { name: "plain", brand: "bx", area: "" });
});
