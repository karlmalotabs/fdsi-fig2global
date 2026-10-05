import type { IconMeta, VariantContent } from "./types";
import { GitHubClient } from "./github-client";
import { hashIconVariants, normalizeSvg } from "./hashing";
import { readSyncedHash, readVariantProperties } from "./figma-nodes";

export type SvgComparison = "identical" | "whitespace-only" | "different";

export interface SvgDiff {
  status: SvgComparison;
  /** Present only when the hash would differ: a short window around the first mismatch in normalised text. */
  firstDiff?: { index: number; repo: string; figma: string };
}

const WINDOW = 70;

/** Compares a repo SVG with a Figma export the same way the sync hash does (whitespace-normalised). */
export function compareSvg(repoSvg: string, figmaSvg: string): SvgDiff {
  if (repoSvg === figmaSvg) return { status: "identical" };
  const a = normalizeSvg(repoSvg);
  const b = normalizeSvg(figmaSvg);
  if (a === b) return { status: "whitespace-only" };

  let index = 0;
  const max = Math.min(a.length, b.length);
  while (index < max && a[index] === b[index]) index++;
  const from = Math.max(0, index - 20);
  return { status: "different", firstDiff: { index, repo: a.slice(from, from + WINDOW), figma: b.slice(from, from + WINDOW) } };
}

export interface VariantCheck {
  variant: string;
  comparison: SvgComparison | "missing-in-repo" | "missing-in-figma";
  /** Two consecutive exports of the same node produced identical text. */
  exportStable: boolean;
  firstDiff?: SvgDiff["firstDiff"];
}

export interface HashCheckEntry {
  label: string;
  /** Null when the set has no fdsi plugin data, so there is no repo path to compare against. */
  name: string | null;
  figmaHash: string | null;
  repoHash: string | null;
  recordedHash: string | null;
  variants: VariantCheck[];
  error?: string;
}

/**
 * Diagnostic for plugin phase 0: does Figma's SVG export hash the same as the repo file the
 * icon was pulled from? Read-only on both Figma and GitHub.
 */
export async function checkSelectionHashes(
  selection: readonly SceneNode[],
  branch: string,
  client: GitHubClient
): Promise<HashCheckEntry[]> {
  const sets = selection.filter((n): n is ComponentSetNode => n.type === "COMPONENT_SET");
  const entries: HashCheckEntry[] = [];

  for (const set of sets) {
    const name = set.getPluginData("fdsiName") || null;
    const brand = set.getPluginData("fdsiBrand");
    const area = set.getPluginData("fdsiArea");
    const entry: HashCheckEntry = {
      label: set.name,
      name,
      figmaHash: null,
      repoHash: null,
      recordedHash: readSyncedHash(set),
      variants: [],
    };
    entries.push(entry);

    try {
      const figmaVariants: VariantContent[] = [];
      const figmaByKey = new Map<string, { svg: string; stable: boolean }>();
      for (const child of set.children) {
        if (child.type !== "COMPONENT") continue;
        const { size, style } = readVariantProperties(child);
        if (!size || !style) continue;
        const first = await child.exportAsync({ format: "SVG_STRING" });
        const second = await child.exportAsync({ format: "SVG_STRING" });
        figmaVariants.push({ size, style, svg: first });
        figmaByKey.set(`${size}-${style}`, { svg: first, stable: first === second });
      }
      entry.figmaHash = hashIconVariants(figmaVariants);

      if (!name || !brand || !area) {
        entry.error = "No fdsi plugin data on this set; pull it or push it once so it has a repo path.";
        for (const [key, value] of figmaByKey) {
          entry.variants.push({ variant: key, comparison: "missing-in-repo", exportStable: value.stable });
        }
        continue;
      }

      const path = `${brand}/${area}/${name}`;
      const meta = await client.getFileJson<IconMeta>(`${path}/meta.json`, branch);
      if (!meta) {
        entry.error = `${path}/meta.json not found on ${branch}`;
        continue;
      }

      const repoVariants: VariantContent[] = [];
      const seen = new Set<string>();
      for (const variant of meta.variants) {
        const key = `${variant.size}-${variant.style}`;
        seen.add(key);
        const repoSvg = await client.getFileContent(`${path}/${variant.file}`, branch);
        const figmaValue = figmaByKey.get(key);
        if (repoSvg === null) {
          entry.variants.push({ variant: key, comparison: "missing-in-repo", exportStable: figmaValue?.stable ?? true });
          continue;
        }
        repoVariants.push({ size: variant.size, style: variant.style, svg: repoSvg });
        if (!figmaValue) {
          entry.variants.push({ variant: key, comparison: "missing-in-figma", exportStable: true });
          continue;
        }
        const diff = compareSvg(repoSvg, figmaValue.svg);
        entry.variants.push({
          variant: key,
          comparison: diff.status,
          exportStable: figmaValue.stable,
          firstDiff: diff.firstDiff,
        });
      }
      for (const [key, value] of figmaByKey) {
        if (!seen.has(key)) {
          entry.variants.push({ variant: key, comparison: "missing-in-repo", exportStable: value.stable });
        }
      }
      entry.repoHash = hashIconVariants(repoVariants);
    } catch (err) {
      entry.error = err instanceof Error ? err.message : String(err);
    }
  }

  return entries;
}

/** Plain-text report lines for the plugin log. */
export function formatHashCheck(entry: HashCheckEntry): string[] {
  const lines: string[] = [];
  const hashesMatch = entry.figmaHash !== null && entry.figmaHash === entry.repoHash;
  lines.push(
    `${entry.label}: figma ${entry.figmaHash ?? "-"} | repo ${entry.repoHash ?? "-"} | recorded ${entry.recordedHash ?? "-"} -> ${
      entry.repoHash === null ? "no comparison" : hashesMatch ? "HASH MATCH" : "HASH DIFFERS"
    }`
  );
  if (entry.error) lines.push(`  ${entry.error}`);
  for (const v of entry.variants) {
    lines.push(`  ${v.variant}: ${v.comparison}${v.exportStable ? "" : " (export NOT stable between two calls)"}`);
    if (v.firstDiff) {
      lines.push(`    at ${v.firstDiff.index}`, `    repo : ${v.firstDiff.repo}`, `    figma: ${v.firstDiff.figma}`);
    }
  }
  return lines;
}
