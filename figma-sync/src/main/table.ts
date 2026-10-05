import { ICON_CELL_WIDTH, applyIconSetLayout, listIconComponentSets, readSetArea, removeEmptyLegacyIconsContainer } from "./figma-nodes";
import {
  EMPTY_PLACEHOLDER,
  LEGACY_FIELD_ORDER,
  SYNC_STATUS_LAYER,
  fieldLayerName,
  joinRowsAndSets,
  parseFieldLayerName,
  parseRowFields,
  rowLayerName,
  validateRowFields,
} from "./contract";
import type { RawRowFields, RowFieldKey, RowFields, RowSetJoin } from "./contract";

// Table layout (docs/figma-contract-and-plan.md, "Table v3"): a header, then one band per area,
// each followed by its rows. A row is a set of column-group frames; the icon ComponentSet sits in the first.
const PD_TABLE_HEADER = "fdsiTableHeader";
const PD_TABLE_ROW = "fdsiTableRow";
const PD_AREA_BAND = "fdsiTableAreaBand";
/** Bumped when the header's columns change, so older headers are rebuilt. */
const HEADER_VERSION = "3";

const ICON_CELL_LAYER = "cells/icon";
const AREA_LABEL_LAYER = "area-label";
const AREA_COUNT_LAYER = "area-count";
const CELLS_PREFIX = "cells/";

const FONT_REGULAR = { family: "Inter", style: "Regular" } as const;
const FONT_MEDIUM = { family: "Inter", style: "Medium" } as const;
const FONT_SEMI_BOLD = { family: "Inter", style: "Semi Bold" } as const;
const FONT_BOLD = { family: "Inter", style: "Bold" } as const;

const COLUMN_GAP = 12;
const CELL_PADDING_X = 12;
const CELL_PADDING_Y = 8;

type FieldColumnKey = Exclude<RowFieldKey, "area">;
type ColumnKey = FieldColumnKey | "icon" | "sync-status";
interface Column {
  key: ColumnKey;
  header: string;
  width: number;
}
interface Group {
  id: string;
  label: string;
  color: string;
  tint: string;
  paddingLeft: number;
  columns: Column[];
}

// The area is the band a row sits under, so it has no column of its own.
const GROUPS: Group[] = [
  { id: "icon", label: "Icon", color: "#6B6B6B", tint: "#F5F5F5", paddingLeft: 28, columns: [{ key: "icon", header: "Icon", width: ICON_CELL_WIDTH }] },
  {
    id: "identity",
    label: "Identity",
    color: "#0A74C2",
    tint: "#E5F4FF",
    paddingLeft: CELL_PADDING_X,
    columns: [
      { key: "name", header: "Name", width: 130 },
      { key: "displayName", header: "Display Name", width: 110 },
    ],
  },
  {
    id: "content",
    label: "Content",
    color: "#7B3FD6",
    tint: "#F0E8FC",
    paddingLeft: CELL_PADDING_X,
    columns: [
      { key: "description", header: "Description", width: 200 },
      { key: "tags", header: "Tags", width: 130 },
      { key: "aliases", header: "Aliases", width: 120 },
    ],
  },
  {
    id: "lifecycle",
    label: "Lifecycle",
    color: "#C77700",
    tint: "#FFF3DB",
    paddingLeft: CELL_PADDING_X,
    columns: [
      { key: "status", header: "Status", width: 70 },
      { key: "deprecatedInFavorOf", header: "Deprecated in favor of", width: 120 },
    ],
  },
  { id: "sync", label: "Sync", color: "#0B7A41", tint: "#E6F6EC", paddingLeft: CELL_PADDING_X, columns: [{ key: "sync-status", header: "Sync status", width: 110 }] },
];

const FIELD_COLUMNS = GROUPS.flatMap((g) => g.columns).filter((c): c is Column & { key: FieldColumnKey } => c.key !== "icon" && c.key !== "sync-status");
const FIELD_KEYS: readonly RowFieldKey[] = [...FIELD_COLUMNS.map((c) => c.key), "area"];

const COLORS = {
  text: "#1E1E1E",
  sub: "#6B6B6B",
  faint: "#9A9A9A",
  border: "#E6E6E6",
  surface: "#F5F5F5",
  blue: "#0A74C2",
  areaBand: "#EEF6FF",
};

function rgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

