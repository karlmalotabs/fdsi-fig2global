import type { IconSize, IconStyle } from "./types";
import { variantSortKey } from "./naming";

const FNV_OFFSET_BASIS = 0xcbf29ce484222325n;
const FNV_PRIME = 0x100000001b3n;
const MASK_64 = 0xffffffffffffffffn;

/**
 * Non-cryptographic content fingerprint (FNV-1a 64-bit) used only to detect drift
 * between Figma and the repo — not a security primitive, so no crypto API needed.
 */
export function fnv1a64Hex(input: string): string {
  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < input.length; i++) {
    hash ^= BigInt(input.charCodeAt(i));
    hash = (hash * FNV_PRIME) & MASK_64;
  }
  return hash.toString(16).padStart(16, "0");
}

function normalizeSvg(svg: string): string {
  return svg.replace(/\s+/g, " ").trim();
}

export function hashIconVariants(
  variants: { size: IconSize; style: IconStyle; svg: string }[]
): string {
  const sorted = [...variants].sort((a, b) =>
    variantSortKey(a.size, a.style).localeCompare(variantSortKey(b.size, b.style))
  );
  const combined = sorted
    .map((v) => `${v.size}:${v.style}:${normalizeSvg(v.svg)}`)
    .join("\n");
  return fnv1a64Hex(combined);
}
