import { fnv1a64Hex } from "./hashing";

export interface TreeEntry {
  path: string;
  type: string;
  sha: string;
}

export interface RepoIcon {
  name: string;
  area: string;
  /** `<brand>/<area>/<name>` */
  path: string;
  /** Fingerprint of the icon's SVG files and meta.json, built from git blob ids so no file content is fetched. */
  hash: string;
}

/** Groups a recursive git tree listing into icon directories (`<brand>/<area>/<icon>/` containing a meta.json). */
export function groupRepoIcons(entries: readonly TreeEntry[], brand: string): RepoIcon[] {
  const dirs = new Map<string, { area: string; name: string; files: { file: string; sha: string }[] }>();
  for (const entry of entries) {
    if (entry.type !== "blob") continue;
    const [entryBrand, area, name, file, ...rest] = entry.path.split("/");
    if (entryBrand !== brand || !area || !name || !file || rest.length > 0) continue;
    if (file !== "meta.json" && !file.endsWith(".svg")) continue;
    const dir = dirs.get(`${area}/${name}`) ?? { area, name, files: [] };
    dir.files.push({ file, sha: entry.sha });
    dirs.set(`${area}/${name}`, dir);
  }

  return [...dirs.values()]
    .filter((dir) => dir.files.some((f) => f.file === "meta.json"))
    .map((dir) => ({
      name: dir.name,
      area: dir.area,
      path: `${brand}/${dir.area}/${dir.name}`,
      hash: fnv1a64Hex(
        dir.files
          .map((f) => `${f.file}:${f.sha}`)
          .sort()
          .join("\n")
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
