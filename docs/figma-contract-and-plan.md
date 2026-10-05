# Figma library contract and sync plan

Status: proposal. Builds on the existing `figma-sync` plugin (see `figma-sync/README.md`). Goal: designers add and edit icons in Figma using a fixed structure, and the plugin detects what exists, checks its state, and syncs new or changed icons back to this repo.

## 1. Decisions

| # | Decision | Choice |
| --- | --- | --- |
| 1 | Write path | Direct commits to a sandbox repo/branch for now. Move to PRs later. Keep the write step behind one `commitChanges()` function so switching is a settings change, not a rewrite. |
| 2 | Where the sync base hash lives | Figma-side is authoritative; the repo records it only on push (details in section 4). |
| 3 | `area` | Explicit field on each row, validated against the repo's known areas. |
| 4 | Naming | Layer names are the designer's input; plugin data is the record of what was last synced. |

## 2. What exists today

- Each icon is a ComponentSet with `Size` (sm/reg/lg) and `Style` (outline/solid/color) variant properties.
- Identity is private plugin data on the set: `fdsiName`, `fdsiBrand`, `fdsiArea`, `fdsiLastSyncedHash`.
- `reconcile.ts` does a 3-way hash comparison and returns `in-sync`, `changed-in-figma`, `changed-in-repo`, `conflict`, `new-in-figma` or `new-in-repo`.
- `table.ts` writes one documentation row per icon, one way only. Text layers are unnamed and positional, so nothing can read them back.
- `push.ts` needs a selection and a mapping dialog. `displayName`, `description` and `tags` are copied from the existing `meta.json` or left empty.
- Hashing (`hashing.ts`) is FNV-1a over whitespace-normalised SVG, per icon.

Gaps this plan closes:

1. Designers cannot author metadata in Figma.
2. Row layers cannot be read back.
3. Push does not regenerate `registry/generated/*`, but Pull reads it, so Pull is stale after a push.
4. Every Pull writes `lastSyncedHash`/`lastSyncedAt` into `meta.json` (14 `record pulled icon sync state` commits are already on `origin/main`).
5. `reconcile` fetches each icon's files one at a time.
6. SVG round-trip differences (Figma re-exports differently from the source) can produce false "changed" results; the normaliser only collapses whitespace.

## 3. Structure contract

```
Page: Icons
 └ FDSI Icon Library              root frame (flagged in plugin data)
    └ FDSI Icon Table
       ├ header                   group bands (Icon, Identity, Content, Lifecycle, Sync) + column titles
       ├ area/<area>              band; its label is the area, rows below it belong to it
       ├ row/<icon-name>          one auto-layout frame per icon
       │  ├ cells/icon            holds the icon ComponentSet (variants spread by its own auto layout)
       │  ├ cells/identity        field/name, field/displayName
       │  ├ cells/content         field/description, field/tags, field/aliases
       │  ├ cells/lifecycle       field/status, field/deprecatedInFavorOf
       │  └ cells/sync            sync-status (plugin-owned, read-only)
       └ area/<next area> ...
```

Rules:

- The plugin finds containers by plugin-data flag, not by name, so renaming a frame does not break anything.
- The plugin reads rows by the `field/<key>` layer names, never by column position or nesting.
- The area is not a cell: a row's area is the band above it, so dragging a row under another band changes its area. Retyping a band's label (or duplicating a band and typing a new area) starts a new area.
- A row and a ComponentSet are joined on icon name (`field/name` = set name).
- Variants inside a set are Components named `Size=<sm|reg|lg>, Style=<outline|solid|color>`.

### Field rules (validated before any write)

| Field | Rule |
| --- | --- |
| `name` | `^fdsi-[a-z0-9]+(-[a-z0-9]+)*$`, unique per brand |
| `area` | Required; must be an area known to the repo (from `registry/generated/index.json`). A new area needs an explicit confirmation step. |
| `displayName` | Free text, required for new icons |
| `description` | Free text, optional |
| `tags` | Comma-separated, lowercase; stored as an array |
| `aliases` | Comma-separated; stored as an array. Legacy aliases may contain underscores (`fdsi-live_casino`), so use a looser pattern than `name`. |
| `status` | `active`, `deprecated` or `draft`. `deprecated` requires `deprecatedInFavorOf` to be an existing icon name (add an optional `field/deprecatedInFavorOf`). |
| variants | Size and style from the allowed enums; SVG must pass the existing `validateVariantSvgs` and the px check in `registry/schema/size-tokens.json` |

### Icon states