const paint = (hex: string): SolidPaint[] => [{ type: "SOLID", color: rgb(hex) }];

async function ensureFontsLoaded(): Promise<void> {
  await Promise.all([FONT_REGULAR, FONT_MEDIUM, FONT_SEMI_BOLD, FONT_BOLD].map((f) => figma.loadFontAsync(f)));
}

function groupWidth(group: Group): number {
  return group.columns.reduce((sum, c) => sum + c.width, 0) + COLUMN_GAP * (group.columns.length - 1) + group.paddingLeft + CELL_PADDING_X;
}

interface TextStyle {
  font?: FontName;
  size?: number;
  color?: string;
}

function createText(text: string, layerName: string, width: number | null, style: TextStyle = {}): TextNode {
  const node = figma.createText();
  node.fontName = style.font ?? FONT_REGULAR;
  node.fontSize = style.size ?? 12;
  node.characters = text.length > 0 ? text : EMPTY_PLACEHOLDER;
  node.fills = paint(style.color ?? COLORS.text);
  if (width !== null) {
    node.textAutoResize = "HEIGHT";
    node.resize(width, node.height);
  }
  // Set last: assigning a name stops Figma from renaming the layer after its text.
  node.name = layerName;
  return node;
}

function setLeftBorder(frame: FrameNode): void {
  frame.strokes = paint(COLORS.border);
  frame.strokeTopWeight = 0;
  frame.strokeBottomWeight = 0;
  frame.strokeRightWeight = 0;
  frame.strokeLeftWeight = 1;
}

function setBottomBorder(frame: FrameNode): void {
  frame.strokes = paint(COLORS.border);
  frame.strokeTopWeight = 0;
  frame.strokeLeftWeight = 0;
  frame.strokeRightWeight = 0;
  frame.strokeBottomWeight = 1;
}

/** A fixed-width cell group that hugs its height; the caller stretches it to the row afterwards. */
function createGroupFrame(group: Group, layerName: string, verticalPadding: number): FrameNode {
  const frame = figma.createFrame();
  frame.name = layerName;
  frame.layoutMode = "HORIZONTAL";
  frame.itemSpacing = COLUMN_GAP;
  frame.fills = [];
  frame.paddingTop = verticalPadding;
  frame.paddingBottom = verticalPadding;
  frame.paddingLeft = group.paddingLeft;
  frame.paddingRight = CELL_PADDING_X;
  frame.counterAxisAlignItems = "CENTER";
  frame.resize(groupWidth(group), frame.height);
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "AUTO";
  return frame;
}

function createRowFrame(layerName: string): FrameNode {
  const frame = figma.createFrame();
  frame.name = layerName;
  frame.layoutMode = "HORIZONTAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.fills = [];
  return frame;
}

function createHeader(): FrameNode {
  const header = figma.createFrame();
  header.name = "header";
  header.setPluginData(PD_TABLE_HEADER, HEADER_VERSION);
  header.layoutMode = "VERTICAL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "AUTO";
  header.fills = [];

  const bands = createRowFrame("group-bands");
  const columns = createRowFrame("columns");
  columns.fills = paint(COLORS.surface);
  header.appendChild(bands);
  header.appendChild(columns);

  for (const group of GROUPS) {
    const band = createGroupFrame(group, `band/${group.id}`, 6);
    band.fills = paint(group.tint);
    band.appendChild(createText(group.label.toUpperCase(), `band/${group.id}/label`, null, { font: FONT_BOLD, size: 10, color: group.color }));
    bands.appendChild(band);
    band.layoutAlign = "STRETCH";

    const head = createGroupFrame(group, `head/${group.id}`, CELL_PADDING_Y);
    if (group.id !== "icon") setLeftBorder(head);
    for (const col of group.columns) {
      head.appendChild(createText(col.header, `header/${col.key}`, col.width, { font: FONT_BOLD, size: 11, color: COLORS.sub }));
    }
    columns.appendChild(head);
    head.layoutAlign = "STRETCH";
  }
  return header;
}

/** Makes sure the header is current; an older header is replaced (it holds no designer content). */
function ensureTableHeader(container: FrameNode): boolean {
  const existing = container.children.find((n) => n.getPluginData(PD_TABLE_HEADER) !== "");
  if (existing && existing.getPluginData(PD_TABLE_HEADER) === HEADER_VERSION) return false;
  existing?.remove();
  container.insertChild(0, createHeader());
  return true;
}

