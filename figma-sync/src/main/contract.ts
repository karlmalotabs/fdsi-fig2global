import type { IconMeta, IconStatus } from "./types";
import { ICON_NAME_PATTERN, isValidAreaSlug } from "./naming";
import { fnv1a64Hex } from "./hashing";

// Pure helpers for the Figma library contract (docs/figma-contract-and-plan.md); no Figma API access here.

export const ROW_LAYER_PREFIX = "row/";
export const FIELD_LAYER_PREFIX = "field/";
export const SYNC_STATUS_LAYER = "sync-status";
/** table.ts renders empty cells as this character so the text node is never zero-length. */
export const EMPTY_PLACEHOLDER = "—";

export const ROW_FIELD_KEYS = [
  "name",
  "displayName",
  "description",
  "area",
  "tags",
  "aliases",
  "status",
  "deprecatedInFavorOf",
] as const;
export type RowFieldKey = (typeof ROW_FIELD_KEYS)[number];

/** Text content of each `field/<key>` layer, as typed by the designer. */
export type RawRowFields = Partial<Record<RowFieldKey, string>>;

export interface RowFields {
  name: string;
  displayName: string;
  description: string;
  area: string;
  tags: string[];
  aliases: string[];
  /** Kept as a plain string so invalid input reaches validation instead of being coerced. */
  status: string;
  deprecatedInFavorOf: string | null;
}

const STATUSES: readonly IconStatus[] = ["active", "deprecated", "draft"];
const ALIAS_PATTERN = /^fdsi-[a-z0-9]+([-_][a-z0-9]+)*$/;
const TAG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export function fieldLayerName(key: RowFieldKey): string {
  return `${FIELD_LAYER_PREFIX}${key}`;
}

export function rowLayerName(iconName: string): string {
  return `${ROW_LAYER_PREFIX}${iconName}`;
}

export function parseFieldLayerName(layerName: string): RowFieldKey | null {
  if (!layerName.startsWith(FIELD_LAYER_PREFIX)) return null;
  const key = layerName.slice(FIELD_LAYER_PREFIX.length);
  return (ROW_FIELD_KEYS as readonly string[]).includes(key) ? (key as RowFieldKey) : null;
}

export function parseRowLayerName(layerName: string): string | null {
  if (!layerName.startsWith(ROW_LAYER_PREFIX)) return null;
  return layerName.slice(ROW_LAYER_PREFIX.length) || null;
}

function cleanText(text: string | undefined): string {
  const trimmed = (text ?? "").trim();
  return trimmed === EMPTY_PLACEHOLDER ? "" : trimmed;
}