| State | Meaning |
| --- | --- |
| `draft` | Row exists, no artwork yet |
| `new-in-figma` | Artwork exists (with or without a row), not in the repo |
| `new-in-repo` | In the repo, not in Figma |
| `in-sync` | Neither side changed since the base |
| `changed-in-figma` / `changed-in-repo` | One side changed since the base |
| `conflict` | Both changed |
| `unknown` | Both sides exist, their content differs and no base is recorded, so the direction cannot be determined |
| `duplicate` | Two sets claim the same identity (copy-paste copies plugin data) |

Two conditions are flags on top of a state, not states of their own: a rename (the layer name differs from the recorded identity; the old name goes to `aliases`) and invalid (failed validation; blocks the write for that icon).

The plugin writes the current state into `sync-status` on each row. The state logic is `computeSyncState` in `figma-sync/src/main/contract.ts`.

## 4. Where the base hash lives

Sync needs to know, per side, whether content changed since the last sync.

**Measured in Figma (2026-10-05):** Figma's SVG export of a pulled icon never equals the repo file. For `fdsi-explore` the export has a different attribute order (`width height viewBox fill xmlns` instead of `xmlns width height fill viewBox`), and the committed `fdsi-live` shows what a Figma push does to the file: optimised paths with `fill="currentColor"` become long-coordinate paths with `fill="black"`, wrapped in a mask. Two consecutive exports of the same node were identical, so Figma compared with Figma is reliable. This means a single hash that Figma and the repo are both compared against cannot work: the current plugin records the repo's hash at Pull and then compares Figma's export against it, so Check status reports every pulled icon as changed in Figma.

**Model: two bases, each compared only with its own side.**

- `figmaBase`: hash of Figma's own export (plus row fields) at the last sync.
- `repoBase`: hash of the repo files (plus metadata) at the last sync.
- Changed in Figma = Figma's hash differs from `figmaBase`. Changed in repo = the repo's hash differs from `repoBase`. Both changed is a conflict. The two hashes are never compared with each other.

| Option for where the bases live | Problem |
| --- | --- |
| Repo only (today) | Every Pull must write back to stay clean, which produces the noise commits. After a repo-side edit, `changed-in-repo` stays true until Pull writes the new hash. `figmaBase` cannot live in the repo without a write after every Pull. |
| Figma only | No churn, and the bases move in step with the actor that syncs. Lost if the file is replaced or plugin data is wiped; then every icon is of unknown state. |
| **Figma authoritative, repo audit copy (chosen)** | See below. |

Rule:

1. **Both bases live Figma-side** as shared plugin data on the set, written after every Pull or Push. Pull never writes to the repo.
2. **Repo-side `lastSyncedHash` is written only on Push**, in a commit that already changes the icon's files. It is an audit and bootstrap value, not a live base.
3. **Bootstrap:** if either base is missing the state is `unknown`. The "adopt baseline" action is explicit; the plugin never guesses a direction. The repo's recorded `lastSyncedHash` cannot seed `repoBase`, because the repo-side hash is built from git blob ids (one tree listing, no file content): the SVG files and `meta.json` of the icon directory.
4. **One hash per side covers artwork and metadata:** `combineHashes(artworkHash, hashRowFields(fields))`. Reordering tags or aliases is not a change; any other field edit is.
5. Stable identifiers (`nodeId`, `componentKey`) stay in `meta.json`; they change rarely.
6. **Migration:** stored hashes from the current plugin are repo hashes, so existing sets start as `unknown` until the baseline is adopted once.

Use shared plugin data (`setSharedPluginData`) for the Figma-side record. It is also readable through the Figma REST API, which keeps a later server-side flow possible.

## 5. Sync flows

### Check (read-only)

1. Fetch the repo icon list in one call (git tree listing or the per-area index; avoid per-file requests).
2. Read the Figma sets and rows.
3. Join on name; compute states; show the result, with duplicates, renames and invalid items called out.

### Create missing rows (Figma only, never writes to the repo)

For each set without a row, create `row/<name>` with empty `field/*` layers for the designer to fill.

### Push to repo

1. Run the Check.
2. For each icon in `new-in-figma` or `changed-in-figma` and valid: export variants, build `meta.json` from the row fields, add the old name to `aliases` on rename.
3. Show a diff, then call `commitChanges()`.
4. Re-tag the Figma side with the new base hash.

### Pull from repo

Create or update sets, create missing rows, write the Figma-side base hash. No repo writes.

### Registry regeneration

CI runs `registry/scripts/build-registry.mjs` and fails if `registry/generated/*` differs from the committed output. Until a PR flow exists, run it in the same job that receives the plugin's commits, or list `core/**` through the git tree API instead of reading the generated index.

### Triggers

| Tier | Mechanism | Phase |
| --- | --- | --- |
| 1 | Manual `Scan` command | v1 |
| 2 | While the plugin is open: debounced `documentchange` shows a "N pending" banner; never auto-commits | Optional |
| 3 | Server side: Figma webhooks (`FILE_UPDATE`, `LIBRARY_PUBLISH`) to a relay that opens a PR | Later, needs a backend and a GitHub App |

