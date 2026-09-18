import type { IconSize, IconStyle } from "./types";
import type { VariantContent } from "./types";

const PD_NAME = "fdsiName";
const PD_BRAND = "fdsiBrand";
const PD_AREA = "fdsiArea";
const PD_HASH = "fdsiLastSyncedHash";

export function variantPropertyName(size: IconSize, style: IconStyle): string {
  return `Size=${size}, Style=${style}`;
}

export function readVariantProperties(component: ComponentNode): { size?: IconSize; style?: IconStyle } {
  const props = component.variantProperties ?? {};
  return { size: props["Size"] as IconSize | undefined, style: props["Style"] as IconStyle | undefined };
}

export function findIconComponentSet(name: string, brand: string): ComponentSetNode | null {
  const match = figma.currentPage.findOne(
    (node) =>
      node.type === "COMPONENT_SET" &&
      node.getPluginData(PD_NAME) === name &&
      node.getPluginData(PD_BRAND) === brand
  );
  return (match as ComponentSetNode) ?? null;
}

export function readSyncedHash(node: ComponentSetNode): string | null {
  const value = node.getPluginData(PD_HASH);
  return value || null;
}

export function tagIconComponentSet(
  node: ComponentSetNode,
  info: { name: string; brand: string; area: string; hash: string }
): void {
  node.setPluginData(PD_NAME, info.name);
  node.setPluginData(PD_BRAND, info.brand);
  node.setPluginData(PD_AREA, info.area);
  node.setPluginData(PD_HASH, info.hash);
}

/** Replaces a component's vector content with freshly imported SVG, preserving the node (and its instances). */
function replaceComponentContent(component: ComponentNode, svg: string): void {
  const svgFrame = figma.createNodeFromSvg(svg);
  for (const child of [...component.children]) child.remove();
  for (const child of [...svgFrame.children]) component.appendChild(child);
  component.resizeWithoutConstraints(svgFrame.width, svgFrame.height);
  svgFrame.remove();
}

function createComponentFromSvg(svg: string, size: IconSize, style: IconStyle): ComponentNode {
  const svgFrame = figma.createNodeFromSvg(svg);
  const component = figma.createComponent();
  component.resizeWithoutConstraints(svgFrame.width, svgFrame.height);
  for (const child of [...svgFrame.children]) component.appendChild(child);
  svgFrame.remove();
  component.name = variantPropertyName(size, style);
  return component;
}

/** Creates a brand-new ComponentSet (one child Component per variant) and tags it for future matching. */
export function createIconComponentSet(
  iconName: string,
  brand: string,
  area: string,
  variants: VariantContent[],
  hash: string
): ComponentSetNode {
  const components = variants.map((v) => createComponentFromSvg(v.svg, v.size, v.style));
  const set = figma.combineAsVariants(components, figma.currentPage);
  set.name = iconName;
  tagIconComponentSet(set, { name: iconName, brand, area, hash });
  return set;
}

/**
 * Updates an existing ComponentSet in place: replaces content for variants that already
 * exist (preserving instances) and appends new Component children for newly-added variants.
 */
export function updateIconComponentSet(
  set: ComponentSetNode,
  brand: string,
  area: string,
  variants: VariantContent[],
  hash: string
): void {
  const existingByKey = new Map<string, ComponentNode>();
  for (const child of set.children) {
    if (child.type !== "COMPONENT") continue;
    const { size, style } = readVariantProperties(child);
    if (size && style) existingByKey.set(`${size}:${style}`, child);
  }

  for (const variant of variants) {
    const key = `${variant.size}:${variant.style}`;
    const existing = existingByKey.get(key);
    if (existing) {
      replaceComponentContent(existing, variant.svg);
    } else {
      const created = createComponentFromSvg(variant.svg, variant.size, variant.style);
      set.appendChild(created);
    }
  }

  tagIconComponentSet(set, { name: set.getPluginData(PD_NAME), brand, area, hash });
}
