import type { IconMeta, PluginSettings, VariantContent, FileChange } from "./types";
import { GitHubClient } from "./github-client";
import { hashIconVariants } from "./hashing";
import { mapWithConcurrency } from "./concurrency";
import {
  createIconComponentSet,
  getOrCreateTableContainer,
  hasUnwiredModifierSets,
  readBases,
  updateIconComponentSet,
  wireAdjustableModifiersOnAllSets,
} from "./figma-nodes";
import { addIconRow, iconCellOf, placeIconSet, writeRowFields } from "./table";
import { fieldsFromMeta } from "./contract";
import type { SyncState } from "./contract";
import { rebaseRepoSide, recordBases, scanLibrary, snapshotRepoHashes } from "./scan";

const FETCH_CONCURRENCY = 6;

export interface PullResult {
  created: string[];
  updated: string[];
  skipped: string[];
  /** Left alone on purpose: Figma changed, both sides changed, no baseline yet, or duplicate identity. */
  attention: { name: string; state: SyncState }[];
  errors: { icon: string; error: string }[];
}

/**
 * GitHub → Figma. Only icons that are new or changed in the repo are written; anything Figma
 * changed is never overwritten. Pull makes no commits: the baselines live in Figma.
 */
export async function pullIcons(settings: PluginSettings, client: GitHubClient): Promise<PullResult> {
  const result: PullResult = { created: [], updated: [], skipped: [], attention: [], errors: [] };
  const scan = await scanLibrary(settings, client, false);

  const pending = [];
  for (const entry of scan.entries) {
    switch (entry.state) {
      case "in-sync":
        result.skipped.push(entry.name);
        break;
      case "new-in-repo":
      case "changed-in-repo":
        if (entry.repo && entry.repo.status !== "deprecated" && entry.repo.status !== "draft") {
          // If the set already exists and its GitHub hash already matches `repoBase` (meaning it was only marked `changed-in-repo`
          // because `fdsiModifiersWired` wasn't set yet), upgrade its modifier properties locally without re-fetching 888 SVGs from GitHub!
          const bases = entry.set ? readBases(entry.set) : { figmaBase: null, repoBase: null };
          if (
            entry.set &&
            bases.repoBase === entry.repo.hash &&
            entry.set.getPluginData("fdsiModifiersWired") !== "true"
          ) {
            break;
          }
          pending.push(entry);
        }
        break;
      case "new-in-figma":
      case "draft":
        break; // nothing to pull; these are for Push
      default:
        result.attention.push({ name: entry.name, state: entry.state });
    }
  }

  const fetched = await mapWithConcurrency(pending, FETCH_CONCURRENCY, async (entry) => {
    const repo = entry.repo!;
    const meta = await client.getFileJson<IconMeta>(`${repo.path}/meta.json`, settings.branch).catch(() => null);
    if (!meta) return { entry, meta: null, variants: [] as VariantContent[] };
    const variants = await Promise.all(
      meta.variants.map(async (variant) => {
        const svg = await client.getFileContent(`${repo.path}/${variant.file}`, settings.branch);
        return svg !== null ? { size: variant.size, style: variant.style, svg } : null;
      })
    );
    return { entry, meta, variants: variants.filter((v): v is VariantContent => v !== null) };
  });

  const container = getOrCreateTableContainer();
  let touched = 0;

  // Sort `fetched` so `fdsi-mod-*` standalone modifier sets are created/updated FIRST before base icons!
  const sortedFetched = [...fetched].sort((a, b) => {
    const aMod = (a.meta?.name ?? a.entry.name).startsWith("fdsi-mod-") ? 0 : 1;
    const bMod = (b.meta?.name ?? b.entry.name).startsWith("fdsi-mod-") ? 0 : 1;
    return aMod - bMod;
  });

  const touchedSets: { set: ComponentSetNode; repoHash: string }[] = [];
  for (const { entry, meta, variants } of sortedFetched) {
    if (!meta) {
      result.errors.push({ icon: entry.name, error: `${entry.repo!.path}/meta.json not found` });
      continue;
    }
    if (meta.status !== "active") {
      result.skipped.push(meta.name);
      continue;
    }
    if (variants.length === 0) {
      result.errors.push({ icon: meta.name, error: `no variant SVGs could be fetched for ${entry.repo!.path}` });
      continue;
    }

    const artworkHash = hashIconVariants(variants);
    const fields = fieldsFromMeta(meta);
    const row = entry.row?.frame ?? (await addIconRow(container, fields));
    let set = entry.set;
    if (!set) {
      set = createIconComponentSet(meta.name, meta.brand, meta.area, variants, artworkHash, iconCellOf(row));
      result.created.push(meta.name);
    } else {
      updateIconComponentSet(set, meta.brand, meta.area, variants, artworkHash);
      placeIconSet(row, set);
      result.updated.push(meta.name);
    }

    if (entry.row) await writeRowFields(row, fields);

    touchedSets.push({ set, repoHash: entry.repo!.hash });
    touched++;
  }

  // Wire adjustable `Show Modifier` (BOOLEAN) + `Modifier` (INSTANCE_SWAP) + `Modifier Cutout Mask` onto all base icon sets
  // (including existing sets that were already in Figma before modifiers were wired!):
  if (touched > 0 || hasUnwiredModifierSets(settings.brand)) {
    const unwiredBefore = new Set(
      scan.entries
        .filter((e) => e.set && !e.name.startsWith("fdsi-mod-") && e.set.getPluginData("fdsiModifiersWired") !== "true")
        .map((e) => e.name)
    );
    const wired = wireAdjustableModifiersOnAllSets(settings.brand);
    if (wired > 0) {
      for (const entry of scan.entries) {
        if (entry.set && entry.repo && unwiredBefore.has(entry.name) && !touchedSets.some((t) => t.set === entry.set)) {
          await recordBases(entry.set, entry.repo.hash);
          result.updated.push(entry.name);
          const idx = result.skipped.indexOf(entry.name);
          if (idx !== -1) result.skipped.splice(idx, 1);
          touched++;
        }
      }
    }
  }

  for (const { set, repoHash } of touchedSets) {
    await recordBases(set, repoHash);
  }

  if (touched > 0) await scanLibrary(settings, client);
  return result;
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
  const updatedSets: ComponentSetNode[] = [];
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
    updatedSets.push(set);
  }

  if (changes.length > 0) {
    const before = await snapshotRepoHashes(settings, client);
    await client.commitFiles(settings.branch, "chore(figma-sync): record published componentKey", changes);
    // The commit changed meta.json, so the repo side of each baseline moves with it (Figma's side is untouched).
    await rebaseRepoSide(settings, client, updatedSets, before);
  }

  return { updated };
}
