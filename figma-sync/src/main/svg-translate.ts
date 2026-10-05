import type { IconStyle } from "./types";

// Figma has no notion of currentColor: it imports it as black and exports black. The repo needs currentColor so icons inherit text colour.

const BLACK_PAINT = /(\s)(fill|stroke)=(["'])(?:black|#000(?:000)?)\3/gi;
const CURRENT_COLOR_PAINT = /(\s)(fill|stroke)=(["'])currentColor\3/gi;
const MASK_BLOCK = /(<mask\b[\s\S]*?<\/mask>)/gi;

/** Mask luminance depends on literal black/white, so those paints must never be rewritten. */
function mapOutsideMasks(svg: string, fn: (part: string) => string): string {
  return svg
    .split(MASK_BLOCK)
    .map((part, i) => (i % 2 === 1 ? part : fn(part)))
    .join("");
}

/** Figma export -> repo: black fills/strokes become currentColor. Multi-colour (`color`) icons are left untouched. */
export function toRepoSvg(svg: string, style: IconStyle): string {
  if (style === "color") return svg;
  return mapOutsideMasks(svg, (part) => part.replace(BLACK_PAINT, "$1$2=$3currentColor$3"));
}

/** Repo -> Figma import: currentColor becomes black so the imported layers have a real fill. */
export function toFigmaSvg(svg: string, style: IconStyle): string {
  if (style === "color") return svg;
  return mapOutsideMasks(svg, (part) => part.replace(CURRENT_COLOR_PAINT, "$1$2=$3black$3"));
}
