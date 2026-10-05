import type { IconMeta, IconStatus, IconVariant } from "./types";
import type { RowFields } from "./contract";

export interface BuildMetaInput {
  /** The row's fields with `name` and `area` already resolved to the identity being pushed. */
  fields: RowFields;
  brand: string;
  existing: IconMeta | null;
  /** Set only when the name changed; it becomes an alias so old references stay greppable. */
  previousName: string | null;
  variants: IconVariant[];
  nodeId: string;
  artworkHash: string;
  now: Date;
}

/** meta.json from the table row (authoritative for every designer-editable field) plus what only Figma or the repo knows. */
export function buildIconMeta(input: BuildMetaInput): IconMeta {
  const { fields, existing, previousName } = input;
  const today = input.now.toISOString().slice(0, 10);

  const aliases = [...fields.aliases];
  if (previousName && previousName !== fields.name && !aliases.includes(previousName)) aliases.push(previousName);

  return {
    name: fields.name,
    prefix: "fdsi",
    brand: input.brand,
    area: fields.area,
    displayName: fields.displayName,
    description: fields.description,
    tags: fields.tags,
    aliases,
    status: fields.status as IconStatus,
    deprecatedInFavorOf: fields.status === "deprecated" ? fields.deprecatedInFavorOf : null,
    variants: input.variants,
    figma: {
      nodeId: input.nodeId,
      componentKey: existing?.figma?.componentKey ?? null,
      lastSyncedHash: input.artworkHash,
      lastSyncedAt: input.now.toISOString(),
    },
    version: existing?.version ?? "0.1.0",
    createdAt: existing?.createdAt ?? today,
    updatedAt: today,
  };
}

function clip(text: string): string {
  const flat = text.replace(/\s+/g, " ");
  return flat.length > 40 ? `${flat.slice(0, 37)}...` : flat;
}

/** One line per designer-visible field that differs, so a wiped or mistyped cell is visible before the commit. */
export function describeMetaChanges(before: IconMeta | null, after: IconMeta): string[] {
  if (!before) return ["new icon"];

  const scalar = (label: string, a: string | null | undefined, b: string | null | undefined): string[] =>
    (a ?? "") === (b ?? "") ? [] : [`${label}: "${clip(a ?? "")}" \u2192 "${clip(b ?? "")}"`];
  const list = (label: string, a: string[] | undefined, b: string[] | undefined): string[] => {
    const x = [...(a ?? [])].sort().join(", ");
    const y = [...(b ?? [])].sort().join(", ");
    return x === y ? [] : [`${label}: [${clip(x)}] \u2192 [${clip(y)}]`];
  };

  return [
    ...scalar("name", before.name, after.name),
    ...scalar("area", before.area, after.area),
    ...scalar("displayName", before.displayName, after.displayName),
    ...scalar("description", before.description, after.description),
    ...list("tags", before.tags, after.tags),
    ...list("aliases", before.aliases, after.aliases),
    ...scalar("status", before.status, after.status),
    ...scalar("deprecatedInFavorOf", before.deprecatedInFavorOf, after.deprecatedInFavorOf),
  ];
}
