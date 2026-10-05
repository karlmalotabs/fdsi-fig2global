import type { FileChange, IconMeta, PluginSettings, SyncPlanEntry, VariantContent } from "./types";
import { GitHubClient } from "./github-client";
import { hashIconVariants } from "./hashing";
import { variantFileName } from "./naming";
import { validateIconMeta, validateVariantSvgs } from "./schema-validate";
import { exportSetVariants, getOrCreateTableContainer, tagIconComponentSet, writePendingPr } from "./figma-nodes";
import { toRepoSvg } from "./svg-translate";
import { optimizeSvg } from "./svg-optimize";
import { validateRowFields } from "./contract";
import type { RowFields } from "./contract";
import { buildIconMeta, describeMetaChanges } from "./meta-build";
import { readTableRows, writeRowFields } from "./table";
import type { TableRow } from "./table";
import { currentFigmaBase, loadRepoCatalog, refreshBases } from "./scan";
import { commitChanges } from "./commit-changes";
import type { CommitOutcome } from "./commit-changes";

export interface SelectionInfo {
  nodeId: string;
  label: string;
  existing: { name: string; brand: string; area: string } | null;
}

function findRow(rows: readonly TableRow[], ...names: (string | null)[]): TableRow | null {
  for (const name of names) {
    const row = name ? rows.find((r) => r.fields.name === name) : undefined;
    if (row) return row;
  }
  return null;
}

/** Identity per selected ComponentSet: the layer name, with the area from the table row (or the last pushed area). */
export function getSelectionInfo(selection: readonly SceneNode[], brand: string): SelectionInfo[] {
  const rows = readTableRows(getOrCreateTableContainer());
  return selection
    .filter((n): n is ComponentSetNode => n.type === "COMPONENT_SET")
    .map((set) => {
      const taggedName = set.getPluginData("fdsiName");
      const area = findRow(rows, set.name, taggedName)?.fields.area || set.getPluginData("fdsiArea");
      return {
        nodeId: set.id,
        label: set.name,
        existing: area ? { name: set.name, brand: set.getPluginData("fdsiBrand") || brand, area } : null,
      };
    });
}

export interface PushIdentity {
  name: string;
  brand: string;
  area: string;
}

export interface PushPlan {
  plan: SyncPlanEntry[];
  /** Kept only in the main thread (not sent to the UI) so confirm-push can re-tag nodes after commit. */
  nodesByName: Map<string, ComponentSetNode>;
  hashesByName: Map<string, string>;
  rowsByName: Map<string, TableRow>;
  fieldsByName: Map<string, RowFields>;
}

