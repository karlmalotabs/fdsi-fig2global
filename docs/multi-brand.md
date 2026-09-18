# Multi-Brand / Multi-Tenant Structure

`core` is the brand-agnostic, shared icon set. A future tenant/brand gets its own **sibling** top-level folder next to `core`, mirroring the exact same structure:
```
/core
  /global/fdsi-accessibility/...
/acme            (example future brand)
  /global/fdsi-accessibility/...   (brand-specific override or addition)
```

## Rules
- A brand folder mirrors `core`'s area layout (`global`, `bx`, `gx`, `sb`, `payments`, ...).
- A brand folder should only contain icons it **overrides or adds** — not a full duplicate of every core icon.
- Icon identity (`name`, i.e. the `fdsi-<use-case>` slug) stays the same across brands so consuming code can request an icon by name without knowing which brand supplied it.
- `meta.json`'s `brand` field records which brand a given icon folder belongs to.

## Resolution / fallback policy
When a consuming app resolves an icon for a given brand + size + style:
1. Look in the brand's own folder first.
2. If the icon or that specific variant is missing, fall back to `core`.
3. If still missing, fall back to the nearest available size/style per [naming-conventions.md](./naming-conventions.md).

This resolution logic is a future build/runtime concern — not implemented in this scaffold.