The Plugin API cannot run in the background, so there is no way to react to a new row while the plugin is closed without tier 3.

## 6. Development plan

### Phase 0: Contract and tests (no UI changes)

- Commit this document and a short designer-facing version of section 3.
- Done: `figma-sync/src/main/contract.ts` (layer names, row parsing, field validation, hashing, state calculation) with 12 unit tests; run `cd figma-sync && npm test`.
- Still open: the row parser against real Figma nodes (it only handles the text content, so reading layers by name is phase 1).
- Done: hash round-trip measured in Figma with the plugin's "Hash check (selection)" button. Result: Figma's export never matches the repo file, but is stable against itself, so the two-base model in section 4 replaces the single hash. Stronger normalisation was not pursued because Figma also rewrites geometry and colours, not only attribute order.

Exit: contract agreed; round-trip behaviour known.

### Phase 1: Table v2

- Name every row layer per the contract; flag containers by plugin data.
- Add `sync-status` and the optional `field/deprecatedInFavorOf`.
- Add "create missing rows" and a row-to-set join.
- Migrate existing rows (they are unnamed): done in place instead of rebuilding, so designer edits survive. The old cell order is fixed, so the text layers are named by position once (`migrateTable` in `table.ts`); missing `field/deprecatedInFavorOf` and `sync-status` layers are added and the header is rebuilt.
- Done: buttons "Create missing rows" (migrates, then adds a row for every set without one) and "Read table" (reads rows by layer name, validates, joins to sets). Pull also migrates before adding rows. `sync-status` shows a placeholder until Phase 2.

Exit: a designer can add a row and fill fields; the plugin reads them.

### Phase 2: Scan and state

- Implement shared-plugin-data state (section 4), duplicate and rename detection, and the `unknown` bootstrap case.
- Replace per-file fetches in `reconcile` with a single listing plus per-area index.
- Show states in the UI and in `sync-status`.

Exit: Scan gives a correct, fast state for every icon.

Implemented (`scan.ts`, `repo-tree.ts`):

- Scan reads one git tree listing plus the registry indexes, joins sets, rows and repo icons, computes each state with the two bases, and writes it to the row's `sync-status` cell. A rename (layer name differs from the recorded name) turns `in-sync` into `changed-in-figma` and is shown in the row.
- Bases are shared plugin data (`fdsi/figmaBase`, `fdsi/repoBase`) on the set. Existing sets start `unknown`; "Adopt baseline" records the current state for those.
- Pull writes only icons that are new or changed in the repo, updates the row cells from `meta.json`, records both bases, and makes no commits. Anything changed in Figma, in conflict, unknown or duplicate is listed as "not touched".
- Push records both bases after its commit; post-publish moves only `repoBase` forward, and only for icons with no other repo change.
- `reconcile.ts` is replaced by Scan.

### Phase 3: Write-back (sandbox)

- Build `meta.json` from row fields; validate all fields; push through `commitChanges()` directly to the sandbox branch.
- Stop Pull from writing to the repo; write the base hash on Push only.
- CI job: regenerate and validate the registry.

Exit: adding a row plus artwork in Figma and pressing Push produces a valid commit and an updated registry.

Implemented (`push.ts`, `meta-build.ts`, `.github/workflows/registry.yml`):

- Push needs a table row for each selected set; without one the plan shows an error ("Create missing rows" first). The identity is the layer name; the area comes from the row (else the last pushed area, else the prompt).
- `meta.json` is built from the row by `buildIconMeta`: displayName, description, tags, aliases, status and deprecatedInFavorOf come from the row, while `version`, `createdAt` and `componentKey` are kept from the existing file. A rename adds the old name to `aliases`.
- Changing the area moves the folder: the old files are deleted in the same commit.
- Validation uses `validateRowFields` against the repo catalog (names and aliases of all other icons). A new area is blocked unless "Allow creating a new area" is ticked.
- The plan lists each changed metadata field (`describeMetaChanges`), so a wiped or mistyped cell is visible before the commit.
- After the commit: the sets are re-tagged, the row cells are rewritten to the committed values, and both baselines are recorded.
- CI regenerates `registry/generated/*` on pushes that touch `core/**`, fails on invalid metadata, and commits the result as `github-actions[bot]`. That commit touches no icon folder, so it does not change any repo hash.

### Phase 4: PR mode

- Implement `commitChanges()` as: create a branch, commit, open a PR with the diff summary in the body. Add a setting to choose direct or PR mode.
- Add a CI check on PRs (schema and naming validation, registry diff, round-trip hash test).

Exit: no direct commits to protected branches.

