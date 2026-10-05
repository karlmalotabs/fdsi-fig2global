import { strict as assert } from "node:assert";
import { test } from "node:test";
import { buildIconMeta, describeMetaChanges } from "../src/main/meta-build";
import { parseRowFields } from "../src/main/contract";
import type { IconMeta } from "../src/main/types";

const now = new Date("2026-10-05T12:00:00.000Z");
const variants = [{ size: "reg" as const, style: "outline" as const, file: "fdsi-a-reg-outline.svg" }];

const fields = parseRowFields({
  name: "fdsi-a",
  displayName: "A",
  description: "An icon",
  area: "sb",
  tags: "Sport, Live",
  aliases: "fdsi-old_a",
  status: "active",
});

const base = { fields, brand: "core", existing: null, previousName: null, variants, nodeId: "1:2", artworkHash: "h", now };

test("meta.json takes every designer-editable field from the row", () => {
  const meta = buildIconMeta(base);
  assert.equal(meta.displayName, "A");
  assert.equal(meta.description, "An icon");
  assert.deepEqual(meta.tags, ["sport", "live"]);
  assert.deepEqual(meta.aliases, ["fdsi-old_a"]);
  assert.equal(meta.status, "active");
  assert.equal(meta.deprecatedInFavorOf, null);
  assert.equal(meta.createdAt, "2026-10-05");
  assert.equal(meta.version, "0.1.0");
});

test("a rename adds the old name to aliases once", () => {
  const meta = buildIconMeta({ ...base, previousName: "fdsi-before" });
  assert.deepEqual(meta.aliases, ["fdsi-old_a", "fdsi-before"]);
  const again = buildIconMeta({
    ...base,
    fields: { ...fields, aliases: ["fdsi-before"] },
    previousName: "fdsi-before",
  });
  assert.deepEqual(again.aliases, ["fdsi-before"]);
});

test("version, createdAt and componentKey survive from the existing meta", () => {
  const existing = {
    version: "1.2.0",
    createdAt: "2025-01-01",
    figma: { nodeId: "x", componentKey: "key", lastSyncedHash: null, lastSyncedAt: null },
  } as IconMeta;
  const meta = buildIconMeta({ ...base, existing });
  assert.equal(meta.version, "1.2.0");
  assert.equal(meta.createdAt, "2025-01-01");
  assert.equal(meta.figma?.componentKey, "key");
  assert.equal(meta.figma?.nodeId, "1:2");
});

test("deprecatedInFavorOf is dropped unless the status is deprecated", () => {
  const stale = { ...fields, deprecatedInFavorOf: "fdsi-b" };
  assert.equal(buildIconMeta({ ...base, fields: stale }).deprecatedInFavorOf, null);
  const deprecated = { ...stale, status: "deprecated" };
  assert.equal(buildIconMeta({ ...base, fields: deprecated }).deprecatedInFavorOf, "fdsi-b");
});

test("describeMetaChanges reports changed fields only, and ignores list order", () => {
  const before = buildIconMeta(base);
  assert.deepEqual(describeMetaChanges(null, before), ["new icon"]);
  assert.deepEqual(describeMetaChanges(before, { ...before, tags: ["live", "sport"] }), []);
  const after = { ...before, description: "", status: "draft" as const };
  assert.deepEqual(describeMetaChanges(before, after), [
    'description: "An icon" \u2192 ""',
    'status: "active" \u2192 "draft"',
  ]);
});