function displayValue(fields: RowFields, key: FieldColumnKey): string {
  switch (key) {
    case "tags":
      return fields.tags.join(", ");
    case "aliases":
      return fields.aliases.join(", ");
    case "deprecatedInFavorOf":
      return fields.deprecatedInFavorOf ?? "";
    default:
      return fields[key];
  }
}

type CellTexts = Partial<Record<RowFieldKey, string>>;

function textsFromFields(fields: RowFields): CellTexts {
  const texts: CellTexts = {};
  for (const col of FIELD_COLUMNS) texts[col.key] = displayValue(fields, col.key);
  return texts;
}

/** A row with the icon cell left empty; `placeIconSet` fills it. */
function createRow(name: string, texts: CellTexts, syncText = ""): FrameNode {
  const row = createRowFrame(rowLayerName(name));
  row.setPluginData(PD_TABLE_ROW, name);
  setBottomBorder(row);

  for (const group of GROUPS) {
    const cells = createGroupFrame(group, group.id === "icon" ? ICON_CELL_LAYER : `${CELLS_PREFIX}${group.id}`, CELL_PADDING_Y);
    if (group.id !== "icon") setLeftBorder(cells);
    row.appendChild(cells);
    cells.layoutAlign = "STRETCH";

    for (const col of group.columns) {
      if (col.key === "icon") continue;
      if (col.key === "sync-status") {
        cells.appendChild(createText(syncText, SYNC_STATUS_LAYER, col.width, { color: COLORS.sub }));
        continue;
      }
      cells.appendChild(
        createText(texts[col.key] ?? "", fieldLayerName(col.key), col.width, { font: col.key === "name" ? FONT_MEDIUM : FONT_REGULAR })
      );
    }
  }
  return row;
}

function isRow(node: SceneNode): boolean {
  return node.type === "FRAME" && node.getPluginData(PD_TABLE_ROW) !== "";
}

function isAreaBand(node: SceneNode): boolean {
  return node.type === "FRAME" && node.getPluginData(PD_AREA_BAND) !== "";
}

function rowFrames(container: FrameNode): FrameNode[] {
  return container.children.filter((n): n is FrameNode => isRow(n) && n.type === "FRAME");
}

/** Text layers of a row, whether in a cell group (current layout) or directly in the row (older layouts). */
function rowTexts(row: FrameNode): TextNode[] {
  const out: TextNode[] = [];
  for (const child of row.children) {
    if (child.type === "TEXT") out.push(child);
    else if (child.type === "FRAME" && child.name.startsWith(CELLS_PREFIX)) {
      for (const inner of child.children) if (inner.type === "TEXT") out.push(inner);
    }
  }
  return out;
}

function textLayer(row: FrameNode, layerName: string): TextNode | null {
  return rowTexts(row).find((t) => t.name === layerName) ?? null;
}

/** The cell that holds the icon ComponentSet; created when an older row lacks it. */
export function iconCellOf(row: FrameNode): FrameNode {
  const existing = row.children.find((n): n is FrameNode => n.type === "FRAME" && n.name === ICON_CELL_LAYER);
  if (existing) return existing;
  const cell = createGroupFrame(GROUPS[0], ICON_CELL_LAYER, CELL_PADDING_Y);
  row.insertChild(0, cell);
  cell.layoutAlign = "STRETCH";
  return cell;
}

/** Moves the set into the row's icon cell (a no-op when it is already there). */
export function placeIconSet(row: FrameNode, set: ComponentSetNode): void {
  const cell = iconCellOf(row);
  if (set.parent !== cell) cell.appendChild(set);
  applyIconSetLayout(set);
}

function cleanAreaText(text: string): string {
  const trimmed = text.trim();
  return trimmed === EMPTY_PLACEHOLDER ? "" : trimmed.toLowerCase();
}

/** The band's label is the source of truth, so duplicating a band and retyping it starts a new area. */
function bandArea(band: FrameNode): string {
  const label = band.children.find((c): c is TextNode => c.type === "TEXT" && c.name === AREA_LABEL_LAYER);
  return label ? cleanAreaText(label.characters) : cleanAreaText(band.getPluginData(PD_AREA_BAND).slice(2));
}

