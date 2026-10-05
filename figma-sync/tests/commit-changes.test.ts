import { strict as assert } from "node:assert";
import { test } from "node:test";
import { buildPrBody, prBranchName } from "../src/main/commit-changes";
import type { SyncPlanEntry } from "../src/main/types";

const entry = (over: Partial<SyncPlanEntry>): SyncPlanEntry => ({
  iconName: "fdsi-a",
  brand: "core",
  area: "sb",
  action: "update",
  files: [{ path: "core/sb/fdsi-a/meta.json", content: "{}" }, { path: "core/sb/fdsi-old/meta.json", delete: true }],
  validationErrors: [],
  ...over,
});

const now = new Date("2026-10-05T12:34:56.789Z");

test("PR branch name carries a UTC timestamp and the first icon", () => {
  assert.equal(prBranchName([entry({})], now), "figma-sync/20261005-123456-fdsi-a");
  assert.equal(
    prBranchName([entry({}), entry({ iconName: "fdsi-b" }), entry({ iconName: "fdsi-c" })], now),
    "figma-sync/20261005-123456-fdsi-a-and-2-more"
  );
});

test("PR body lists each icon with its metadata changes and file counts", () => {
  const body = buildPrBody([
    entry({ metaChanges: ['status: "active" \u2192 "draft"'] }),
    entry({ iconName: "fdsi-b", action: "rename", renamedFrom: "fdsi-before", files: [] }),
  ]);
  assert.match(body, /- \*\*update `fdsi-a`\*\* in `core\/sb`: 1 file\(s\) written, 1 deleted/);
  assert.match(body, / {2}- status: "active" \u2192 "draft"/);
  assert.match(body, /rename `fdsi-b` \(was `fdsi-before`\)/);
});
