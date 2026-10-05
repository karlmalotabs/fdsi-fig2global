import type { IconSize, IconStyle } from "./types";
import { toFigmaSvg } from "./svg-translate";
import { ICON_NAME_PATTERN, variantSortKey } from "./naming";
import type { VariantContent } from "./types";

const PD_NAME = "fdsiName";
const PD_BRAND = "fdsiBrand";
const PD_AREA = "fdsiArea";
const PD_HASH = "fdsiLastSyncedHash";
const PD_ROOT = "fdsiRoot";
/** Only found in files made before icons moved into the table rows. */
const PD_LEGACY_ICONS_CONTAINER = "fdsiIconsContainer";
const PD_TABLE_CONTAINER = "fdsiTableContainer";

/** Width of the icon column; the set fills it and spreads its variants evenly. */
export const ICON_CELL_WIDTH = 260;

/** Outer frame that holds the icon table, so it needs no manual positioning. */
function getOrCreateRootContainer(): FrameNode {
  const existing = figma.currentPage.findOne(
    (node) => node.type === "FRAME" && node.getPluginData(PD_ROOT) === "true"
  ) as FrameNode | null;
  if (existing) return existing;

  const frame = figma.createFrame();
  frame.name = "FDSI Icon Library";
  frame.setPluginData(PD_ROOT, "true");
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.itemSpacing = 40;
  figma.currentPage.appendChild(frame);
  return frame;
}

/** Drops the old "FDSI Icons" wrap frame once the table rows have taken over its sets. */
export function removeEmptyLegacyIconsContainer(): void {
  const legacy = figma.currentPage.findOne(
    (node) => node.type === "FRAME" && node.getPluginData(PD_LEGACY_ICONS_CONTAINER) === "true"
  ) as FrameNode | null;
  if (legacy && legacy.children.length === 0) legacy.remove();
}

/** Finds (or creates) the auto-layout frame the icon table lives in. */
export function getOrCreateTableContainer(): FrameNode {
  const root = getOrCreateRootContainer();
  const existing = root.findOne(
    (node) => node.type === "FRAME" && node.getPluginData(PD_TABLE_CONTAINER) === "true"
  ) as FrameNode | null;
  if (existing) return existing;

  const frame = figma.createFrame();
  frame.name = "FDSI Icon Table";
  frame.setPluginData(PD_TABLE_CONTAINER, "true");
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.paddingLeft = 24;
  frame.paddingRight = 24;
  frame.paddingTop = 24;
  frame.paddingBottom = 24;
  root.appendChild(frame);
  return frame;
}

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

/** Every icon ComponentSet on the page: tagged by the plugin, or named like an icon. */
export function listIconComponentSets(): ComponentSetNode[] {
  return figma.currentPage
    .findAllWithCriteria({ types: ["COMPONENT_SET"] })
    .filter((set) => set.getPluginData(PD_NAME) !== "" || ICON_NAME_PATTERN.test(set.name));
}

export function readSetArea(node: ComponentSetNode): string {
  return node.getPluginData(PD_AREA);
}

export function readSetIdentity(node: ComponentSetNode): { name: string; brand: string } {
  return { name: node.getPluginData(PD_NAME), brand: node.getPluginData(PD_BRAND) };
}

/** Exports every variant of a set as Figma serialises it (never equal to the repo file; see the contract doc). */
export async function exportSetVariants(set: ComponentSetNode): Promise<VariantContent[]> {
  const variants: VariantContent[] = [];
  for (const child of set.children) {
    if (child.type !== "COMPONENT") continue;
    const { size, style } = readVariantProperties(child);
    if (!size || !style) continue;
    variants.push({ size, style, svg: await child.exportAsync({ format: "SVG_STRING" }) });
  }
  return variants;
}

const SHARED_NS = "fdsi";

export interface SyncBases {
  figmaBase: string | null;
  repoBase: string | null;
}

/** Last-synced hashes live on the set as shared plugin data so a later server-side flow can read them too. */
export function readBases(set: ComponentSetNode): SyncBases {
  return {
    figmaBase: set.getSharedPluginData(SHARED_NS, "figmaBase") || null,
    repoBase: set.getSharedPluginData(SHARED_NS, "repoBase") || null,
  };
}