/** Figma → GitHub: exports each selected ComponentSet, builds meta.json from its table row, and stages (but does not commit) the diff. */
export async function buildPushPlan(
  selection: readonly ComponentSetNode[],
  identities: Record<string, PushIdentity>,
  settings: PluginSettings,
  client: GitHubClient,
  allowNewArea = false
): Promise<PushPlan> {
  const result: PushPlan = {
    plan: [],
    nodesByName: new Map(),
    hashesByName: new Map(),
    rowsByName: new Map(),
    fieldsByName: new Map(),
  };
  const catalog = await loadRepoCatalog(settings, client);
  const rows = readTableRows(getOrCreateTableContainer());

  for (const set of selection) {
    const identity = identities[set.id];
    if (!identity) continue;

    const previousName = set.getPluginData("fdsiName") || null;
    const isRename = previousName !== null && previousName !== identity.name;
    const editedName = previousName ?? identity.name;

    const row = findRow(rows, identity.name, previousName);
    if (!row) {
      result.plan.push({
        iconName: identity.name,
        brand: identity.brand,
        area: identity.area,
        action: "skip",
        files: [],
        validationErrors: [`${identity.name}: no table row; use "Create missing rows" and fill in the fields first`],
      });
      continue;
    }

    const fields: RowFields = { ...row.fields, name: identity.name, area: identity.area };
    const variants: VariantContent[] = await exportSetVariants(set);
    const artworkHash = hashIconVariants(variants);

    const validationErrors: string[] = [
      ...validateRowFields(fields, {
        knownAreas: catalog.knownAreas,
        allowNewArea,
        others: catalog.icons.filter((i) => i.name !== editedName).map((i) => ({ name: i.name, aliases: i.aliases })),
      }),
      ...validateVariantSvgs(variants),
    ];

    const path = `${identity.brand}/${identity.area}/${identity.name}`;
    const oldIcon = catalog.icons.find((i) => i.name === editedName) ?? null;
    const existingMeta = oldIcon ? await client.getFileJson<IconMeta>(`${oldIcon.path}/meta.json`, settings.branch) : null;

    const files: FileChange[] = [];
    // Renamed or moved to another area: the old folder is removed in the same commit.
    if (oldIcon && existingMeta && oldIcon.path !== path) {
      for (const variant of existingMeta.variants) files.push({ path: `${oldIcon.path}/${variant.file}`, delete: true });
      files.push({ path: `${oldIcon.path}/meta.json`, delete: true });
    }

    const nextMeta = buildIconMeta({
      fields,
      brand: identity.brand,
      existing: existingMeta,
      previousName: isRename ? previousName : null,
      variants: variants.map((v) => ({ size: v.size, style: v.style, file: variantFileName(identity.name, v.size, v.style) })),
      nodeId: set.id,
      artworkHash,
      now: new Date(),
    });
    validationErrors.push(...validateIconMeta(nextMeta));

    files.push({ path: `${path}/meta.json`, content: `${JSON.stringify(nextMeta, null, 2)}\n` });
    for (const variant of variants) {
      files.push({
        path: `${path}/${variantFileName(identity.name, variant.size, variant.style)}`,
        content: optimizeSvg(toRepoSvg(variant.svg, variant.style)),
      });
    }

    result.plan.push({
      iconName: identity.name,
      brand: identity.brand,
      area: identity.area,
      action: isRename ? "rename" : existingMeta ? "update" : "create",
      renamedFrom: isRename ? previousName ?? undefined : undefined,
      files,
      validationErrors,
      metaChanges: describeMetaChanges(existingMeta, nextMeta),
    });
    result.nodesByName.set(identity.name, set);
    result.hashesByName.set(identity.name, artworkHash);
    result.rowsByName.set(identity.name, row);
    result.fieldsByName.set(identity.name, fields);
  }

  return result;
}

/** Commits every staged file across the whole plan in one atomic commit (or one pull request); throws if any entry failed validation. */
export async function applyPushPlan(
  plan: SyncPlanEntry[],
  settings: PluginSettings,
  client: GitHubClient
): Promise<CommitOutcome> {
  const blockingErrors = plan.flatMap((p) => p.validationErrors);
  if (blockingErrors.length > 0) {
    throw new Error(`Refusing to commit, validation failed: ${blockingErrors.join("; ")}`);
  }
  return commitChanges(plan, settings, client);
}

/**
 * After a successful write: re-tag the sets and make the rows match what was committed. A direct commit also records both
 * baselines; a pull request records only what is needed to settle the baselines once it merges (see `resolvePendingPrs`).
 */
export async function finalizePush(
  pending: PushPlan,
  outcome: CommitOutcome,
  settings: PluginSettings,
  client: GitHubClient
): Promise<void> {
  for (const [name, set] of pending.nodesByName) {
    const entry = pending.plan.find((p) => p.iconName === name)!;
    tagIconComponentSet(set, { name, brand: entry.brand, area: entry.area, hash: pending.hashesByName.get(name)! });
    await writeRowFields(pending.rowsByName.get(name)!.frame, pending.fieldsByName.get(name)!);
  }

  const sets = [...pending.nodesByName.values()];
  if (outcome.mode === "direct") {
    await refreshBases(settings, client, sets);
    return;
  }
  for (const set of sets) writePendingPr(set, { number: outcome.number, figmaBase: await currentFigmaBase(set) });
}
