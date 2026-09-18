import type { FileChange, IconMeta, PluginSettings, VariantContent } from "./types";
import type { RegistryIndex, AreaIndex } from "./registry-types";
import { GitHubClient } from "./github-client";
import { hashIconVariants } from "./hashing";
import {
  createIconComponentSet,
  findIconComponentSet,
  readSyncedHash,
  updateIconComponentSet,
} from "./figma-nodes";

export interface PullResult {
  created: string[];
  updated: string[];
  skipped: string[];
  errors: { icon: string; error: string }[];
}

/** GitHub → Figma: creates/updates a ComponentSet per active icon, skipping anything unchanged. */
export async function pullIcons(settings: PluginSettings, client: GitHubClient): Promise<PullResult> {
  const result: PullResult = { created: [], updated: [], skipped: [], errors: [] };
  const metaUpdates: FileChange[] = [];

  const index = await client.getFileJson<RegistryIndex>("registry/generated/index.json", settings.branch);
  if (!index) throw new Error("registry/generated/index.json not found on the target branch");

  const brandEntry = index.brands.find((b) => b.brand === settings.brand);
  if (!brandEntry) throw new Error(`brand "${settings.brand}" not found in registry/generated/index.json`);

  for (const areaEntry of brandEntry.areas) {
    if (!areaEntry.file || areaEntry.iconCount === 0) continue;
    const areaIndex = await client.getFileJson<AreaIndex>(areaEntry.file, settings.branch);
    if (!areaIndex) continue;

    for (const iconSummary of areaIndex.icons) {
      if (iconSummary.status !== "active") continue; // deprecated/draft stubs stay repo-only

      try {
        const metaPath = `${iconSummary.path}/meta.json`;
        const meta = await client.getFileJson<IconMeta>(metaPath, settings.branch);
        if (!meta) {
          result.errors.push({ icon: iconSummary.name, error: `${metaPath} not found` });
          continue;
        }

        const variants: VariantContent[] = [];
        for (const variant of meta.variants) {
          const svg = await client.getFileContent(`${iconSummary.path}/${variant.file}`, settings.branch);
          if (svg === null) {
            result.errors.push({ icon: meta.name, error: `${variant.file} not found` });
            continue;
          }
          variants.push({ size: variant.size, style: variant.style, svg });
        }
        if (variants.length === 0) {
          result.skipped.push(meta.name);
          continue;
        }

        const freshHash = hashIconVariants(variants);
        const existingSet = findIconComponentSet(meta.name, meta.brand);

        if (!existingSet) {
          const created = createIconComponentSet(meta.name, meta.brand, meta.area, variants, freshHash);
          result.created.push(meta.name);
          metaUpdates.push(buildMetaHashUpdate(metaPath, meta, created.id, freshHash));
        } else if (readSyncedHash(existingSet) !== freshHash) {
          updateIconComponentSet(existingSet, meta.brand, meta.area, variants, freshHash);
          result.updated.push(meta.name);
          metaUpdates.push(buildMetaHashUpdate(metaPath, meta, existingSet.id, freshHash));
        } else {
          result.skipped.push(meta.name);
        }
      } catch (err) {
        result.errors.push({ icon: iconSummary.name, error: String(err) });
      }
    }
  }

  if (metaUpdates.length > 0) {
    await client.commitFiles(settings.branch, "chore(figma-sync): record pulled icon sync state", metaUpdates);
  }

  return result;
}

function buildMetaHashUpdate(metaPath: string, meta: IconMeta, nodeId: string, hash: string): FileChange {
  const updated: IconMeta = {
    ...meta,
    figma: {
      nodeId,
      componentKey: meta.figma?.componentKey ?? null,
      lastSyncedHash: hash,
      lastSyncedAt: new Date().toISOString(),
    },
  };
  return { path: metaPath, content: `${JSON.stringify(updated, null, 2)}\n` };
}

/**
 * Re-run manually after a human publishes the library in Figma's UI (Plugin API can't
 * trigger publish itself) — captures each component's now-available `.key` into GitHub.
 */
export async function postPublishSync(
  settings: PluginSettings,
  client: GitHubClient
): Promise<{ updated: string[] }> {
  const updated: string[] = [];
  const changes: FileChange[] = [];
  const sets = figma.currentPage.findAll((n) => n.type === "COMPONENT_SET") as ComponentSetNode[];

  for (const set of sets) {
    const name = set.getPluginData("fdsiName");
    const brand = set.getPluginData("fdsiBrand");
    const area = set.getPluginData("fdsiArea");
    if (!name || !brand || !area || brand !== settings.brand) continue;

    const firstComponent = set.children.find((c): c is ComponentNode => c.type === "COMPONENT");
    if (!firstComponent || !firstComponent.key) continue; // library not published yet

    const metaPath = `${brand}/${area}/${name}/meta.json`;
    const meta = await client.getFileJson<IconMeta>(metaPath, settings.branch);
    if (!meta || meta.figma?.componentKey === firstComponent.key) continue;

    const nextMeta: IconMeta = {
      ...meta,
      figma: {
        nodeId: set.id,
        componentKey: firstComponent.key,
        lastSyncedHash: meta.figma?.lastSyncedHash ?? null,
        lastSyncedAt: new Date().toISOString(),
      },
    };
    changes.push({ path: metaPath, content: `${JSON.stringify(nextMeta, null, 2)}\n` });
    updated.push(name);
  }

  if (changes.length > 0) {
    await client.commitFiles(settings.branch, "chore(figma-sync): record published componentKey", changes);
  }

  return { updated };
}
