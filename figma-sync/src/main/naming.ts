import type { IconSize, IconStyle } from "./types";

export const ICON_NAME_PATTERN = /^fdsi-[a-z0-9]+(-[a-z0-9]+)*$/;
export const VARIANT_FILE_PATTERN =
  /^fdsi-[a-z0-9]+(-[a-z0-9]+)*-(sm|reg|lg)-(outline|solid|color)\.svg$/;

export const SIZES: IconSize[] = ["sm", "reg", "lg"];
export const STYLES: IconStyle[] = ["outline", "solid", "color"];

export function isValidIconName(name: string): boolean {
  return ICON_NAME_PATTERN.test(name);
}

export function isValidAreaSlug(area: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(area);
}

export function variantFileName(iconName: string, size: IconSize, style: IconStyle): string {
  return `${iconName}-${size}-${style}.svg`;
}

/** Sort key so variants are always hashed/rendered in a stable order. */
export function variantSortKey(size: IconSize, style: IconStyle): string {
  return `${SIZES.indexOf(size)}-${STYLES.indexOf(style)}`;
}