export function writeBases(set: ComponentSetNode, bases: SyncBases): void {
  if (bases.figmaBase !== null) set.setSharedPluginData(SHARED_NS, "figmaBase", bases.figmaBase);
  if (bases.repoBase !== null) set.setSharedPluginData(SHARED_NS, "repoBase", bases.repoBase);
}

/** A pushed-by-PR icon: the Figma state that went into the PR, applied as `figmaBase` once the PR merges. */
export interface PendingPr {
  number: number;
  figmaBase: string;
}

export function readPendingPr(set: ComponentSetNode): PendingPr | null {
  const raw = set.getSharedPluginData(SHARED_NS, "pendingPr");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingPr;
  } catch {
    return null;
  }
}

export function writePendingPr(set: ComponentSetNode, pending: PendingPr | null): void {
  set.setSharedPluginData(SHARED_NS, "pendingPr", pending ? JSON.stringify(pending) : "");
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
function replaceComponentContent(component: ComponentNode, svg: string, style: IconStyle): void {
  const svgFrame = figma.createNodeFromSvg(toFigmaSvg(svg, style));
  for (const child of [...component.children]) child.remove();
  for (const child of [...svgFrame.children]) component.appendChild(child);
  component.resizeWithoutConstraints(svgFrame.width, svgFrame.height);
  svgFrame.remove();
}

function createComponentFromSvg(svg: string, size: IconSize, style: IconStyle): ComponentNode {
  const svgFrame = figma.createNodeFromSvg(toFigmaSvg(svg, style));
  const component = figma.createComponent();
  component.resizeWithoutConstraints(svgFrame.width, svgFrame.height);
  for (const child of [...svgFrame.children]) component.appendChild(child);
  svgFrame.remove();
  component.name = variantPropertyName(size, style);
  return component;
}

/** Variants in size/style order, spread evenly across the icon cell by auto layout; safe to call repeatedly. */
export function applyIconSetLayout(set: ComponentSetNode): void {
  const ordered = (set.children.filter((c) => c.type === "COMPONENT") as ComponentNode[]).sort((a, b) => {
    const av = readVariantProperties(a);
    const bv = readVariantProperties(b);
    return variantSortKey(av.size ?? "reg", av.style ?? "outline").localeCompare(
      variantSortKey(bv.size ?? "reg", bv.style ?? "outline")
    );
  });
  ordered.forEach((component, index) => {
    if (set.children[index] !== component) set.insertChild(index, component);
  });

  if (set.layoutMode === "HORIZONTAL" && set.width === ICON_CELL_WIDTH) return;
  set.layoutMode = "HORIZONTAL";
  set.primaryAxisSizingMode = "FIXED";
  set.counterAxisSizingMode = "AUTO";
  set.primaryAxisAlignItems = "SPACE_BETWEEN";
  set.counterAxisAlignItems = "CENTER";
  set.itemSpacing = 8;
  set.paddingLeft = 12;
  set.paddingRight = 12;
  set.paddingTop = 8;
  set.paddingBottom = 8;
  set.resize(ICON_CELL_WIDTH, set.height);
}

/** Creates a brand-new ComponentSet (one child Component per variant) inside `parent` and tags it for future matching. */
export function createIconComponentSet(
  iconName: string,
  brand: string,
  area: string,
  variants: VariantContent[],
  hash: string,
  parent: FrameNode
): ComponentSetNode {
  const components = variants.map((v) => createComponentFromSvg(v.svg, v.size, v.style));
  const set = figma.combineAsVariants(components, parent);
  set.name = iconName;
  tagIconComponentSet(set, { name: iconName, brand, area, hash });
  applyIconSetLayout(set);
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
      replaceComponentContent(existing, variant.svg, variant.style);
    } else {
      const created = createComponentFromSvg(variant.svg, variant.size, variant.style);
      set.appendChild(created);
    }
  }

  tagIconComponentSet(set, { name: set.getPluginData(PD_NAME), brand, area, hash });
  applyIconSetLayout(set);
}