/** Splits on commas/newlines, trims, drops empties and duplicates (first occurrence wins). */
export function parseList(text: string | undefined): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of cleanText(text).split(/[,\n]/)) {
    const item = part.trim();
    if (item && !seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out;
}

export function parseRowFields(raw: RawRowFields): RowFields {
  return {
    name: cleanText(raw.name),
    displayName: cleanText(raw.displayName),
    description: cleanText(raw.description),
    area: cleanText(raw.area).toLowerCase(),
    tags: parseList(raw.tags).map((t) => t.toLowerCase()),
    aliases: parseList(raw.aliases),
    status: cleanText(raw.status).toLowerCase(),
    deprecatedInFavorOf: cleanText(raw.deprecatedInFavorOf) || null,
  };
}

export function fieldsFromMeta(meta: IconMeta): RowFields {
  return {
    name: meta.name,
    displayName: meta.displayName ?? "",
    description: meta.description ?? "",
    area: meta.area,
    tags: meta.tags ?? [],
    aliases: meta.aliases ?? [],
    status: meta.status,
    deprecatedInFavorOf: meta.deprecatedInFavorOf ?? null,
  };
}

export interface ValidationContext {
  /** Areas that already exist in the repo for this brand. */
  knownAreas: readonly string[];
  /** True once the user has explicitly confirmed creating a new area. */
  allowNewArea: boolean;
  /** Every other icon in the brand (exclude the icon being validated). */
  others: readonly { name: string; aliases: readonly string[] }[];
}

export function validateRowFields(fields: RowFields, ctx: ValidationContext): string[] {
  const errors: string[] = [];
  const label = fields.name || "(unnamed row)";

  if (!ICON_NAME_PATTERN.test(fields.name)) {
    errors.push(`${label}: name must match ^fdsi-[a-z0-9]+(-[a-z0-9]+)*$`);
  }
  if (ctx.others.some((o) => o.name === fields.name)) {
    errors.push(`${label}: name is already used by another icon`);
  }
  if (ctx.others.some((o) => o.aliases.includes(fields.name))) {
    errors.push(`${label}: name is already an alias of another icon`);
  }

  if (!fields.displayName) errors.push(`${label}: displayName is required`);

  if (!fields.area) {
    errors.push(`${label}: area is required`);
  } else if (!isValidAreaSlug(fields.area)) {
    errors.push(`${label}: area "${fields.area}" must be a kebab-case slug`);
  } else if (!ctx.knownAreas.includes(fields.area) && !ctx.allowNewArea) {
    errors.push(`${label}: area "${fields.area}" does not exist yet (known: ${ctx.knownAreas.join(", ") || "none"}); confirm to create it`);
  }

  for (const tag of fields.tags) {
    if (!TAG_PATTERN.test(tag)) errors.push(`${label}: tag "${tag}" must be lowercase letters, digits or hyphens`);
  }

  for (const alias of fields.aliases) {
    if (!ALIAS_PATTERN.test(alias)) errors.push(`${label}: alias "${alias}" must start with fdsi- and use lowercase letters, digits, - or _`);
    if (alias === fields.name) errors.push(`${label}: alias "${alias}" equals the icon name`);
    if (ctx.others.some((o) => o.name === alias)) errors.push(`${label}: alias "${alias}" collides with another icon's name`);
    if (ctx.others.some((o) => o.aliases.includes(alias))) errors.push(`${label}: alias "${alias}" is already used by another icon`);
  }

  if (!fields.status) {
    errors.push(`${label}: status is required`);
  } else if (!(STATUSES as readonly string[]).includes(fields.status)) {
    errors.push(`${label}: status "${fields.status}" must be one of ${STATUSES.join(", ")}`);
  }

  if (fields.status === "deprecated") {
    if (!fields.deprecatedInFavorOf) {
      errors.push(`${label}: deprecatedInFavorOf is required when status is deprecated`);
    } else if (fields.deprecatedInFavorOf === fields.name) {
      errors.push(`${label}: deprecatedInFavorOf cannot be the icon itself`);
    } else if (!ctx.others.some((o) => o.name === fields.deprecatedInFavorOf)) {
      errors.push(`${label}: deprecatedInFavorOf "${fields.deprecatedInFavorOf}" is not an existing icon`);
    }
  } else if (fields.deprecatedInFavorOf) {
    errors.push(`${label}: deprecatedInFavorOf is only valid when status is deprecated`);
  }

  return errors;
}

/** Order-insensitive fingerprint of the editable metadata, so reordering tags or aliases is not a change. */
export function hashRowFields(fields: RowFields): string {
  return fnv1a64Hex(
    JSON.stringify({
      area: fields.area,
      displayName: fields.displayName,
      description: fields.description,
      tags: [...fields.tags].sort(),
      aliases: [...fields.aliases].sort(),
      status: fields.status,
      deprecatedInFavorOf: fields.deprecatedInFavorOf,
    })
  );
}

/** One hash covering artwork and metadata, so a single recorded base detects either kind of change. */
export function combineHashes(artworkHash: string, metadataHash: string): string {
  return fnv1a64Hex(`${artworkHash}:${metadataHash}`);
}

/** Figma-side state hash; a set without a table row hashes differently from one with an empty row. */
export function figmaStateHash(artworkHash: string, fields: RowFields | null): string {
  return combineHashes(artworkHash, fields ? hashRowFields(fields) : "no-row");
}

export type SyncState =
  | "draft"
  | "new-in-figma"
  | "new-in-repo"
  | "in-sync"
  | "changed-in-figma"
  | "changed-in-repo"
  | "conflict"
  | "unknown"
  | "duplicate";

export interface StateInput {
  /** More than one Figma set claims this identity. */
  duplicate: boolean;
  /** Combined hash of Figma's current export plus row fields; null when there is no artwork in Figma. */
  figmaHash: string | null;
  /** Combined hash of the repo's current files plus metadata; null when the icon is not in the repo. */
  repoHash: string | null;
  /** Figma's own hash at the last sync. Figma re-serialises SVG, so this is never comparable to the repo hash. */
  figmaBase: string | null;
  /** The repo's hash at the last sync. */
  repoBase: string | null;
}

export function computeSyncState(input: StateInput): SyncState {
  const { duplicate, figmaHash, repoHash, figmaBase, repoBase } = input;
  if (duplicate) return "duplicate";
  if (figmaHash === null && repoHash === null) return "draft";
  if (figmaHash === null) return "new-in-repo";
  if (repoHash === null) return "new-in-figma";

  // Each side is compared only with its own previous hash; Figma's export never equals the repo file, so cross-side equality is not a signal.
  // Without a base we cannot tell which side moved, so never guess a direction.
  if (figmaBase === null || repoBase === null) return "unknown";

  const figmaChanged = figmaHash !== figmaBase;
  const repoChanged = repoHash !== repoBase;
  if (figmaChanged && repoChanged) return "conflict";
  if (figmaChanged) return "changed-in-figma";
  if (repoChanged) return "changed-in-repo";
  return "in-sync";
}

const STATE_LABELS: Record<SyncState, string> = {
  draft: "Draft (no artwork)",
  "new-in-figma": "New in Figma",
  "new-in-repo": "New in repo",
  "in-sync": "In sync",
  "changed-in-figma": "Changed in Figma",
  "changed-in-repo": "Changed in repo",
  conflict: "Conflict",
  unknown: "Unknown (no base)",
  duplicate: "Duplicate identity",
};

export function syncStatusLabel(state: SyncState): string {
  return STATE_LABELS[state];
}

/** Order of the text cells in rows written before field layers were named (icon-variants cell excluded). */
export const LEGACY_FIELD_ORDER: readonly RowFieldKey[] = [
  "name",
  "displayName",
  "description",
  "area",
  "tags",
  "aliases",
  "status",
];

export interface RowSetJoin {
  /** Sets with no table row yet. */
  setsWithoutRow: string[];
  /** Rows whose name matches no set (artwork not drawn yet, or the set was renamed or deleted). */
  rowsWithoutSet: string[];
  duplicateRows: string[];
  duplicateSets: string[];
}

/** Joins table rows to component sets on icon name; blank names are ignored (the caller reports them). */
export function joinRowsAndSets(rowNames: readonly string[], setNames: readonly string[]): RowSetJoin {
  const count = (names: readonly string[]): Map<string, number> => {
    const counts = new Map<string, number>();
    for (const name of names) if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
    return counts;
  };
  const rows = count(rowNames);
  const sets = count(setNames);
  const duplicates = (counts: Map<string, number>): string[] => [...counts].filter(([, n]) => n > 1).map(([name]) => name);
  return {
    setsWithoutRow: [...sets.keys()].filter((name) => !rows.has(name)),
    rowsWithoutSet: [...rows.keys()].filter((name) => !sets.has(name)),
    duplicateRows: duplicates(rows),
    duplicateSets: duplicates(sets),
  };
}
