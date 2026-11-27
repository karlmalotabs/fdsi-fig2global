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

export const GOLDEN_RULES_CHECKLIST = [
  "1. 24x24 Canvas & 2..22 Active Zone: Outer 2px margin (0..2, 22..24) is reserved for corner modifiers. Snap centers/lines to 0.5px increments and keep >= 1.5px stroke clearance.",
  "2. Anchor-Locked Bloat (b): Connect interior seams to `H.anchors[i]` (never raw `pts[i]`), lock horizontal/vertical wall T-junctions with `edgeX(H.poly, y, side)` / `edgeY(H.poly, x, side)` / `ellipseY()`, and use `spanLine(H, y, b)` for full-width dividers.",
  "3. Multi-Shape Padded Solids First (`solid.face: [...]`): For segmented containers, cards, tickets, funnels, crowns, gems, or multi-part sports gear, build `solid` from 2–7 independent rounded shapes (`bloatRect`/`bloatPoly`/`facePoly`/true `A R R` arcs) separated by a 1.5–1.8px padding gap — NEVER a single-line slot knockout, and NEVER call bitmap tracers `solidFaces()` or `outline()`.",
  "4. Foreground Shapes Over Halo Masks (`solid.over: [...]`): Any foreground shape sitting inside a `holeExact`/`cut` halo (e.g. Lego top stud, wallet clasp, 8-ball loops, bowling ball) MUST go in `solid.over: [...]` so `<g mask>` does not erase it. Pass overlapping `evenodd` rings as separate array entries (`over: [topRing, botRing]`).",
  "5. 4-Style Completeness (`line`, `solid`, `duotone`, `color`): Always return `keylines: drawKeylines(...)`, `line`, `solid`, and `duotone: { tone: [...], secondary: [...], line: '...' }`. In `color` mode, `compiler.js` automatically layers `tone` (Layer 1) -> `secondary` (Layer 2) -> `extractOuterStroke(line, secondary)` (Layer 3 on top).",
  "6. Call `workbench_get_skill` for full category recipes (3D isometric balls, `tangentHull2` + `roundOpen` athlete pictograms, ogive rockets/flames, and T-junction formulas), and ALWAYS run `workbench_validate_icon` before `workbench_submit_icon`.",
];

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

  return {
    counts,
    goldenRulesChecklist: GOLDEN_RULES_CHECKLIST,
    items,
  };
}