Implemented (`commit-changes.ts`, `scan.ts`, `.github/workflows/registry.yml`):

- Setting "Write mode": `direct` (default) or `pr`. `commitChanges()` is the only write step. In PR mode it creates `figma-sync/<utc timestamp>-<icon>`, commits the plan there, and opens a PR against the settings branch; the body lists each icon, its metadata changes and file counts.
- Baselines in PR mode: the repo has not changed yet, so nothing is recorded as `repoBase`. Each set stores `fdsi/pendingPr` = the PR number plus the Figma hash that went into it. Until the PR merges the icon stays `changed-in-figma` and Scan shows "PR #n open".
- Scan settles pending PRs: merged records `figmaBase` (from the PR) and `repoBase` (current repo hash); closed unmerged just forgets the PR, so the icon stays changed in Figma. A Figma edit made after the push still shows as changed.
- CI: on a PR touching `core/**` the same-repo case validates, regenerates the registry and commits it to the PR branch. Fork PRs are validated and must already contain a current registry. Branch protection and required reviews are repo settings, not part of the plugin.
- Not done: the round-trip hash test. Figma's export is not reproducible in CI (section 4), so CI cannot check it.

### Phase 5a: Plugin UI rework

Implemented (`src/ui/ui.html`, `src/ui/ui.ts`, `src/main/library.ts`, `src/main/code.ts`):

- The window is 560x720 with a drag handle to resize, and uses Figma's theme variables (`themeColors`) so light and dark follow the editor. Tabs: Library, Activity, Settings.
- Library: one row per icon from the last Scan (preview, name, area, status chip), filter chips (To push, To pull, Conflicts, Invalid, No baseline) and bulk selection. Clicking a row selects that set in Figma. Scan sends structured `items` (`LibraryItem`) plus a separate `previews` message with each set's default variant as SVG.
- Push is driven by status, not by the Figma selection: "Review push" builds the plan for the ticked icons (only `changed-in-figma` and `new-in-figma` are tickable), reading the live layer names and fresh table rows. "Pull N from repo" pulls everything `new-in-repo` or `changed-in-repo`.
- Review push: write-mode toggle (stored in settings), "Allow creating a new area" (rebuilds the plan), one card per icon with before/after for each changed field, and a file list. Any validation error disables the confirm button.
- Live banner: a debounced `nodechange` listener on the current page counts the icon sets and table rows touched since the last Scan and offers "Scan now". The plugin's own writes are ignored while it is busy. It never writes anything itself.
- Activity keeps the last 20 events for the session (PR links, scan summaries, errors). Create missing rows, Read table, Hash check and Post-publish sync moved to Settings under Maintenance. The UI scans once on open when the settings are complete.

### Table v3 (icon sets inside the rows)

Implemented (`table.ts`, `figma-nodes.ts`, `pull.ts`); typechecked and unit-tested, not yet run in Figma.

- Layout "Option E": column groups across the top, area bands, and the icon ComponentSet inside each row's icon cell. The set is 260px wide, horizontal auto layout, space-between, variants ordered by size then style.
- `migrateTable` runs on every Scan, Pull and "Create missing rows". It rebuilds rows from earlier layouts with the designer's text kept (the Area cell becomes the band), rebuilds the header, sorts bands by area and drops empty ones, and moves each set that sits outside the table into the row with the same name. The old "FDSI Icons" frame is removed once empty. Sets that are moved lose their old position on the canvas.
- Rows keep their order within a band; a row moved or created by the plugin goes to the end of its band.
- Pull creates a new set directly inside its row; an area change from the repo moves the row to the other band.

### Phase 5: Optional

- Webhook relay with a GitHub App (replaces the PAT in `clientStorage`).
- Per-variant hashing (today any variant change marks the whole icon changed).

## 7. Risks

- **Direct commits** are acceptable only in the sandbox; PR mode (phase 4) is required before this touches the production repo.
- **PAT in `clientStorage`** is an internal-v1 tradeoff already noted in the plugin README.
- **Figma re-serialises SVG**, so a Push replaces authored, optimised SVG with Figma's export (see section 4). `fdsi-live` already lost `currentColor` this way, so `fds-icon` renders it black regardless of `color`. The plugin now translates at the boundary (`figma-sync/src/main/svg-translate.ts`): on import `currentColor` becomes `black`, on push black fills and strokes (`black`, `#000`, `#000000`) become `currentColor`. Paints inside `<mask>` are never rewritten (luminance masks need literal black/white) and `color`-style icons are untouched. Still open: an SVG optimiser, and a CI check that `outline`/`solid` files contain no hard-coded colours.
- **Duplicate identities** from copy-paste are detected, not prevented.
- **Existing plugin README** says "not yet runtime-tested" although the remote history shows it has been run; update it when phase 0 is done.