function createAreaBand(area: string): FrameNode {
  const band = createRowFrame(`area/${area || "none"}`);
  band.setPluginData(PD_AREA_BAND, `a:${area}`);
  band.fills = paint(COLORS.areaBand);
  band.itemSpacing = 8;
  band.paddingTop = 8;
  band.paddingBottom = 8;
  band.paddingLeft = CELL_PADDING_X;
  band.paddingRight = CELL_PADDING_X;
  band.counterAxisAlignItems = "CENTER";
  band.appendChild(createText("\u25be", "area-chevron", null, { size: 11, color: COLORS.blue }));
  band.appendChild(createText(area, AREA_LABEL_LAYER, null, { font: FONT_SEMI_BOLD, color: COLORS.blue }));
  band.appendChild(createText("", AREA_COUNT_LAYER, null, { size: 11, color: COLORS.sub }));
  return band;
}

function setBandCount(band: FrameNode, count: number): void {
  const node = band.children.find((c): c is TextNode => c.type === "TEXT" && c.name === AREA_COUNT_LAYER);
  const text = `${count} icon${count === 1 ? "" : "s"}`;
  if (node && node.characters !== text) node.characters = text;
}

/** Area of each row (by id) = the band above it; rows above any band are absent from the map. */
function rowAreas(container: FrameNode): Map<string, string> {
  const areas = new Map<string, string>();
  let current: string | null = null;
  for (const child of container.children) {
    if (isAreaBand(child)) current = bandArea(child as FrameNode);
    else if (isRow(child) && current !== null) areas.set(child.id, current);
  }
  return areas;
}

/**
 * Normalises the table: bands sorted by area, each followed by its rows. Rows keep their current
 * order; rows named in `placements` (id → area) move to the end of that area. Empty bands are removed.
 */
function arrange(container: FrameNode, placements: ReadonlyMap<string, string>): void {
  const headers: SceneNode[] = [];
  const others: SceneNode[] = [];
  const bands = new Map<string, FrameNode>();
  const spareBands: FrameNode[] = [];
  const groups = new Map<string, FrameNode[]>();
  const moved: [FrameNode, string][] = [];
  const add = (area: string, row: FrameNode) => groups.set(area, [...(groups.get(area) ?? []), row]);

  let current = "";
  for (const child of container.children) {
    if (child.getPluginData(PD_TABLE_HEADER) !== "") headers.push(child);
    else if (isAreaBand(child)) {
      current = bandArea(child as FrameNode);
      if (bands.has(current)) spareBands.push(child as FrameNode);
      else bands.set(current, child as FrameNode);
    } else if (isRow(child)) {
      const target = placements.get(child.id);
      if (target !== undefined) moved.push([child as FrameNode, target]);
      else add(current, child as FrameNode);
    } else others.push(child);
  }
  for (const [row, area] of moved) add(area, row);

  const desired: SceneNode[] = [...headers];
  for (const area of [...groups.keys()].sort()) {
    let band = bands.get(area);
    if (!band) {
      band = createAreaBand(area);
      container.appendChild(band);
      band.layoutSizingHorizontal = "FILL";
    }
    const rows = groups.get(area)!;
    setBandCount(band, rows.length);
    desired.push(band, ...rows);
    bands.delete(area);
  }
  desired.push(...others);

  for (const unused of [...bands.values(), ...spareBands]) unused.remove();
  desired.forEach((node, index) => {
    if (container.children[index] !== node) container.insertChild(index, node);
  });
}

/** Creates a row for `fields` under its area band, with an empty icon cell. */
export async function addIconRow(container: FrameNode, fields: RowFields): Promise<FrameNode> {
  await ensureFontsLoaded();
  ensureTableHeader(container);
  const row = createRow(fields.name, textsFromFields(fields));
  container.appendChild(row);
  arrange(container, new Map([[row.id, fields.area]]));
  return row;
}

export interface TableMigration {
  headerRebuilt: boolean;
  /** Rows from an older layout, rebuilt in the current one with the designer's text kept. */
  rowsRebuilt: number;
  rowsRenamed: number;
  fieldsAdded: number;
  /** Icon sets that were outside the table and have been moved into their row. */
  setsMoved: number;
  /** Rows in the old layout that did not have the expected cells, so were left alone. */
  unrecognisedRows: string[];
}