// Validate a parametric .js icon module by loading it and compiling across all 4 styles & XY pad extremes
// + running the Deterministic Golden-Rule Static Linter (Gate A)
export async function validateIconSource(source, fallbackArea = "sb", fallbackSlug = "temp-check") {
  const issues = [];
  const warnings = [];
  if (typeof source !== "string" || !source.includes("export default")) {
    return {
      ok: false,
      issues: ["Icon module must be an ES module with `export default { id, slug, name, area, meta, build }`."],
      warnings,
    };
  }

  // Gate A1: Hard ban on bitmap Marching Squares tracers (`solidFaces` and `outline`)
  if (/\bsolidFaces\s*\(|\boutline\s*\(/.test(source)) {
    issues.push(
      "Golden Rule Violation: `solidFaces()` and `outline()` are banned (they rasterize onto a bitmap). Use analytical `face: [...]`, `fill: [...]`, `over: [...]`, `holeExact: [...]`, or `tubes: [...]`."
    );
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
      warnings,
    };
  }

  if (!spec || typeof spec.build !== "function") {
    return {
      ok: false,
      issues: ["Exported default object is missing a `build({ b, r, s, styleMode })` function."],
      warnings,
    };
  }

  // Gate A2: Inspect raw `spec.build()` return structure at Soft Default tokens
  try {
    const sampleOut = spec.build({ styleMode: "round", s: 1.75, r: 2.0, b: 0.2, duoColor: "#0969da", mod: "none", isDark: false });
    if (!sampleOut || typeof sampleOut.line !== "string" || !sampleOut.line.trim()) {
      issues.push("`build()` must return a non-empty `line` SVG markup string (e.g. `<path d=\"...\"/>`).");
    }
    const S = sampleOut?.solid;
    const hasSolidContent =
      S &&
      ((Array.isArray(S.fill) && S.fill.length > 0) ||
        (Array.isArray(S.face) && S.face.length > 0) ||
        (Array.isArray(S.faces) && S.faces.length > 0) ||
        (Array.isArray(S.tubes) && S.tubes.length > 0) ||
        (Array.isArray(S.stroke) && S.stroke.length > 0));
    if (!hasSolidContent) {
      issues.push("`build()` must return a `solid` object with at least one of `face`, `fill`, `tubes`, or `stroke`.");
    }
    if (S) {
      for (const key of ["fill", "face", "faces", "over", "holeExact", "hole", "cut", "knocks", "stroke"]) {
        const arr = S[key];
        if (Array.isArray(arr) && arr.some((d) => typeof d === "string" && d.trim().startsWith("<"))) {
          issues.push(
            `\`solid.${key}\` must contain raw SVG path \`d\` strings (e.g. \`"M4 4..."\`), NEVER \`<path .../>\` HTML tags.`
          );
        }
      }
    }
    const D = sampleOut?.duotone;
    if (!D || ((!Array.isArray(D.tone) || D.tone.length === 0) && (!Array.isArray(D.secondary) || D.secondary.length === 0))) {
      warnings.push("`duotone` has neither `tone` fills nor `secondary` inner strokes; add `duotone: { tone: [...], secondary: [...], line }` so Duotone and Color styles have full depth.");
    }
    if (!sampleOut?.keylines) {
      warnings.push("`keylines` is empty; consider returning `keylines: drawKeylines(circles, anchors)` for blueprint inspection.");
    }
  } catch (err) {
    issues.push(`Runtime error calling \`build()\` at default tokens: ${err.message}`);
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
    warnings,
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
  const fullSkillPath = path.join(WORKBENCH_DIR, "SKILL.md");
  const fullSkillBody = fs.existsSync(fullSkillPath) ? fs.readFileSync(fullSkillPath, "utf8") : "";

  const header = `# FDSI Parametric Icon Authoring Skill & Golden Rules (Workbench ES Module Format)

## Quick Golden Rules Checklist
${GOLDEN_RULES_CHECKLIST.map((r) => `- ${r}`).join("\n")}

## Available Primitives in \`../../engine/primitives.js\`
- \`f(n)\`, \`P([x, y])\`, \`add(a, b)\`, \`sub(a, b)\`, \`mul(a, k)\`, \`len(a)\`, \`norm(a)\`, \`deg2rad(d)\`, \`rad2deg(r)\`
- \`polar(cx, cy, r, deg)\` -> \`[x, y]\` on circle at angle \`deg\`
- \`circleD(cx, cy, r)\` -> closed 2-arc circle path \`d\`
- \`arcD(cx, cy, r, deg0, deg1, sweep = 1)\` -> open circular arc path \`d\`
- \`outerTangents(c1, r1, c2, r2)\` -> external bitangent points & angles between two circles
- \`tangentHull2(c1, r1, c2, r2)\` -> \`{ d, t }\` closed smooth capsule/tapered hull connecting two circles (ideal for athlete torsos, equine thighs, dart barrels)
- \`capsule(a, b, w, x2, r)\` -> round-capped pill contour between two points
- \`ellipseY(cx, cy, rx, ry, x, half = "bottom" | "top")\` -> exact y coordinate on an ellipse at x
- \`roundOpen(pts, r)\` -> open polyline with circular-arc filleted joints (ideal for athlete limbs)
- \`bloatRect({ x, y, w, h, r, b })\` -> \`{ d, anchors, poly, pts, box }\` bloated squircle rectangle
- \`bloatPoly(pts, r, b, { minEdge, inset, edgeBulge })\` -> \`{ d, anchors, poly, pts, box }\` bloated closed polygon
- \`edgeX(poly, yy, "left" | "right")\` / \`edgeY(poly, xx, "top" | "bottom")\` -> exact wall intersection on a bloated polygon
- \`spanLine(shape, yy, b)\` -> horizontal cubic curve spanning \`shape.poly\` from left wall to right wall
- \`facePoly(pts, { offset, r, bulge })\` -> inset closed polygon for Multi-Shape Padded Solids (\`solid.face: [...]\`)
- \`sectorFace(cx, cy, R, a0Deg, a1Deg, s, rCorner = 0.55)\` -> rounded circular sector wedge for balls/wheels
- \`drawKeylines(circlesArray, tangentsArray)\` -> blueprint construction overlay

---

`;

  return header + fullSkillBody;
}
