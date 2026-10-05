import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  combineHashes,
  computeSyncState,
  fieldLayerName,
  hashRowFields,
  joinRowsAndSets,
  LEGACY_FIELD_ORDER,
  parseFieldLayerName,
  parseList,
  parseRowFields,
  parseRowLayerName,
  rowLayerName,
  validateRowFields,
  type RowFields,
  type ValidationContext,
} from "../src/main/contract";
import { compareSvg } from "../src/main/hash-check";

const ctx: ValidationContext = {
  knownAreas: ["global", "sb", "gx"],
  allowNewArea: false,
  others: [
    { name: "fdsi-live", aliases: [] },
    { name: "fdsi-my-games", aliases: ["fdsi-my_games"] },
  ],
};

const valid: RowFields = {
  name: "fdsi-search",
  displayName: "Search",
  description: "",
  area: "global",
  tags: ["search"],
  aliases: [],
  status: "active",
  deprecatedInFavorOf: null,
};

test("layer names round-trip and reject unknown keys", () => {
  assert.equal(fieldLayerName("displayName"), "field/displayName");
  assert.equal(parseFieldLayerName("field/displayName"), "displayName");
  assert.equal(parseFieldLayerName("field/unknown"), null);
  assert.equal(parseFieldLayerName("displayName"), null);
  assert.equal(parseRowLayerName(rowLayerName("fdsi-home")), "fdsi-home");
  assert.equal(parseRowLayerName("row/"), null);
  assert.equal(parseRowLayerName("header"), null);
});

test("parseList trims, dedupes and ignores the empty placeholder", () => {
  assert.deepEqual(parseList(" a, b ,a,\n c ,, "), ["a", "b", "c"]);
  assert.deepEqual(parseList("—"), []);
  assert.deepEqual(parseList(undefined), []);
});

test("parseRowFields normalises case and empty values", () => {
  const fields = parseRowFields({
    name: " fdsi-search ",
    displayName: "Search",
    description: "—",
    area: " SB ",
    tags: "Search, Magnifier",
    aliases: "fdsi-find",
    status: "Active",
    deprecatedInFavorOf: "—",
  });
  assert.equal(fields.name, "fdsi-search");
  assert.equal(fields.description, "");
  assert.equal(fields.area, "sb");
  assert.deepEqual(fields.tags, ["search", "magnifier"]);
  assert.equal(fields.status, "active");
  assert.equal(fields.deprecatedInFavorOf, null);
});

test("a valid row passes", () => {
  assert.deepEqual(validateRowFields(valid, ctx), []);
});

test("name must match the pattern and be unique", () => {
  assert.equal(validateRowFields({ ...valid, name: "search" }, ctx).length, 1);
  assert.ok(validateRowFields({ ...valid, name: "fdsi-live" }, ctx).some((e) => e.includes("already used")));
  assert.ok(validateRowFields({ ...valid, name: "fdsi-my_games" }, ctx).some((e) => e.includes("must match")));
});

test("area must exist unless creation is confirmed", () => {
  const unknownArea = { ...valid, area: "payments" };
  assert.ok(validateRowFields(unknownArea, ctx).some((e) => e.includes("does not exist yet")));
  assert.deepEqual(validateRowFields(unknownArea, { ...ctx, allowNewArea: true }), []);
  assert.ok(validateRowFields({ ...valid, area: "Bad Area" }, ctx).some((e) => e.includes("kebab-case")));
  assert.ok(validateRowFields({ ...valid, area: "" }, ctx).some((e) => e.includes("area is required")));
});

test("aliases may use underscores but cannot collide", () => {
  assert.deepEqual(validateRowFields({ ...valid, aliases: ["fdsi-find_it"] }, ctx), []);
  assert.ok(validateRowFields({ ...valid, aliases: ["fdsi-live"] }, ctx).some((e) => e.includes("collides")));
  assert.ok(validateRowFields({ ...valid, aliases: ["fdsi-my_games"] }, ctx).some((e) => e.includes("already used")));
  assert.ok(validateRowFields({ ...valid, aliases: ["fdsi-search"] }, ctx).some((e) => e.includes("equals the icon name")));
  assert.ok(validateRowFields({ ...valid, aliases: ["find"] }, ctx).some((e) => e.includes("must start with fdsi-")));
});

