# Handoff and development plan: icon registry + `fds-icon`

Date: 2026-10-05. Companion to [icon-component-approaches.md](icon-component-approaches.md), which holds the comparison and rationale.

## 1. Where things stand

### Committed-scope work (in this repo, not yet committed)

| Path | What it is | State |
| --- | --- | --- |
| `registry/scripts/load-icons.mjs` | Reads `core/**/meta.json` + SVGs, validates, returns icon records | Working (7 icons, 5 areas) |
| `registry/scripts/build-registry.mjs` | Validates and regenerates `registry/generated/*` | Working |
| `registry/generated/*` | `index.json`, `<area>.icons.json`, `aliases.index.json` (replaces stale hand-authored samples; `bx.icons.json` removed because the area is empty) | Regenerated |
| `registry/schema/*`, `registry/generated/README.md`, `docs/naming-conventions.md`, `README.md` | Updated to match the generator | Done |
| `docs/icon-component-approaches.md` | Approach comparison and `meta.json` delivery options | Written |

Also modified in the working tree but not part of this effort: `figma-sync/*` changes. Review them separately before committing.

### Sandbox (`storybook/`, **gitignored**)

`.gitignore` excludes `storybook/` entirely, so none of this is in version control. It must be committed, moved, or shared before anyone else can work on it.

| Path | Purpose |
| --- | --- |
| `storybook/scripts/build-icons.mjs` | Generates `src/generated/icons.ts` from the registry (metadata only, no SVG markup) |
| `storybook/src/icons/types.ts`, `resolve.ts`, `search.ts` | Types; name/alias/deprecation/size/style/brand resolution; search across name, alias, area, tags, description |
| `storybook/src/icons/loader.ts`, `sanitize.ts` | Runtime fetch, LRU cache (200 entries), in-flight dedupe, DOMParser sanitizer |
| `storybook/src/components/fds-icon/` | Stencil component: `name`, `size`, `variant`, `brand`, `label`, `rotate`, `mirror`, `baseUrl`; colour via `currentColor` or `--fds-icon-color` |
| `storybook/src/components/fds-icon-explorer/` | Searchable grid component |
| `storybook/stories/FdsIcon.stories.ts`, `IconExplorer.stories.ts` | `Icons/FdsIcon` playground (text control plus clickable match list) and `Icons/Icon Explorer` |
| `storybook/.storybook/main.ts` | `staticDirs` serves `core/` at `/icons/core` so the default `baseUrl` (`/icons`) works |
| `storybook/.tmp/` | Leftover scratch check scripts; safe to delete |

Stack: Stencil 4.45.2 (`dist-custom-elements`, shadow DOM), Storybook 10.6.1 (`@storybook/web-components-vite`), lit 3.3.3, Node 22, npm 10.

### Verified

- Registry generator and validator run clean.
- `npm run build:components` and `npx storybook build` both succeed; `/icons/core/<area>/<icon>/*.svg` is present in the static output.
- The sanitizer was tested under jsdom with a real icon (kept `clip-path`) and hostile input (script, `foreignObject`, `on*` handlers and `javascript:` hrefs removed; non-SVG responses return an empty string).
- Resolution and search logic checked with Node scripts.

### Not verified / not built

- **No visual or browser check.** The browser tool is blocked for localhost in this environment; layout, colour, rotate/mirror and the dashed failure outline have never been seen rendered.
- No unit or interaction tests exist.
- SSR, `<title>` tooltip injection, a `color` token prop and `externalUrl` are not implemented.
- The slim runtime manifest and the full tooling index are not emitted yet; the component still embeds full records.

## 2. Decisions already made

- Hybrid design: our metadata resolver in front of a runtime SVG loader like `fdsp-icon`'s.
- Size scale stays `sm = 16`, `reg = 24`, `lg = 48`.
- `assets/` is temporary and ignored.
- The generator replaces the hand-maintained `registry/generated/*`.
- The S3 layout is not assumed; `baseUrl` plus a repo-relative path is the contract.

## 3. Decisions still needed

