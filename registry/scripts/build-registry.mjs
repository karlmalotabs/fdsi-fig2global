// Regenerates registry/generated/* from every <brand>/<area>/<icon>/meta.json. Usage: node registry/scripts/build-registry.mjs
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, loadIcons } from './load-icons.mjs';

const OUT_DIR = join(REPO_ROOT, 'registry/generated');
const { icons, errors } = loadIcons();

if (errors.length) {
  console.error(`Registry validation failed (${errors.length}):\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

// Keep the previous generatedAt when nothing else changed, so reruns don't dirty git.
function writeGenerated(file, data) {
  const target = join(OUT_DIR, file);
  const strip = (o) => JSON.stringify({ ...o, generatedAt: undefined });
  let generatedAt = new Date().toISOString();
  if (existsSync(target)) {
    const prev = JSON.parse(readFileSync(target, 'utf8'));
    if (strip(prev) === strip(data)) generatedAt = prev.generatedAt;
  }
  const out = 'generatedAt' in data ? { ...data, generatedAt } : data;
  writeFileSync(target, JSON.stringify(out, null, 2) + '\n');
}

mkdirSync(OUT_DIR, { recursive: true });

const areaFile = (brand, area) => (brand === 'core' ? `${area}.icons.json` : `${brand}.${area}.icons.json`);

// Group by brand/area, including areas that exist but have no icons yet.
const groups = new Map();
for (const icon of icons) {
  const key = `${icon.brand}/${icon.area}`;
  if (!groups.has(key)) groups.set(key, { brand: icon.brand, area: icon.area, icons: [] });
  groups.get(key).icons.push(icon);
}

const emptyAreas = [...new Set(icons.map((i) => i.brand))].flatMap((brand) =>
  readdirSync(join(REPO_ROOT, brand), { withFileTypes: true })
    .filter((a) => a.isDirectory())
    .map((a) => ({ brand, area: a.name })),
);
for (const { brand, area } of emptyAreas) {
  const key = `${brand}/${area}`;
  if (!groups.has(key)) groups.set(key, { brand, area, icons: [] });
}

const written = new Set();
const brandIndex = new Map();

for (const { brand, area, icons: areaIcons } of [...groups.values()].sort((a, b) => `${a.brand}/${a.area}`.localeCompare(`${b.brand}/${b.area}`))) {
  let file = null;
  if (areaIcons.length) {
    file = areaFile(brand, area);
    written.add(file);
    writeGenerated(file, {
      $schema: '../schema/area.index.schema.json',
      brand,
      area,
      generatedAt: '',
      icons: areaIcons
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((i) => ({
          name: i.name,
          path: i.path,
          displayName: i.displayName,
          description: i.description,
          tags: i.tags,
          status: i.status,
          deprecatedInFavorOf: i.deprecatedInFavorOf,
          aliases: i.aliases,
          variants: i.variants.map(({ size, style, file }) => ({ size, style, file })),
        })),
    });
  }
  if (!brandIndex.has(brand)) brandIndex.set(brand, []);
  brandIndex.get(brand).push({ area, iconCount: areaIcons.length, file: file && `registry/generated/${file}` });
}

writeGenerated('index.json', {
  generatedAt: '',
  brands: [...brandIndex].map(([brand, areas]) => ({ brand, areas })),
});
written.add('index.json');

const aliases = { $schema: '../schema/aliases.index.schema.json' };
for (const i of icons) {
  for (const alias of i.aliases) aliases[alias] = { canonical: i.name, path: i.path, brand: i.brand, area: i.area };
}
// Deprecated icons also resolve to their replacement.
for (const i of icons) {
  if (i.status === 'deprecated' && i.deprecatedInFavorOf) {
    const target = icons.find((t) => t.brand === i.brand && t.name === i.deprecatedInFavorOf);
    aliases[i.name] = { canonical: target.name, path: target.path, brand: target.brand, area: target.area };
  }
}
writeGenerated('aliases.index.json', aliases);
written.add('aliases.index.json');

for (const f of readdirSync(OUT_DIR)) {
  if (f.endsWith('.json') && !written.has(f)) unlinkSync(join(OUT_DIR, f));
}

console.log(`Registry built: ${icons.length} icons, ${groups.size} areas.`);
