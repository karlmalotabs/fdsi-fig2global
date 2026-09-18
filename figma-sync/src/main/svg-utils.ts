import sizeTokens from "../../../registry/schema/size-tokens.json";
import type { IconSize } from "./types";

const PX_BY_SIZE = sizeTokens as unknown as Record<IconSize, number>;

function extractAttr(svg: string, attr: string): string | null {
  const match = svg.match(new RegExp(`${attr}\\s*=\\s*"([^"]+)"`, "i"));
  return match ? match[1] : null;
}

/** Reads the numeric px size out of a viewBox ("0 0 24 24") or width/height attribute. */
function declaredPx(svg: string): number | null {
  const width = extractAttr(svg, "width");
  if (width && /^\d+(\.\d+)?$/.test(width)) return parseFloat(width);

  const viewBox = extractAttr(svg, "viewBox");
  if (viewBox) {
    const parts = viewBox.trim().split(/\s+/).map(Number);
    if (parts.length === 4 && !Number.isNaN(parts[2])) return parts[2];
  }
  return null;
}

/**
 * Safeguard: an SVG's declared width/viewBox must equal its size token's canonical
 * px value (sm=16, reg=24, lg=48 — see registry/schema/size-tokens.json).
 */
export function validateSvgMatchesSizeToken(svg: string, size: IconSize): string[] {
  const expected = PX_BY_SIZE[size];
  const actual = declaredPx(svg);
  if (expected === undefined) return [`Unknown size token "${size}"`];
  if (actual === null) return [`Could not determine px size from SVG width/viewBox`];
  if (actual !== expected) {
    return [`SVG size is ${actual}px but "${size}" must be ${expected}px`];
  }
  return [];
}