/** A row from before cell groups: its texts sit directly in the row, or it has an `icon-variants` cell. */
function isOlderLayout(row: FrameNode): boolean {
  return row.children.some((n) => n.type === "TEXT" || n.name === "icon-variants");
}

function readOlderValues(row: FrameNode): { values: CellTexts; sync: string } | null {
  const texts = row.children.filter((n): n is TextNode => n.type === "TEXT");
  const values: CellTexts = {};
  let sync = "";
  if (texts.some((t) => parseFieldLayerName(t.name) !== null)) {
    for (const t of texts) {
      const key = parseFieldLayerName(t.name);
      if (key) values[key] = t.characters;
      else if (t.name === SYNC_STATUS_LAYER) sync = t.characters;
    }
    return { values, sync };
  }
  if (texts.length < LEGACY_FIELD_ORDER.length) return null;
  LEGACY_FIELD_ORDER.forEach((key, i) => {
    values[key] = texts[i].characters;
  });
  return { values, sync };
}

/**
 * Brings the table up to the current layout in place (designer edits are kept): rebuilds rows from
 * older layouts, groups rows under area bands, and moves each icon set into its row.
 */
export async function migrateTable(container: FrameNode): Promise<TableMigration> {
  await ensureFontsLoaded();
  const result: TableMigration = { headerRebuilt: false, rowsRebuilt: 0, rowsRenamed: 0, fieldsAdded: 0, setsMoved: 0, unrecognisedRows: [] };
  result.headerRebuilt = ensureTableHeader(container);

  const placements = new Map<string, string>();
  for (const frame of rowFrames(container)) {
    if (!isOlderLayout(frame)) continue;
    const older = readOlderValues(frame);
    if (!older) {
      result.unrecognisedRows.push(frame.getPluginData(PD_TABLE_ROW));
      continue;
    }
    const raw: RawRowFields = older.values;
    const name = parseRowFields(raw).name || frame.getPluginData(PD_TABLE_ROW);
    result.fieldsAdded += FIELD_KEYS.filter((k) => older.values[k] === undefined).length;

    const row = createRow(name, older.values, older.sync);
    container.appendChild(row);
    placements.set(row.id, parseRowFields(raw).area);
    frame.remove();
    result.rowsRebuilt++;
  }
  arrange(container, placements);

  for (const frame of rowFrames(container)) {
    const currentName = readRowName(frame);
    if (frame.name !== rowLayerName(currentName)) {
      frame.name = rowLayerName(currentName);
      result.rowsRenamed++;
    }
  }

  const setsByName = new Map(listIconComponentSets().map((s) => [s.name, s] as const));
  for (const frame of rowFrames(container)) {
    const cell = iconCellOf(frame);
    if (cell.children.some((c) => c.type === "COMPONENT_SET")) continue;
    const set = setsByName.get(readRowName(frame));
    if (!set || set.parent?.name === ICON_CELL_LAYER) continue;
    placeIconSet(frame, set);
    result.setsMoved++;
  }
  removeEmptyLegacyIconsContainer();
  return result;
}

function readRowName(row: FrameNode): string {
  const raw = textLayer(row, fieldLayerName("name"));
  return parseRowFields({ name: raw?.characters }).name || row.getPluginData(PD_TABLE_ROW);
}

function readRawFields(row: FrameNode): RawRowFields {
  const raw: RawRowFields = {};
  for (const text of rowTexts(row)) {
    const key = parseFieldLayerName(text.name);
    if (key) raw[key] = text.characters;
  }
  return raw;
}

/** Reads the designer-edited cells by layer name (never by position); `area` is the band the row sits under. */
function readRowFields(row: FrameNode, area: string | undefined): RowFields {
  const raw = readRawFields(row);
  if (area !== undefined) raw.area = area;
  return parseRowFields(raw);
}

export interface TableRow {
  frame: FrameNode;
  fields: RowFields;
}

/** Every row with its cells. A row whose name cell was cleared keeps the name it was created with. */
export function readTableRows(container: FrameNode): TableRow[] {
  const areas = rowAreas(container);
  return rowFrames(container).map((frame) => {
    const fields = readRowFields(frame, areas.get(frame.id));
    return { frame, fields: fields.name ? fields : { ...fields, name: frame.getPluginData(PD_TABLE_ROW) } };
  });
}

