import type { IconMeta } from "./types";
import { ICON_NAME_PATTERN, VARIANT_FILE_PATTERN, isValidAreaSlug } from "./naming";
import { validateSvgMatchesSizeToken } from "./svg-utils";

const STATUSES = ["active", "deprecated", "draft"];

/**
 * Hand-rolled equivalent of registry/schema/icon.meta.schema.json — kept in sync
 * manually since the plugin sandbox can't safely run a codegen-based validator (ajv).
 */
export function validateIconMeta(meta: IconMeta): string[] {
  const errors: string[] = [];

  if (!ICON_NAME_PATTERN.test(meta.name)) {
    errors.push(`name "${meta.name}" does not match ^fdsi-[a-z0-9]+(-[a-z0-9]+)*$`);
  }
  if (meta.prefix !== "fdsi") {
    errors.push(`prefix must be "fdsi", got "${meta.prefix}"`);
  }
  if (!meta.brand) errors.push("brand is required");
  if (!meta.area || !isValidAreaSlug(meta.area)) {
    errors.push(`area "${meta.area}" must be a kebab-case slug`);
  }
  if (!STATUSES.includes(meta.status)) {
    errors.push(`status must be one of ${STATUSES.join(", ")}`);
  }
  if (meta.status === "deprecated" && !meta.deprecatedInFavorOf) {
    errors.push("deprecatedInFavorOf is required when status is deprecated");
  }
  if (!Array.isArray(meta.variants)) {
    errors.push("variants must be an array");
  } else {
    for (const variant of meta.variants) {
      if (!VARIANT_FILE_PATTERN.test(variant.file)) {
        errors.push(`variant file "${variant.file}" does not match naming convention`);
      }
      if (!variant.file.startsWith(`${meta.name}-`)) {
        errors.push(`variant file "${variant.file}" does not start with icon name "${meta.name}"`);
      }
    }
  }

  return errors;
}

export function validateVariantSvgs(
  variants: { size: IconMeta["variants"][number]["size"]; svg: string }[]
): string[] {
  return variants.flatMap((v) => validateSvgMatchesSizeToken(v.svg, v.size));
}
