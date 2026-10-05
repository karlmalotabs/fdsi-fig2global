# Naming Conventions

## Prefix
All icons use the `fdsi` prefix.

## File name pattern
```
fdsi-<use-case>-<size>-<style>.svg
```
- `use-case`: kebab-case, one or more words (e.g. `accessibility`, `chevron-down`).
- `size`: `sm` | `reg` | `lg` — each is distinct, optically-corrected artwork (not a CSS-scaled copy of another size).
- `style`: `outline` | `solid` | `color`.

Not every icon needs all 9 size/style combinations. An icon's `meta.json` lists only the variants that actually exist; consumers should fall back to the nearest available size/style.

## Size safeguard
Each size token maps to a fixed, non-negotiable pixel dimension — the canonical mapping lives in [`registry/schema/size-tokens.json`](../registry/schema/size-tokens.json):

| size token | px  |
|------------|-----|
| `sm`       | 16  |
| `reg`      | 24  |
| `lg`       | 48  |

Every SVG's `width`, `height`, and `viewBox` must match its size token's px value exactly. `node registry/scripts/build-registry.mjs` enforces this.

## Regex
```
^fdsi-[a-z0-9]+(-[a-z0-9]+)*-(sm|reg|lg)-(outline|solid|color)\.svg$
```

## Folder name
Each icon lives in its own folder named after the full prefixed slug (without size/style):
```
core/<area>/fdsi-<use-case>/
```
Every SVG filename inside that folder must start with the folder name, e.g. folder `fdsi-accessibility/` contains `fdsi-accessibility-sm-outline.svg`, `fdsi-accessibility-reg-solid.svg`, etc.

## Areas
Inside a brand (e.g. `core`), icons are grouped into top-level area folders by product domain: `global`, `bx`, `gx`, `sb`, `payments` (extensible — add new areas as needed, following the same rules).

## Name uniqueness (collision rule)
An icon's `name` (the `fdsi-<use-case>` slug) is its identity, scoped to the **brand**, not the area — area is just a filing detail. Consequences:
- Two folders in the same brand can never share a `name`, even across different areas.
- If two areas need "the same" icon, it lives in exactly **one** folder (prefer `global` for anything reusable); the other area's legacy name becomes an `aliases` entry there instead of a duplicate folder.
- If two areas need genuinely different icons that would otherwise want the same short slug, disambiguate the slug itself at creation time (e.g. `fdsi-transaction-search` vs `fdsi-search`) rather than relying on area to tell them apart.
- The same `name` appearing in `core` and in a future brand folder (e.g. `acme`) is **not** a collision — that's the intended override/fallback mechanism (see [multi-brand.md](./multi-brand.md)).

## Deprecation & aliases
- Renaming an icon: add the old name to the `aliases` array in its `meta.json` — this keeps it greppable for agent-driven bulk find/replace.
- Removing an icon in favor of another: keep an empty-variants folder with `status: "deprecated"` and `deprecatedInFavorOf: "<canonical-name>"` (see `core/global/fdsi-magnifier/meta.json` for an example) rather than deleting the folder outright.
