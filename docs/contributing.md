# Contributing a New Icon

1. Choose a brand (`core` unless this is brand-exclusive) and an area (`global`, `bx`, `gx`, `sb`, `payments`, or a new one).
2. Create a folder: `<brand>/<area>/fdsi-<use-case>/`.
3. Add each available SVG variant, named `fdsi-<use-case>-<size>-<style>.svg` (see [naming-conventions.md](./naming-conventions.md)). You don't need all 9 size/style combinations — only add what's designed. Make sure each SVG's `width`/`height`/`viewBox` matches its size token's px value in [`registry/schema/size-tokens.json`](../registry/schema/size-tokens.json) (`sm`=16, `reg`=24, `lg`=48).
4. Add a `meta.json` in the same folder, following `/registry/schema/icon.meta.schema.json`. List every variant file you added.
5. If this icon replaces an older one, add the old name(s) to `aliases`. If you're retiring a folder entirely, leave a `status: "deprecated"` stub with `deprecatedInFavorOf` instead of deleting it (see `core/global/fdsi-magnifier/meta.json`).
6. Update the relevant sample file(s) under `/registry/generated/` by hand for now — an automated build script will replace this step in a future phase.

There's no automated validation yet; double-check your `meta.json` against the schema and the naming regex by eye before committing.