test("status and deprecation rules", () => {
  assert.ok(validateRowFields({ ...valid, status: "" }, ctx).some((e) => e.includes("status is required")));
  assert.ok(validateRowFields({ ...valid, status: "retired" }, ctx).some((e) => e.includes("must be one of")));
  assert.ok(validateRowFields({ ...valid, status: "deprecated" }, ctx).some((e) => e.includes("is required when")));
  assert.ok(
    validateRowFields({ ...valid, status: "deprecated", deprecatedInFavorOf: "fdsi-nope" }, ctx).some((e) =>
      e.includes("not an existing icon")
    )
  );
  assert.deepEqual(validateRowFields({ ...valid, status: "deprecated", deprecatedInFavorOf: "fdsi-live" }, ctx), []);
  assert.ok(validateRowFields({ ...valid, deprecatedInFavorOf: "fdsi-live" }, ctx).some((e) => e.includes("only valid when")));
});

test("tags must be lowercase slugs", () => {
  assert.ok(validateRowFields({ ...valid, tags: ["two words"] }, ctx).some((e) => e.includes("tag")));
});

test("metadata hash ignores tag and alias order but not content", () => {
  const a = { ...valid, tags: ["a", "b"], aliases: ["fdsi-x", "fdsi-y"] };
  const b = { ...valid, tags: ["b", "a"], aliases: ["fdsi-y", "fdsi-x"] };
  assert.equal(hashRowFields(a), hashRowFields(b));
  assert.notEqual(hashRowFields(a), hashRowFields({ ...a, description: "changed" }));
  assert.notEqual(hashRowFields(a), hashRowFields({ ...a, area: "sb" }));
});

test("combined hash changes when either part changes", () => {
  const base = combineHashes("aaaa", "bbbb");
  assert.notEqual(base, combineHashes("aaab", "bbbb"));
  assert.notEqual(base, combineHashes("aaaa", "bbbc"));
  assert.equal(base, combineHashes("aaaa", "bbbb"));
});

test("compareSvg distinguishes identical, whitespace-only and different", () => {
  const repo = '<svg width="24" height="24">\n  <path d="M0 0"/>\n</svg>';
  assert.deepEqual(compareSvg(repo, repo), { status: "identical" });
  assert.deepEqual(compareSvg(repo, '<svg width="24" height="24"> <path d="M0 0"/> </svg>'), { status: "whitespace-only" });

  const reordered = compareSvg(repo, '<svg height="24" width="24"><path d="M0 0"/></svg>');
  assert.equal(reordered.status, "different");
  assert.equal(reordered.firstDiff?.index, 5);
});

test("sync state matrix", () => {
  const s = (figmaHash: string | null, repoHash: string | null, figmaBase: string | null, repoBase: string | null, duplicate = false) =>
    computeSyncState({ duplicate, figmaHash, repoHash, figmaBase, repoBase });

  assert.equal(s("f", "r", "f", "r", true), "duplicate");
  assert.equal(s(null, null, null, null), "draft");
  assert.equal(s(null, "r", null, null), "new-in-repo");
  assert.equal(s("f", null, null, null), "new-in-figma");

  // Figma's export hash legitimately differs from the repo hash; that alone is not a change.
  assert.equal(s("f", "r", "f", "r"), "in-sync");
  assert.equal(s("f2", "r", "f", "r"), "changed-in-figma");
  assert.equal(s("f", "r2", "f", "r"), "changed-in-repo");
  assert.equal(s("f2", "r2", "f", "r"), "conflict");

  // A missing base on either side: never pick a direction.
  assert.equal(s("f", "r", null, "r"), "unknown");
  assert.equal(s("f", "r", "f", null), "unknown");
  assert.equal(s("f", "r", null, null), "unknown");
});

test("joinRowsAndSets finds missing rows, orphan rows and duplicates, ignoring blank names", () => {
  const join = joinRowsAndSets(["fdsi-a", "fdsi-b", "fdsi-b", "", "fdsi-orphan"], ["fdsi-a", "fdsi-b", "fdsi-new", "fdsi-new"]);
  assert.deepEqual(join.setsWithoutRow, ["fdsi-new"]);
  assert.deepEqual(join.rowsWithoutSet, ["fdsi-orphan"]);
  assert.deepEqual(join.duplicateRows, ["fdsi-b"]);
  assert.deepEqual(join.duplicateSets, ["fdsi-new"]);
});

test("legacy cell order maps onto real field keys", () => {
  assert.equal(LEGACY_FIELD_ORDER.length, 7);
  for (const key of LEGACY_FIELD_ORDER) assert.equal(parseFieldLayerName(fieldLayerName(key)), key);
});
