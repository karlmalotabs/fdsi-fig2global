import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { compileIcon } from "./compiler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const WORKBENCH_DIR = path.resolve(__dirname, "../..");
export const SRC_DIR = path.join(WORKBENCH_DIR, "src");
export const ICONS_DIR = path.join(SRC_DIR, "icons");
export const META_PATH = path.join(SRC_DIR, "data/metadata.json");
export const HISTORY_PATH = path.join(SRC_DIR, "data/history.json");
export const AREAS = ["common", "sb", "gx", "payments", "bx"];

// Resolve fdsi-fig2global root whether running inside fdsi-fig2global/workbench or fds-icon-studio/apps/workbench:
const parentDir = path.resolve(WORKBENCH_DIR, "..");
export const FIG2GLOBAL_ROOT =
  process.env.FIG2GLOBAL_ROOT ||
  (fs.existsSync(path.join(parentDir, "core")) && fs.existsSync(path.join(parentDir, "registry"))
    ? parentDir
    : "/Users/kama10/Documents/fdsi_core_iconograpy_resources");
export const FIG2GLOBAL_WB = path.join(FIG2GLOBAL_ROOT, "workbench");

export function mirrorToFig2Global(relPath, content) {
  try {
    if (path.resolve(WORKBENCH_DIR) === path.resolve(FIG2GLOBAL_WB)) return;
    if (!fs.existsSync(FIG2GLOBAL_ROOT)) return;
    const dest = path.join(FIG2GLOBAL_WB, relPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
  } catch {}
}

export function readMetaCatalog() {
  try {
    return JSON.parse(fs.readFileSync(META_PATH, "utf8"));
  } catch {
    return {};
  }
}

export function syncIconJsMetaBlock(area, slug, metaObj) {
  const filePath = path.join(ICONS_DIR, area, `${slug}.js`);
  if (!fs.existsSync(filePath)) return;
  let src = fs.readFileSync(filePath, "utf8");
  const metaBlock = JSON.stringify(
    {
      slug,
      area,
      alias: metaObj.alias || "",
      crsKey: metaObj.crsKey || "",
      description: metaObj.description || "",
      tags: Array.isArray(metaObj.tags) ? metaObj.tags : [slug],
      status: metaObj.status || "approved",
      ...(metaObj.reworkNote ? { reworkNote: metaObj.reworkNote } : {}),
      ...(Array.isArray(metaObj.comments) && metaObj.comments.length ? { comments: metaObj.comments } : {}),
    },
    null,
    4
  ).replace(/\n/g, "\n  ");

  src = src.replace(/area:\s*"[^"]*"/, `area: ${JSON.stringify(area)}`);
  if (metaObj.name) {
    src = src.replace(/name:\s*"[^"]*"/, `name: ${JSON.stringify(metaObj.name)}`);
  }
  src = src.replace(/meta:\s*\{[\s\S]*?\},\n\s*build:/, `meta: ${metaBlock},\n  build:`);
  fs.writeFileSync(filePath, src);
  mirrorToFig2Global(`src/icons/${area}/${slug}.js`, src);
}

export function findIconEntry(catalog, { id, slug, area } = {}) {
  if (id && catalog[id]) {
    return { id, meta: catalog[id] };
  }
  if (slug) {
    const cleanSlug = String(slug).replace(/^fdsi-/, "").replace(/-reg(-.*)?$/, "");
    for (const [k, v] of Object.entries(catalog)) {
      if (v.slug === cleanSlug && (!area || v.area === area)) {
        return { id: k, meta: v };
      }
    }
    // Also check on disk if a new .js file was dropped in:
    for (const a of area ? [area] : AREAS) {
      const fp = path.join(ICONS_DIR, a, `${cleanSlug}.js`);
      if (fs.existsSync(fp)) {
        const fallbackId = `${a}-${cleanSlug}`;
        return {
          id: fallbackId,
          meta: catalog[fallbackId] || {
            id: fallbackId,
            slug: cleanSlug,
            name: cleanSlug,
            area: a,
            status: "new",
            alias: "",
            crsKey: "",
            description: "",
            tags: [cleanSlug],
            reworkNote: "",
            comments: [],
          },
        };
      }
    }
  }
  return null;
}

export function normalizeComments(meta) {
  const list = Array.isArray(meta.comments) ? [...meta.comments] : [];
  if (meta.reworkNote && String(meta.reworkNote).trim()) {
    const noteText = String(meta.reworkNote).trim();
    const hasOpenSame = list.some((c) => c.status !== "resolved" && c.text === noteText);
    if (!hasOpenSame && list.length === 0) {
      list.push({
        id: `c_seed_${meta.slug || "note"}`,
        author: "designer",
        text: noteText,
        status: "open",
        createdAt: new Date().toISOString(),
      });
    }
  }
  return list;
}

export function latestOpenNote(comments) {
  const openDesigner = [...(comments || [])]
    .reverse()
    .find((c) => c.status !== "resolved" && c.author !== "ai");
  return openDesigner ? openDesigner.text : "";
}

export function buildQueueResponse(catalog, { status = "todo", area = "", missing = "" } = {}) {
  const entries = Object.entries(catalog).map(([id, m]) => {
    const comments = normalizeComments(m);
    const openComments = comments.filter((c) => c.status !== "resolved");
    return {
      id,
      slug: m.slug,
      name: m.name || m.slug,
      area: m.area || "sb",
      status: m.status || "approved",
      reworkNote: m.reworkNote || latestOpenNote(comments) || "",
      openCommentCount: openComments.length,
      openComments,
      comments,
      crsKey: m.crsKey || "",
      alias: m.alias || "",
      description: m.description || "",
      tags: m.tags || [m.slug],
      filePath: `src/icons/${m.area || "sb"}/${m.slug}.js`,
    };
  });

  const counts = {
    total: entries.length,
    todo: entries.filter((e) => e.status === "todo").length,
    new: entries.filter((e) => e.status === "new").length,
    review: entries.filter((e) => e.status === "review").length,
    approved: entries.filter((e) => e.status === "approved").length,
    withOpenComments: entries.filter((e) => e.openCommentCount > 0 || Boolean(e.reworkNote)).length,
    missingCrs: entries.filter((e) => !e.crsKey).length,
    missingAlias: entries.filter((e) => !e.alias).length,
  };

  let items = entries;
  if (area && AREAS.includes(area)) {
    items = items.filter((e) => e.area === area);
  }
  if (missing === "crs") {
    items = items.filter((e) => !e.crsKey);
  } else if (missing === "alias") {
    items = items.filter((e) => !e.alias);
  } else if (status && status !== "all") {
    if (status === "attention" || status === "comments") {
      items = items.filter((e) => e.status === "todo" || e.openCommentCount > 0 || Boolean(e.reworkNote));
    } else {
      items = items.filter((e) => e.status === status);
    }
  }

  // Sort items with open comments / todo first:
  items.sort((a, b) => {
    const aScore = (a.status === "todo" ? 10 : 0) + a.openCommentCount * 5 + (a.reworkNote ? 2 : 0);
    const bScore = (b.status === "todo" ? 10 : 0) + b.openCommentCount * 5 + (b.reworkNote ? 2 : 0);
    return bScore - aScore || a.slug.localeCompare(b.slug);
  });

  return { counts, items };
}

// Validate a parametric .js icon module by loading it and compiling across all 4 styles & XY pad extremes
export async function validateIconSource(source, fallbackArea = "sb", fallbackSlug = "temp-check") {
  const issues = [];
  if (typeof source !== "string" || !source.includes("export default")) {
    return {
      ok: false,
      issues: ["Icon module must be an ES module with `export default { id, slug, name, area, meta, build }`."],
    };
  }

  // Rewrite relative `../../engine/primitives.js` import to an absolute file:// URL so we can import from a temp file or data URL:
  const primitivesUrl = pathToFileURL(path.join(SRC_DIR, "engine/primitives.js")).href;
  const rewritten = source.replace(/from\s+["'][^"']*primitives\.js["']/g, `from "${primitivesUrl}"`);
  const dataUrl = `data:text/javascript;base64,${Buffer.from(rewritten, "utf8").toString("base64")}`;

  let spec;
  try {
    const mod = await import(dataUrl);
    spec = mod.default;
  } catch (e) {
    return {
      ok: false,
      issues: [`Syntax / import error: ${e.message}`],
    };
  }

  if (!spec || typeof spec.build !== "function") {
    return {
      ok: false,
      issues: ["Exported default object is missing a `build({ b, r, s, styleMode })` function."],
    };
  }

  const presets = [
    { name: "Soft Default", styleMode: "round", s: 1.75, r: 2.0, b: 0.2, duoColor: "#0969da", mod: "none", isDark: false },
    { name: "Sharp Angular", styleMode: "angular", s: 1.75, r: 0.0, b: 0.0, duoColor: "#0969da", mod: "none", isDark: false },
    { name: "Plump Inflated", styleMode: "round", s: 2.0, r: 2.7, b: 0.4, duoColor: "#0969da", mod: "plus", isDark: true },
  ];

  const svgs = {};
  for (const preset of presets) {
    for (const mode of ["line", "solid", "duotone", "color"]) {
      try {
        const svg = compileIcon(spec, mode, preset, false);
        if (/\bNaN\b|undefined/.test(svg)) {
          issues.push(`Compiled SVG in mode="${mode}" (${preset.name}) contains NaN or undefined coordinates.`);
        }
        if (preset.name === "Soft Default") {
          svgs[mode] = svg;
        }
      } catch (err) {
        issues.push(`Runtime error in mode="${mode}" (${preset.name}): ${err.message}`);
      }
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    specMeta: {
      id: spec.id || `${fallbackArea}-${fallbackSlug}`,
      slug: spec.slug || fallbackSlug,
      name: spec.name || fallbackSlug,
      area: spec.area || fallbackArea,
      desc: spec.desc || "",
    },
    svgs,
  };
}

export function getAuthoringSkillMarkdown() {
  return `# FDSI Parametric Icon Authoring Skill (Workbench ES Module Format)

## 1. File Structure (\`src/icons/<area>/<slug>.js\`)
Every icon is a standalone ES module on a \`24×24\` viewBox (\`2..22\` live zone) that imports helpers from \`../../engine/primitives.js\`:

\`\`\`js
import { f, P, bloatPoly, bloatRect, facePoly, sectorFace, spanLine, edgeX, edgeY, circleToD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "sb-example-icon",
  slug: "example-icon",
  name: "Example Icon",
  area: "sb", // "common" | "sb" | "gx" | "payments" | "bx"
  order: 223,
  desc: "Short geometric description of construction.",
  meta: {
    slug: "example-icon",
    area: "sb",
    alias: "",
    crsKey: "",
    description: "Human-friendly usage description.",
    tags: ["example", "sports"],
    status: "review"
  },
  build: ({ b, r, s, styleMode }) => {
    const body = bloatRect({ x: 4, y: 5, w: 16, h: 14, r: Math.min(r, 2.2), b });
    return {
      keylines: drawKeylines([[12, 12, 4]], body.anchors),
      line: \`<path d="\${body.d}"/>\`,
      solid: {
        fill: [body.d],
        cut: [\`M8 12H16\`]
      },
      duotone: {
        tone: [body.d],
        secondary: [\`M8 12H16\`],
        line: \`<path d="\${body.d}"/>\`
      }
    };
  }
};
\`\`\`

## 2. Available Primitives (\`src/engine/primitives.js\`)
- \`bloatRect({ x, y, w, h, r, b })\` -> returns \`{ d, anchors, poly, pts, box }\` for a squircle/bloated rectangle.
- \`bloatPoly(pts, r, b, { minEdge = 3.5 })\` -> returns \`{ d, anchors, poly, pts, box }\` for an arbitrary closed polygon with rounded corners \`r\` and outward edge bulge \`b\`.
- \`facePoly(pts, { offset, r, bulge })\` -> inset/offset closed polygon for multi-shape padded solid faces (\`offset\` is an array of per-edge inward offsets in px, e.g. \`0.85\` for a \`1.7px\` gap between adjacent faces).
- \`sectorFace(cx, cy, R, a0Deg, a1Deg, s, rCorner = 0.55)\` -> rounded circular sector wedge for balls/wheels.
- \`spanLine(shape, yy, b)\` -> horizontal cubic curve spanning \`shape.poly\` from left edge to right edge at \`y = yy\`.
- \`edgeX(poly, yy, "left" | "right")\` / \`edgeY(poly, xx, "top" | "bottom")\` -> exact intersection of an internal divider with a bloated outer polygon so T-junctions never overshoot or gap.
- \`circleToD(cx, cy, r)\` -> exact 4-arc circular path \`d\`.
- \`drawKeylines(circlesArray, tangentsArray)\` -> blueprint construction overlay (\`circlesArray = [[cx, cy, r], ...]\`, \`tangentsArray = [[x, y], ...]\`).

## 3. Hard Geometry & Style Rules
1. **Multi-Shape Padded Solids First:** Whenever an icon has segmented panels (tickets, cards, funnels, crowns, gems, sports balls, gloves), build \`solid.face\` from **2–7 independent rounded shapes separated by a \`1.5–1.8px\` gap** rather than a single-line slot cut.
2. **Foreground Shapes Over Halo Masks (\`solid.over\`):** Any foreground shape sitting inside a \`holeExact\` / \`cut\` mask must be placed in \`solid.over: [...]\` so the mask does not erase it.
3. **Duotone 3-Layer Rule:** \`duotone.tone\` holds \`28%\` opacity fill paths, \`duotone.secondary\` holds inner detail stroke paths (colored in \`duoColor\`), and \`duotone.line\` holds the outer silhouette stroke.
`;
}
