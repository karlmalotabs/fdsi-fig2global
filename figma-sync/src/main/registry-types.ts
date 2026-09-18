export interface RegistryIndexAreaEntry {
  area: string;
  iconCount: number;
  file: string | null;
}

export interface RegistryIndexBrandEntry {
  brand: string;
  areas: RegistryIndexAreaEntry[];
}

export interface RegistryIndex {
  generatedAt: string;
  brands: RegistryIndexBrandEntry[];
}

export interface AreaIndexIcon {
  name: string;
  path: string;
  status: "active" | "deprecated" | "draft";
  deprecatedInFavorOf: string | null;
  aliases: string[];
  variants: { size: string; style: string; file: string }[];
}

export interface AreaIndex {
  brand: string;
  area: string;
  generatedAt: string;
  icons: AreaIndexIcon[];
}
