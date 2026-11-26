import type { IconSize, IconStyle } from "./types";
import { toFigmaSvg } from "./svg-translate";
import { ICON_NAME_PATTERN, variantSortKey } from "./naming";
import { MODIFIER_SPECS } from "./modifiers";
import type { IconModifier } from "./modifiers";
import type { VariantContent } from "./types";

const PD_NAME = "fdsiName";
const PD_BRAND = "fdsiBrand";
const PD_AREA = "fdsiArea";
const PD_HASH = "fdsiLastSyncedHash";
const PD_ROOT = "fdsiRoot";
const PD_MOD_READY = "fdsiModifiersWired";
const PD_MOD_MASK_HELPER = "fdsiModifierMaskHelper";
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

/** Every icon ComponentSet on the page: tagged by the plugin, or named like an icon (excluding internal helper components). */
export function listIconComponentSets(): ComponentSetNode[] {
  return figma.currentPage
    .findAllWithCriteria({ types: ["COMPONENT_SET"] })
    .filter(
      (set) =>
        set.getPluginData(PD_MOD_MASK_HELPER) !== "true" &&
        (set.getPluginData(PD_NAME) !== "" || ICON_NAME_PATTERN.test(set.name))
    );
}

export function readSetArea(node: ComponentSetNode): string {
  return node.getPluginData(PD_AREA);
}

export function readSetIdentity(node: ComponentSetNode): { name: string; brand: string } {
  return { name: node.getPluginData(PD_NAME), brand: node.getPluginData(PD_BRAND) };
}

/** Exports every variant of a set as Figma serialises it (never equal to the repo file; see the contract doc).
 *  Temporarily hides the optional `Modifier` badge instance and `Modifier Cutout Mask` so the exported SVG is 100% pure base artwork! */
