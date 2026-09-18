export type IconSize = "sm" | "reg" | "lg";
export type IconStyle = "outline" | "solid" | "color";
export type IconStatus = "active" | "deprecated" | "draft";

export interface IconVariant {
  size: IconSize;
  style: IconStyle;
  file: string;
}

export interface IconFigmaMeta {
  nodeId: string | null;
  componentKey: string | null;
  lastSyncedHash: string | null;
  lastSyncedAt: string | null;
}

export interface IconMeta {
  name: string;
  prefix: "fdsi";
  brand: string;
  area: string;
  displayName?: string;
  description?: string;
  tags?: string[];
  aliases?: string[];
  status: IconStatus;
  deprecatedInFavorOf?: string | null;
  variants: IconVariant[];
  figma?: IconFigmaMeta;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PluginSettings {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  brand: string;
}

/** A variant fetched from GitHub or exported from Figma, paired with its raw SVG text. */
export interface VariantContent {
  size: IconSize;
  style: IconStyle;
  svg: string;
}

/** One file addition/modification/deletion staged for an atomic commit. */
export interface FileChange {
  path: string;
  content?: string;
  delete?: boolean;
}

export interface SyncPlanEntry {
  iconName: string;
  brand: string;
  area: string;
  action: "create" | "update" | "skip" | "rename";
  renamedFrom?: string;
  files: FileChange[];
  validationErrors: string[];
}
