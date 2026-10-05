# Generated Registry Files

Do not edit by hand. Regenerate with:

```
node registry/scripts/build-registry.mjs
```

The script reads every `<brand>/<area>/<icon>/meta.json`, validates it (name/folder match, variant files exist and are listed, SVG `width`/`height`/`viewBox` match the size token, alias and deprecation rules) and exits non-zero on any error. Output:

- `<area>.icons.json` per area for `core`, `<brand>.<area>.icons.json` for other brands
- `index.json` — brands/areas overview
- `aliases.index.json` — alias (and deprecated name) -> canonical icon
