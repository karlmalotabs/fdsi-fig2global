import type { FileChange, IconMeta, PluginSettings, SyncPlanEntry, VariantContent } from "./types";
import { GitHubClient } from "./github-client";
import { hashIconVariants } from "./hashing";
import { isValidIconName, variantFileName } from "./naming";
import { validateIconMeta, validateVariantSvgs } from "./schema-validate";
import { readVariantProperties } from "./figma-nodes";

export interface SelectionInfo {
  nodeId: string;
  label: string;
  existing: { name: string; brand: string; area: string } | null;
}

/** Reports, for each selected ComponentSet, whether it's already tracked or needs a rename/mapping dialog. */
export function getSelectionInfo(selection: readonly SceneNode[]): SelectionInfo[] {
  return selection
    .filter((n): n is ComponentSetNode => n.type === "COMPONENT_SET")
    .map((set) => {
      const name = set.getPluginData("fdsiName");
      const brand = set.getPluginData("fdsiBrand");
      const area = set.getPluginData("fdsiArea");
      return {
        nodeId: set.id,
        label: set.name,
        existing: name && brand && area ? { name, brand, area } : null,
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
}

/** Figma → GitHub: exports each selected ComponentSet's variants and stages (but does not commit) the diff. */
export async function buildPushPlan(
  selection: readonly ComponentSetNode[],
  identities: Record<string, PushIdentity>,
  settings: PluginSettings,
  client: GitHubClient
): Promise<PushPlan> {
  const plan: SyncPlanEntry[] = [];
  const nodesByName = new Map<string, ComponentSetNode>();
  const hashesByName = new Map<string, string>();

  for (const set of selection) {
    const identity = identities[set.id];
    if (!identity) continue;

    const previousName = set.getPluginData("fdsiName") || null;
    const isRename = previousName !== null && previousName !== identity.name;

    const variants: VariantContent[] = [];
    for (const child of set.children) {
      if (child.type !== "COMPONENT") continue;
      const { size, style } = readVariantProperties(child);
      if (!size || !style) continue;
      const svg = await child.exportAsync({ format: "SVG_STRING" });
      variants.push({ size, style, svg });
    }

    const validationErrors: string[] = [];
    if (!isValidIconName(identity.name)) {
      validationErrors.push(`"${identity.name}" is not a valid fdsi- slug`);
    }
    validationErrors.push(...validateVariantSvgs(variants));

    const path = `${identity.brand}/${identity.area}/${identity.name}`;
    const existingMeta = await client.getFileJson<IconMeta>(`${path}/meta.json`, settings.branch);
    const hash = hashIconVariants(variants);

    const files: FileChange[] = [];
    const aliases = new Set(existingMeta?.aliases ?? []);
    let action: SyncPlanEntry["action"] = existingMeta ? "update" : "create";

    if (isRename && previousName) {
      action = "rename";
      aliases.add(previousName);
      const oldPath = `${identity.brand}/${identity.area}/${previousName}`;
      const oldMeta = await client.getFileJson<IconMeta>(`${oldPath}/meta.json`, settings.branch);
      if (oldMeta) {
        for (const variant of oldMeta.variants) files.push({ path: `${oldPath}/${variant.file}`, delete: true });
        files.push({ path: `${oldPath}/meta.json`, delete: true });
      }
    }

    const today = new Date().toISOString().slice(0, 10);
    const nextMeta: IconMeta = {
      name: identity.name,
      prefix: "fdsi",
      brand: identity.brand,
      area: identity.area,
      displayName: existingMeta?.displayName ?? identity.name,
      description: existingMeta?.description ?? "",
      tags: existingMeta?.tags ?? [],
      aliases: [...aliases],
      status: "active",
      deprecatedInFavorOf: null,
      variants: variants.map((v) => ({
        size: v.size,
        style: v.style,
        file: variantFileName(identity.name, v.size, v.style),
      })),
      figma: {
        nodeId: set.id,
        componentKey: existingMeta?.figma?.componentKey ?? null,
        lastSyncedHash: hash,
        lastSyncedAt: new Date().toISOString(),
      },
      version: existingMeta?.version ?? "0.1.0",
      createdAt: existingMeta?.createdAt ?? today,
      updatedAt: today,
    };
    validationErrors.push(...validateIconMeta(nextMeta));

    files.push({ path: `${path}/meta.json`, content: `${JSON.stringify(nextMeta, null, 2)}\n` });
    for (const variant of variants) {
      files.push({
        path: `${path}/${variantFileName(identity.name, variant.size, variant.style)}`,
        content: variant.svg,
      });
    }

    plan.push({
      iconName: identity.name,
      brand: identity.brand,
      area: identity.area,
      action,
      renamedFrom: isRename ? previousName ?? undefined : undefined,
      files,
      validationErrors,
    });
    nodesByName.set(identity.name, set);
    hashesByName.set(identity.name, hash);
  }

  return { plan, nodesByName, hashesByName };
}

/** Commits every staged file across the whole plan in one atomic commit; throws if any entry failed validation. */
export async function applyPushPlan(
  plan: SyncPlanEntry[],
  settings: PluginSettings,
  client: GitHubClient
): Promise<string> {
  const blockingErrors = plan.flatMap((p) => p.validationErrors);
  if (blockingErrors.length > 0) {
    throw new Error(`Refusing to commit, validation failed: ${blockingErrors.join("; ")}`);
  }

  const files = plan.flatMap((p) => p.files);
  const summary = plan.map((p) => `${p.action} ${p.iconName}`).join(", ");
  return client.commitFiles(settings.branch, `feat(icons): sync from Figma — ${summary}`, files);
}