1. Production metadata: fetch a published `manifest.json` at runtime, or embed a slim manifest in the component?
2. S3/CDN layout: mirror the repo layout, or map paths in the publish job?
3. Versioning and caching: content-hashed or version-prefixed paths vs mutable "latest".
4. Colour variable name: `--fds-icon-color` or `--libfds-icon-color`.
5. Size names: keep sm/reg/lg, or provide a mapping from the existing component's sizes.
6. Whether SSR and `<title>` support are required for the first release.
7. Where the Storybook package lives long-term (it is gitignored today).

## 4. Development plan

Phases are ordered by dependency. The first three need no further decisions.

### Phase 1: Verify what exists

- Run `cd storybook && npm install && npm run storybook` and check each story in a real browser: sizes, variants, aliases (`fdsi-live_casino`), a deprecated name, a missing name, rotate and mirror, `--fds-icon-color`, the failure outline (point `baseUrl` at a bad path).
- Delete `storybook/.tmp/`.
- Decide where the Storybook package lives, then commit it (remove `storybook/` from `.gitignore` or move it).

Exit: stories render correctly and the sandbox is under version control.

### Phase 2: Tests

- Unit tests for `resolve.ts` (alias, deprecated redirect, size/style fallback, brand fallback, unknown name) and `search.ts`.
- Unit tests for `sanitize.ts` using the hostile cases already tried (jsdom), plus the `loader.ts` cache and dedupe behaviour with a mocked `fetch`.
- A CI step that runs `registry/scripts/build-registry.mjs` and fails when `registry/generated/*` differs from the committed output.

Exit: resolution and sanitization are covered; stale generated files cannot be merged.

### Phase 3: Registry output for production

- Extend `build-registry.mjs` (or add a sibling script) to emit:
  - `manifest.json`: slim runtime data (name, aliases, status, replacement, area, compact variants; paths derived by convention).
  - `icons.index.json`: full metadata for Storybook search.
- Add JSON schemas for both and validate in CI.
- Point `storybook/scripts/build-icons.mjs` at the generated files instead of re-reading `meta.json`.
- Optionally shard the manifest by area and add a name-to-area index (needed at roughly thousands of icons; see the scaling notes in the comparison doc).

Exit: one generator, two documented outputs, size measured against the real icon count.

### Phase 4: Runtime manifest loading (depends on decisions 1-3)

- If a published manifest is chosen: add a `manifest` loader (single fetch, cache, version check, failure behaviour) and make `resolve.ts` work from it. Otherwise embed the slim manifest.
- Add a `baseUrl` and brand-to-folder mapping for the real CDN/S3 layout.
- Add a publish step that uploads SVGs and `manifest.json` in the same CI job.

Exit: the component renders from the real bucket in a staging environment.

### Phase 5: Component hardening and parity

- Based on decision 6: SSR rendering, `<title>` for accessible names.
- Colour token prop or CSS variable alignment (decision 4).
- Size name mapping (decision 5) and a migration note for existing `fdsp-icon` users.
- Explorer: paginate or virtualize the grid and lazy-load tiles (a few hundred icons or more).
- Multi-colour icons: use CSS variables with fallback values (they pierce the shadow DOM); define the naming convention in `docs/naming-conventions.md`.

Exit: feature parity with the existing component where required.

### Phase 6: Docs and release

- Move the relevant parts of the comparison doc into `docs/` as final guidance (naming, contributing, adding an icon end to end).
- Document the publish pipeline and versioning.
- Package, version and release the component.

## 5. Commands

```bash
# Validate registry and regenerate registry/generated/*
node registry/scripts/build-registry.mjs

# Storybook sandbox
cd storybook
npm install
npm run icons              # regenerate src/generated/icons.ts
npm run build:components   # icons + stencil build
npm run storybook          # build components, then dev server on :6006
npm run build-storybook    # static build
```

## 6. Risks

- **Sandbox is untracked.** Everything under `storybook/` exists only on this machine until committed.
- **Unseen UI.** All rendering behaviour is unverified in a browser.
- **Metadata growth.** Embedding full metadata scales roughly linearly (about 550 B per icon today; more with more variants); do not ship it in production beyond a small library.
- **Registry/bucket drift.** If SVGs and `manifest.json` are published separately, they can fall out of sync; publish them in one job with matching versions.
- **Single-size inventory.** All 7 icons have only `reg`; fallback logic for `sm`/`lg` has been tested but not against real multi-size artwork.
