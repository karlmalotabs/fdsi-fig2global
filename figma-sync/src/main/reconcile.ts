import type { IconMeta, PluginSettings, VariantContent } from "./types";
import type { RegistryIndex, AreaIndex } from "./registry-types";
import { GitHubClient } from "./github-client";
import { hashIconVariants } from "./hashing";
import { readSyncedHash, readVariantProperties } from "./figma-nodes";

export interface ReconcileEntry {
  name: string;
  status: "in-sync" | "changed-in-figma" | "changed-in-repo" | "conflict" | "new-in-figma" | "new-in-repo";
}

/**
 * Read-only 3-way diff: the repo's recorded lastSyncedHash vs. the repo's CURRENT content
 * vs. Figma's CURRENT content — so both-sides-changed cases surface as an explicit conflict
 * instead of silently picking a direction.
 */
export async function reconcile(settings: PluginSettings, client: GitHubClient): Promise<ReconcileEntry[]> {
  const entries: ReconcileEntry[] = [];
  const repoIconNames = new Set<string>();

  const figmaSets = figma.currentPage.findAll((n) => n.type === "COMPONENT_SET") as ComponentSetNode[];
  const figmaByName = new Map(
    figmaSets
      .filter((s) => s.getPluginData("fdsiBrand") === settings.brand)
      .map((s) => [s.getPluginData("fdsiName"), s] as const)
  );

  const index = await client.getFileJson<RegistryIndex>("registry/generated/index.json", settings.branch);
  const brandEntry = index?.brands.find((b) => b.brand === settings.brand);

  if (brandEntry) {
    for (const areaEntry of brandEntry.areas) {
      if (!areaEntry.file || areaEntry.iconCount === 0) continue;
      const areaIndex = await client.getFileJson<AreaIndex>(areaEntry.file, settings.branch);
      if (!areaIndex) continue;

      for (const iconSummary of areaIndex.icons) {
        if (iconSummary.status !== "active") continue;
        repoIconNames.add(iconSummary.name);

        const meta = await client.getFileJson<IconMeta>(`${iconSummary.path}/meta.json`, settings.branch);
        if (!meta) continue;

        const figmaSet = figmaByName.get(meta.name);
        if (!figmaSet) {
          entries.push({ name: meta.name, status: "new-in-repo" });
          continue;
        }

        const repoVariants: VariantContent[] = [];
        for (const variant of meta.variants) {
          const svg = await client.getFileContent(`${iconSummary.path}/${variant.file}`, settings.branch);
          if (svg) repoVariants.push({ size: variant.size, style: variant.style, svg });
        }
        const currentRepoHash = hashIconVariants(repoVariants);
        const recordedHash = meta.figma?.lastSyncedHash ?? null;
        const repoChanged = recordedHash !== null && currentRepoHash !== recordedHash;

        const figmaVariants: VariantContent[] = [];
        for (const child of figmaSet.children) {
          if (child.type !== "COMPONENT") continue;
          const { size, style } = readVariantProperties(child);
          if (!size || !style) continue;
          figmaVariants.push({ size, style, svg: await child.exportAsync({ format: "SVG_STRING" }) });
        }
        const currentFigmaHash = hashIconVariants(figmaVariants);
        const lastSyncedHash = readSyncedHash(figmaSet);
        const figmaChanged = lastSyncedHash !== null && currentFigmaHash !== lastSyncedHash;

        let status: ReconcileEntry["status"];
        if (figmaChanged && repoChanged) status = "conflict";
        else if (figmaChanged) status = "changed-in-figma";
        else if (repoChanged) status = "changed-in-repo";
        else status = "in-sync";

        entries.push({ name: meta.name, status });
      }
    }
  }

  for (const name of figmaByName.keys()) {
    if (name && !repoIconNames.has(name)) entries.push({ name, status: "new-in-figma" });
  }

  return entries;
}
