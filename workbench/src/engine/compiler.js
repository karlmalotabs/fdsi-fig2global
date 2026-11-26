import { nextUid } from "./primitives.js";
import { BADGE_DISC, MODS } from "./modifiers.js";
import { getColorPalette } from "./palettes.js";

// Split `baseLine` into `innerRemovedLine` (Outer Stroke on Top Layer) by removing any `<path d="..."/>`
// whose `d` is already drawn in Layer 2 (`secondary`), so Layer 3 only draws the Outer Stroke on top!
export function extractOuterStroke(baseLine, secPaths) {
  if (!secPaths || !secPaths.length) return baseLine;
  let res = baseLine;
  for (const d of secPaths) {
    if (!d) continue;
    res = res.split(`<path d="${d}"/>`).join("");
  }
  return res;
}

export function compileIcon(spec, mode, state, includeKeylines = false) {
  const { s, styleMode, mod, duoColor, showKeylines } = state;
  const cap = styleMode === "angular" ? "butt" : "round";
  const join = styleMode === "angular" ? "miter" : "round";
  const out = spec.build(state);
  const id = "m6_" + nextUid();

  const m = MODS[mod];
  const shieldHalo = 2.2 * s;
  let modMask = "",
    modEls = "";
  if (m) {
    if (m.kind === "badge") {
      modMask = `<path d="${BADGE_DISC}" fill="#000" stroke="#000" stroke-width="${shieldHalo}" stroke-linejoin="round"/>`;
      const mId = id + "bg";
      modEls =
        `<defs><mask id="${mId}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${m.hole()}" fill="#000"/></mask></defs>` +
        `<path d="${BADGE_DISC}" fill="${m.color}" stroke="none" mask="url(#${mId})"/>`;
    } else if (m.kind === "outside") {
      if (m.shape) {
        const dShape = m.shape();
        modMask = `<path d="${dShape}" fill="#000" stroke="#000" stroke-width="${shieldHalo}" stroke-linejoin="round" stroke-linecap="round"/>`;
        if (m.hole) {
          const fId = id + "fl";
          modEls =
            `<defs><mask id="${fId}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${m.hole()}" fill="#000"/></mask></defs>` +
            `<path d="${dShape}" fill="${m.color}" stroke="none" mask="url(#${fId})"/>`;
        } else {
          modEls = `<path d="${dShape}" fill="${m.color}" stroke="none"/>`;
        }
      } else if (m.body) {
        const dBody = m.body(),
          dKh = m.keyhole();
        modMask =
          `<path d="${dBody}" fill="#000" stroke="#000" stroke-width="${shieldHalo}" stroke-linejoin="round"/>` +
          `<path d="${m.shackle}" fill="none" stroke="#000" stroke-width="${1.6 + shieldHalo}" stroke-linecap="round"/>`;
        const pId = id + "pl";
        modEls =
          `<defs><mask id="${pId}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${dKh}" fill="#000"/></mask></defs>` +
          `<path d="${m.shackle}" fill="none" stroke="${m.color}" stroke-width="1.6" stroke-linecap="round"/>` +
          `<path d="${dBody}" fill="${m.color}" stroke="none" mask="url(#${pId})"/>`;
      }
    }
  }

  let content = "",
    defs = "";
  if (mode === "line") {
    content = out.line;
  } else if (mode === "duotone") {
    const secPaths = out.duotone?.secondary || [];
    const tones = (out.duotone?.tone || [])
      .map((d) => `<path d="${d}" fill="${duoColor}" fill-opacity="0.28" stroke="none"/>`)
      .join("");
    const sec = secPaths
      .map((d) => `<path d="${d}" fill="none" stroke="${duoColor}" stroke-width="${s}" stroke-linecap="${cap}" stroke-linejoin="${join}"/>`)
      .join("");
    const rawLine = out.duotone?.line || out.duotone?.els || out.line;
    const outerStroke = extractOuterStroke(rawLine, secPaths);
    content = tones + sec + outerStroke;
  } else if (mode === "color") {
    if (out.color) {
      content = typeof out.color === "function" ? out.color(state.isDark) : out.color;
    } else {
      const pal = spec.palette || getColorPalette(spec.id, state.isDark);
      const [c1, c2, c3] = pal;
      const secPaths = out.duotone?.secondary || [];
      const rawTones =
        out.duotone?.tone && out.duotone.tone.length
          ? out.duotone.tone
          : [...(out.solid?.fill || []), ...(out.solid?.face || [])];
      const tones = rawTones
        .map((d, i) => {
          const col = i === 0 ? c1 : i === 1 ? c3 || c2 : c2;
          return `<path d="${d}" fill="${col}" fill-opacity="1" stroke="none"/>`;
        })
        .join("");
      const closedSecFills = secPaths
        .filter((d) => /Z$/i.test(d.trim()))
        .map((d) => `<path d="${d}" fill="${c3 || c1}" fill-opacity="1" stroke="none"/>`)
        .join("");
      const innerLines = secPaths
        .map((d) => `<path d="${d}" fill="none" stroke="${c2}" stroke-width="${s}" stroke-linecap="${cap}" stroke-linejoin="${join}"/>`)
        .join("");
      const rawLine = out.duotone?.line || out.duotone?.els || out.line;
      const outerStroke = extractOuterStroke(rawLine, secPaths);
      content = tones + closedSecFills + innerLines + outerStroke;
    }
  } else if (mode === "solid") {
    const S = out.solid;
    const cuts =
      (S.cut || []).map((d) => `<path d="${d}" fill="none" stroke="#000" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"/>`).join("") +
      (S.knocks || []).map((d) => `<path d="${d}" fill="#000" stroke="#000" stroke-width="${2.2 * s}" stroke-linecap="round" stroke-linejoin="round"/>`).join("") +
      (S.hole || []).map((d) => `<path d="${d}" fill="#000" stroke="#000" stroke-width="${s}" stroke-linejoin="round"/>`).join("") +
      (S.holeExact || []).map((d) => `<path d="${d}" fill="#000" stroke="none"/>`).join("");
    if (cuts)
      defs += `<mask id="${id}c" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>${cuts}</mask>`;
    const fills =
      (S.fill || []).map((d) => `<path d="${d}" fill="currentColor" stroke="currentColor" stroke-width="${s}" stroke-linejoin="${join}"/>`).join("") +
      [...(S.face || []), ...(S.faces || [])].map((d) => `<path d="${d}" fill="currentColor" fill-rule="evenodd" stroke="none"/>`).join("") +
      (S.tubes || []).map(([d, w]) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${w || s}" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
    const overs = (S.over || []).map((d) => `<path d="${d}" fill="currentColor" fill-rule="evenodd" stroke="none"/>`).join("");
    const strokes = (S.stroke || [])
      .map((d) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="${cap}" stroke-linejoin="${join}"/>`)
      .join("");
    content = (cuts ? `<g mask="url(#${id}c)">${fills}</g>` : fills) + overs + strokes;
  }

  if (modMask) {
    defs += `<mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>${modMask}</mask>`;
  }

  const keyOverlay =
    includeKeylines && showKeylines
      ? `<g class="kl-grid" pointer-events="none">` +
        `<rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="var(--kl-grid, rgba(14,165,233,0.42))" stroke-width="0.2" stroke-dasharray="0.6 0.5"/>` +
        `<circle cx="12" cy="12" r="9" fill="none" stroke="var(--kl-grid, rgba(14,165,233,0.34))" stroke-width="0.18" stroke-dasharray="0.5 0.5"/>` +
        `<line x1="12" y1="1" x2="12" y2="23" stroke="var(--kl-grid, rgba(14,165,233,0.28))" stroke-width="0.16"/>` +
        `<line x1="1" y1="12" x2="23" y2="12" stroke="var(--kl-grid, rgba(14,165,233,0.28))" stroke-width="0.16"/>` +
        `<line x1="2" y1="2" x2="22" y2="22" stroke="var(--kl-grid, rgba(14,165,233,0.20))" stroke-width="0.14"/>` +
        `<line x1="22" y1="2" x2="2" y2="22" stroke="var(--kl-grid, rgba(14,165,233,0.20))" stroke-width="0.14"/>` +
        `</g>` +
        (out.keylines || "")
      : "";

  const artworkOpacity = includeKeylines && showKeylines && (mode === "color" || mode === "solid") ? ` opacity="0.72"` : "";

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">` +
    (defs ? `<defs>${defs}</defs>` : "") +
    `<g ${modMask ? `mask="url(#${id}m)"` : ""}${artworkOpacity} stroke="currentColor" stroke-width="${s}" stroke-linecap="${cap}" stroke-linejoin="${join}" stroke-miterlimit="4" fill="none">` +
    `${content}</g>${modEls}${keyOverlay}</svg>`
  );
}