export async function exportSetVariants(set: ComponentSetNode): Promise<VariantContent[]> {
  const variants: VariantContent[] = [];
  for (const child of set.children) {
    if (child.type !== "COMPONENT") continue;
    const { size, style } = readVariantProperties(child);
    if (!size || !style) continue;

    // Temporarily hide `Modifier` and `Modifier Cutout Mask` (both top-level and inside `Base Artwork`) if present:
    const modLayers: SceneNode[] = [];
    for (const n of child.children) {
      if (n.name === "Modifier" || n.name === "Modifier Cutout Mask") {
        modLayers.push(n);
      } else if (n.name === "Base Artwork" && "children" in n) {
        for (const inner of n.children) {
          if (inner.name === "Modifier Cutout Mask") modLayers.push(inner);
        }
      }
    }
    const prevVis = modLayers.map((n) => n.visible);
    for (const n of modLayers) n.visible = false;

    try {
      variants.push({ size, style, svg: await child.exportAsync({ format: "SVG_STRING" }) });
    } finally {
      modLayers.forEach((n, i) => {
        n.visible = prevVis[i];
      });
    }
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

/**
 * Ensures every base icon ComponentSet (non-`fdsi-mod-*`) on the page has adjustable Modifier Component Properties:
 *   1. `Show Modifier` (`BOOLEAN`, default `false`)
 *   2. `Modifier` (`INSTANCE_SWAP`, default `fdsi-mod-plus`, preferredValues = all 10 `fdsi-mod-*` components)
 * Plus a true inverted `24×24 minus 1.8px modifier halo` vector mask (`Modifier Cutout Mask`, `isMask = true`, `maskType = "VECTOR"`)
 * positioned at index 0 below the base artwork so toggling `Show Modifier = true` punches a transparent 1.8px corner gap!
 */
export function wireAdjustableModifiersOnAllSets(brand: string): number {
  const allSets = listIconComponentSets().filter((s) => {
    const id = readSetIdentity(s);
    return (id.brand === "" || id.brand === brand) && (id.name || s.name).startsWith("fdsi-");
  });

  // 1. Collect the 10 `fdsi-mod-*` ComponentSets and pick each one's `Size=reg, Style=solid` (or first) ComponentNode:
  const modComponents = new Map<string, ComponentNode>();
  for (const set of allSets) {
    const name = readSetIdentity(set).name || set.name;
    if (!name.startsWith("fdsi-mod-")) continue;
    const solidComp =
      (set.children.find(
        (c): c is ComponentNode =>
          c.type === "COMPONENT" && readVariantProperties(c).style === "solid"
      ) as ComponentNode | undefined) ??
      (set.children.find((c): c is ComponentNode => c.type === "COMPONENT") as ComponentNode | undefined);
    if (solidComp) {
      modComponents.set(name, solidComp);
    }
  }

  const defaultModComp =
    modComponents.get("fdsi-mod-plus") ??
    modComponents.get("fdsi-mod-check") ??
    [...modComponents.values()][0];
  if (!defaultModComp) return 0;

  let wiredCount = 0;
  // Use the universal `1.8px` badge cutout (`check`/`plus`/`minus`/`blocked`/`info`/`pending` inverted 24×24 mask path):
  const invertedMaskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" fill-rule="evenodd" clip-rule="evenodd" d="${MODIFIER_SPECS.plus.invertedMaskD}"/></svg>`;

  for (const set of allSets) {
    const name = readSetIdentity(set).name || set.name;
    if (name.startsWith("fdsi-mod-")) continue;

    // Ensure `Show Modifier` (BOOLEAN) and `Modifier` (INSTANCE_SWAP) exist on the ComponentSet:
    const defs = set.componentPropertyDefinitions;
    let showModPropName = Object.keys(defs).find(
      (k) => k === "Show Modifier" || k.startsWith("Show Modifier#")
    );
    if (!showModPropName) {
      showModPropName = set.addComponentProperty("Show Modifier", "BOOLEAN", false);
    }

    let swapModPropName = Object.keys(defs).find(
      (k) => k === "Modifier" || k.startsWith("Modifier#")
    );
    if (!swapModPropName) {
      swapModPropName = set.addComponentProperty("Modifier", "INSTANCE_SWAP", defaultModComp.id);
    }

    // Wire each variant ComponentNode inside `set`:
    for (const child of set.children) {
      if (child.type !== "COMPONENT") continue;

      // Unwrap any previous `Base Artwork` frame and remove stale `Modifier` / `Modifier Cutout Mask` layers:
      for (const old of [...child.children]) {
        if (old.name === "Modifier" || old.name === "Modifier Cutout Mask") {
          old.remove();
        } else if (old.name === "Base Artwork" && "children" in old) {
          for (const inner of [...old.children]) {
            if (inner.name === "Modifier Cutout Mask") {
              inner.remove();
            } else {
              child.appendChild(inner);
            }
          }
          old.remove();
        }
      }

      // Collect the base artwork vector nodes:
      const baseNodes = [...child.children];

      // 1. Insert `Modifier Cutout Mask` (`isMask = true`, `maskType = "VECTOR"`) at index 0 of `child`,
      //    and group it with `baseNodes` via `figma.group([...], child)` (`Base Artwork`)!
      //    Why a GroupNode instead of a FrameNode? Because wrapping vectors in a `FrameNode` adds an extra `<g>` in `exportAsync({ format: "SVG_STRING" })`
      //    which would change `figmaBase` hashes on already-synced icons! A `GroupNode` isolates `isMask` propagation from the `Modifier` instance above it
      //    WITHOUT altering `exportAsync` SVG output when `Modifier Cutout Mask` is hidden!
      const maskFrame = figma.createNodeFromSvg(invertedMaskSvg);
      const maskVec = maskFrame.children[0] as SceneNode | undefined;
      if (maskVec && "isMask" in maskVec) {
        maskVec.name = "Modifier Cutout Mask";
        child.insertChild(0, maskVec);
        maskVec.x = 0;
        maskVec.y = 0;
        (maskVec as VectorNode).isMask = true;
        if ("maskType" in maskVec) {
          (maskVec as VectorNode).maskType = "VECTOR";
        }
        maskVec.visible = false;
        maskVec.componentPropertyReferences = { visible: showModPropName };
        const grp = figma.group([maskVec, ...baseNodes], child);
        grp.name = "Base Artwork";
      }
      maskFrame.remove();

      // 2. Create the swappable Modifier Instance as a top-level sibling above `Base Artwork` inside `child`:
      //    Because each standalone `fdsi-mod-*` SVG is a full `24×24` frame with the badge already positioned in the bottom-right corner (`14..23`),
      //    keep `modInst` at `24×24` (`x = 0, y = 0`) so it overlays 1:1 with zero scaling distortion!
      const modInst = defaultModComp.createInstance();
      modInst.name = "Modifier";
      modInst.x = 0;
      modInst.y = 0;
      child.appendChild(modInst);
      modInst.visible = false;
      modInst.componentPropertyReferences = {
        visible: showModPropName,
        mainComponent: swapModPropName,
      };
    }

    set.setPluginData(PD_MOD_READY, "true");
    wiredCount++;
  }

  return wiredCount;
}

/** Returns true if any base icon ComponentSet on the page has not yet had adjustable modifiers wired onto it. */
export function hasUnwiredModifierSets(brand: string): boolean {
  const allSets = listIconComponentSets().filter((s) => {
    const id = readSetIdentity(s);
    return (id.brand === "" || id.brand === brand) && (id.name || s.name).startsWith("fdsi-");
  });
  const hasMods = allSets.some((s) => (readSetIdentity(s).name || s.name).startsWith("fdsi-mod-"));
  if (!hasMods) return false;
  return allSets.some((s) => {
    const name = readSetIdentity(s).name || s.name;
    return !name.startsWith("fdsi-mod-") && s.getPluginData(PD_MOD_READY) !== "true";
  });
}

