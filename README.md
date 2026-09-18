# FDSI Icon Repository

Managed, multi-tenant SVG icon repository for the FDSI design system. Icons are stored with a semantic naming scheme (`fdsi-<use-case>-<size>-<style>.svg`) and described by a per-icon `meta.json`, so they can be consumed by apps, validated by tooling, and — eventually — kept in sync with a Figma component library.

## Structure
```
/core             brand-agnostic shared icons, grouped by area (global, bx, gx, sb, payments, ...)
/registry         JSON Schemas + generated (currently hand-authored sample) registry aggregates
/figma-sync       placeholder for the future bi-directional Figma sync tool
/docs             naming conventions, multi-brand policy, contribution guide
```

See [docs/naming-conventions.md](docs/naming-conventions.md), [docs/multi-brand.md](docs/multi-brand.md), and [docs/contributing.md](docs/contributing.md).

## Status
This is a structure-only scaffold: no build/validation scripts or Figma plugin exist yet. `/registry/generated/*` files are hand-authored samples showing the intended shape of future build output.
