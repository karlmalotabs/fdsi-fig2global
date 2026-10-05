// Shared loader/validator: walks <brand>/<area>/<icon>/meta.json and returns validated icon records.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Top-level folders that are never brands.
const NON_BRAND_DIRS = new Set(['assets', 'docs', 'registry', 'figma-sync', 'storybook', 'node_modules']);

const NAME_RE = /^fdsi-[a-z0-9]+(-[a-z0-9]+)*$/;
const FILE_RE = /^fdsi-[a-z0-9]+(-[a-z0-9]+)*-(sm|reg|lg)-(outline|solid|color)\.svg$/;
const SIZES = ['sm', 'reg', 'lg'];
const STYLES = ['outline', 'solid', 'color'];
const STATUSES = ['active', 'deprecated', 'draft'];

export const sizeTokens = (() => {
  const { sm, reg, lg } = JSON.parse(readFileSync(join(REPO_ROOT, 'registry/schema/size-tokens.json'), 'utf8'));
  return { sm, reg, lg };
})();

const subdirs = (dir) =>
  readdirSync(dir)
    .filter((entry) => !entry.startsWith('.') && statSync(join(dir, entry)).isDirectory())
    .sort();

function checkSvgDimensions(svg, size, label, errors) {
  const px = sizeTokens[size];
  const root = svg.match(/<svg\b[^>]*>/)?.[0] ?? '';
  const attr = (n) => root.match(new RegExp(`\\s${n}="([^"]*)"`))?.[1];
  const expectedViewBox = `0 0 ${px} ${px}`;
  if (attr('width') !== String(px) || attr('height') !== String(px) || attr('viewBox') !== expectedViewBox) {
    errors.push(
      `${label}: ${size} expects width/height ${px} and viewBox "${expectedViewBox}", got ` +
        `${attr('width')}x${attr('height')} viewBox "${attr('viewBox')}"`,
    );
  }
}

/**
 * @returns {{ icons: object[], errors: string[] }}
 * Each icon: meta fields + `path` (repo-relative folder) and variants enriched with `path` and `svg`.
 */
export function loadIcons() {
  const errors = [];
  const icons = [];

  const brands = subdirs(REPO_ROOT).filter((d) => !NON_BRAND_DIRS.has(d));

  for (const brand of brands) {
    for (const area of subdirs(join(REPO_ROOT, brand))) {
      for (const folder of subdirs(join(REPO_ROOT, brand, area))) {
        const rel = `${brand}/${area}/${folder}`;
        const dir = join(REPO_ROOT, rel);
        const metaPath = join(dir, 'meta.json');
        if (!existsSync(metaPath)) {
          errors.push(`${rel}: missing meta.json`);
          continue;
        }

        let meta;
        try {
          meta = JSON.parse(readFileSync(metaPath, 'utf8'));
        } catch (e) {
          errors.push(`${rel}/meta.json: invalid JSON (${e.message})`);
          continue;
        }

        const before = errors.length;
        for (const key of ['name', 'prefix', 'brand', 'area', 'status', 'variants']) {
          if (meta[key] === undefined) errors.push(`${rel}: missing required field "${key}"`);
        }
        if (meta.name !== undefined && !NAME_RE.test(meta.name)) errors.push(`${rel}: invalid name "${meta.name}"`);
        if (meta.name !== folder) errors.push(`${rel}: name "${meta.name}" must match folder "${folder}"`);
        if (meta.brand !== brand) errors.push(`${rel}: brand "${meta.brand}" must match folder "${brand}"`);
        if (meta.area !== area) errors.push(`${rel}: area "${meta.area}" must match folder "${area}"`);
        if (!STATUSES.includes(meta.status)) errors.push(`${rel}: invalid status "${meta.status}"`);
        if (meta.status === 'deprecated' && !meta.deprecatedInFavorOf) {
          errors.push(`${rel}: deprecated icons require deprecatedInFavorOf`);
        }
        if (!Array.isArray(meta.variants)) {
          errors.push(`${rel}: variants must be an array`);
          continue;
        }

        const seen = new Set();
        const variants = [];
        for (const v of meta.variants) {
          const label = `${rel}/${v.file}`;
          if (!SIZES.includes(v.size) || !STYLES.includes(v.style)) {
            errors.push(`${label}: invalid size/style "${v.size}/${v.style}"`);
            continue;
          }
          if (!FILE_RE.test(v.file ?? '') || v.file !== `${meta.name}-${v.size}-${v.style}.svg`) {
            errors.push(`${label}: file must be "${meta.name}-${v.size}-${v.style}.svg"`);
            continue;
          }
          if (seen.has(`${v.size}/${v.style}`)) errors.push(`${label}: duplicate variant ${v.size}/${v.style}`);
          seen.add(`${v.size}/${v.style}`);

          const filePath = join(dir, v.file);
          if (!existsSync(filePath)) {
            errors.push(`${label}: file listed in meta.json does not exist`);
            continue;
          }
          const svg = readFileSync(filePath, 'utf8').trim();
          checkSvgDimensions(svg, v.size, label, errors);
          variants.push({ size: v.size, style: v.style, file: v.file, path: `${rel}/${v.file}`, svg });
        }

        const onDisk = readdirSync(dir).filter((f) => f.endsWith('.svg'));
        for (const f of onDisk) {
          if (!meta.variants.some((v) => v.file === f)) errors.push(`${rel}/${f}: SVG not listed in meta.json variants`);
        }

        if (errors.length === before) {
          icons.push({
            name: meta.name,
            brand,
            area,
            path: rel,
            displayName: meta.displayName ?? meta.name,
            description: meta.description ?? '',
            tags: meta.tags ?? [],
            aliases: meta.aliases ?? [],
            status: meta.status,
            deprecatedInFavorOf: meta.deprecatedInFavorOf ?? null,
            variants,
            figma: meta.figma ?? null,
            version: meta.version ?? null,
          });
        }
      }
    }
  }

  // Cross-icon rules
  const byBrandName = new Map();
  const aliasOwner = new Map();
  for (const icon of icons) {
    const key = `${icon.brand}:${icon.name}`;
    if (byBrandName.has(key)) errors.push(`${icon.path}: duplicate name "${icon.name}" in brand "${icon.brand}" (also ${byBrandName.get(key)})`);
    byBrandName.set(key, icon.path);
  }
  for (const icon of icons) {
    if (icon.deprecatedInFavorOf && !byBrandName.has(`${icon.brand}:${icon.deprecatedInFavorOf}`)) {
      errors.push(`${icon.path}: deprecatedInFavorOf "${icon.deprecatedInFavorOf}" does not exist in brand "${icon.brand}"`);
    }
    for (const alias of icon.aliases) {
      const key = `${icon.brand}:${alias}`;
      if (byBrandName.has(key)) errors.push(`${icon.path}: alias "${alias}" collides with an icon name`);
      else if (aliasOwner.has(key)) errors.push(`${icon.path}: alias "${alias}" already used by ${aliasOwner.get(key)}`);
      aliasOwner.set(key, icon.path);
    }
  }

  return { icons, errors };
}