/** Overwrites the editable cells (used when the repo is the side that changed); a new area moves the row to that band. */
export async function writeRowFields(frame: FrameNode, fields: RowFields): Promise<void> {
  await ensureFontsLoaded();
  for (const col of FIELD_COLUMNS) {
    const node = textLayer(frame, fieldLayerName(col.key));
    if (!node) continue;
    const text = displayValue(fields, col.key);
    node.characters = text.length > 0 ? text : EMPTY_PLACEHOLDER;
  }
  if (fields.name) {
    frame.name = rowLayerName(fields.name);
    frame.setPluginData(PD_TABLE_ROW, fields.name);
  }
  const container = frame.parent;
  if (container?.type === "FRAME" && rowAreas(container).get(frame.id) !== fields.area) {
    arrange(container, new Map([[frame.id, fields.area]]));
  }
}

export async function writeSyncStatus(frame: FrameNode, text: string): Promise<void> {
  const node = textLayer(frame, SYNC_STATUS_LAYER);
  if (!node || node.characters === text) return;
  await ensureFontsLoaded();
  node.characters = text;
}

/** Creates a row for every icon ComponentSet that has none, prefilled with what is already known. Returns the names. */
export async function createMissingRows(container: FrameNode): Promise<string[]> {
  await ensureFontsLoaded();
  ensureTableHeader(container);
  const sets = listIconComponentSets();
  const rowNames = rowFrames(container).map(readRowName);
  const { setsWithoutRow } = joinRowsAndSets(rowNames, sets.map((s) => s.name));

  const placements = new Map<string, string>();
  const created: string[] = [];
  for (const name of setsWithoutRow) {
    const set = sets.find((s) => s.name === name)!;
    const fields = parseRowFields({ name, area: readSetArea(set), status: "active" });
    const row = createRow(name, textsFromFields(fields));
    container.appendChild(row);
    placeIconSet(row, set);
    placements.set(row.id, fields.area);
    created.push(name);
  }
  arrange(container, placements);
  removeEmptyLegacyIconsContainer();
  return created;
}

export interface TableScan {
  rows: { name: string; errors: string[] }[];
  blankNameRows: number;
  join: RowSetJoin;
}

/** Reads every row and joins it to the icon sets. `knownAreas` is null when the repo registry is unavailable. */
export function scanTable(container: FrameNode, knownAreas: readonly string[] | null): TableScan {
  const areas = rowAreas(container);
  const parsed = rowFrames(container).map((frame) => ({ frame, fields: readRowFields(frame, areas.get(frame.id)) }));
  const named = parsed.filter((r) => r.fields.name);
  const rows = named.map(({ fields }) => ({
    name: fields.name,
    errors: validateRowFields(fields, {
      knownAreas: knownAreas ?? [],
      allowNewArea: knownAreas === null,
      others: named.filter((o) => o.fields !== fields).map((o) => ({ name: o.fields.name, aliases: o.fields.aliases })),
    }),
  }));
  const join = joinRowsAndSets(
    named.map((r) => r.fields.name),
    listIconComponentSets().map((s) => s.name)
  );
  return { rows, blankNameRows: parsed.length - named.length, join };
}

export function formatTableScan(scan: TableScan, knownAreas: readonly string[] | null): string[] {
  const lines: string[] = [];
  const invalid = scan.rows.filter((r) => r.errors.length > 0);
  lines.push(`Table: ${scan.rows.length} rows, ${scan.rows.length - invalid.length} valid, ${invalid.length} invalid`);
  if (knownAreas === null) lines.push("  (repo areas unavailable, so area names were not checked)");
  if (scan.blankNameRows > 0) lines.push(`  ${scan.blankNameRows} row(s) have no name`);
  for (const row of invalid) for (const error of row.errors) lines.push(`  ${error}`);
  if (scan.join.setsWithoutRow.length > 0) lines.push(`  Sets without a row: ${scan.join.setsWithoutRow.join(", ")}`);
  if (scan.join.rowsWithoutSet.length > 0) lines.push(`  Rows without a set (draft): ${scan.join.rowsWithoutSet.join(", ")}`);
  if (scan.join.duplicateRows.length > 0) lines.push(`  Duplicate rows: ${scan.join.duplicateRows.join(", ")}`);
  if (scan.join.duplicateSets.length > 0) lines.push(`  Duplicate sets: ${scan.join.duplicateSets.join(", ")}`);
  return lines;
}
