import { strict as assert } from "node:assert";
import { test } from "node:test";
import { groupRepoIcons } from "../src/main/repo-tree";
import type { TreeEntry } from "../src/main/repo-tree";
import { figmaStateHash, parseRowFields } from "../src/main/contract";

const blob = (path: string, sha: string): TreeEntry => ({ path, type: "blob", sha });

const tree: TreeEntry[] = [
  { path: "core", type: "tree", sha: "t0" },
  blob("core/README.md", "r0"),
  blob("core/sb/README.md", "r1"),
  blob("core/sb/fdsi-live/meta.json", "m1"),
  blob("core/sb/fdsi-live/fdsi-live-reg-outline.svg", "s1"),
  blob("core/sb/fdsi-live/fdsi-live-reg-solid.svg", "s2"),
  blob("core/global/fdsi-home/meta.json", "m2"),
  blob("core/global/fdsi-home/notes.txt", "n"),
  blob("core/global/orphan/fdsi-x.svg", "x"),
  blob("other/sb/fdsi-live/meta.json", "o"),
  blob("core/sb/fdsi-live/nested/meta.json", "deep"),
];

test("groupRepoIcons keeps only icon directories of the brand that have a meta.json", () => {
  const icons = groupRepoIcons(tree, "core");
  assert.deepEqual(
    icons.map((i) => [i.name, i.area, i.path]),
    [
      ["fdsi-home", "global", "core/global/fdsi-home"],
      ["fdsi-live", "sb", "core/sb/fdsi-live"],
    ]
  );
});

test("an icon hash changes with any svg or meta.json blob, but not with unrelated files or order", () => {
  const base = groupRepoIcons(tree, "core").find((i) => i.name === "fdsi-live")!.hash;
  const reordered = groupRepoIcons([...tree].reverse(), "core").find((i) => i.name === "fdsi-live")!.hash;
  assert.equal(reordered, base);

  const edited = tree.map((e) => (e.path.endsWith("reg-solid.svg") ? { ...e, sha: "changed" } : e));
  assert.notEqual(groupRepoIcons(edited, "core").find((i) => i.name === "fdsi-live")!.hash, base);

  const metaEdited = tree.map((e) => (e.path === "core/sb/fdsi-live/meta.json" ? { ...e, sha: "changed" } : e));
  assert.notEqual(groupRepoIcons(metaEdited, "core").find((i) => i.name === "fdsi-live")!.hash, base);

  const unrelated = tree.map((e) => (e.path === "core/sb/README.md" ? { ...e, sha: "changed" } : e));
  assert.equal(groupRepoIcons(unrelated, "core").find((i) => i.name === "fdsi-live")!.hash, base);
});

test("figmaStateHash separates artwork changes, metadata changes and a missing row", () => {
  const fields = parseRowFields({ name: "fdsi-a", displayName: "A", area: "sb", status: "active" });
  const base = figmaStateHash("art1", fields);
  assert.equal(figmaStateHash("art1", { ...fields }), base);
  assert.notEqual(figmaStateHash("art2", fields), base);
  assert.notEqual(figmaStateHash("art1", { ...fields, displayName: "B" }), base);
  assert.notEqual(figmaStateHash("art1", null), base);
});
