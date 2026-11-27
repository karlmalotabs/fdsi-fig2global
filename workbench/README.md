# FDSI Iconography Workbench (UI + REST API + MCP Server)

The **FDSI Iconography Workbench** is a self-contained modular icon authoring dashboard, QA pipeline, and AI agent MCP server.

---

## 1. Running the Workbench UI (`http://localhost:4650`)

```bash
node workbench/server.mjs
```

- **Modular Parametric Icons:** `workbench/src/icons/{common,sb,gx,payments,bx}/<slug>.js` (`1 .js file per icon` for lock-free multi-agent editing).
- **Metadata & Comment Thread Store:** `workbench/src/data/metadata.json` (`status`, `reworkNote`, `comments[]`, `crsKey`, `alias`, `tags`).
- **Live SSE Hot-Reload:** Editing any `.js` icon file or posting a comment via MCP/API immediately refreshes the browser UI.

---

## 2. Connecting AI Agents (MCP Server — Local or Self-Hosted)

The repository includes a zero-dependency MCP server (`workbench/mcp.mjs`) configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "fdsi-workbench": {
      "command": "node",
      "args": ["workbench/mcp.mjs"],
      "env": {
        "WORKBENCH_URL": "http://127.0.0.1:4650"
      }
    }
  }
}
```

- **Self-Hosted Mode:** Point `WORKBENCH_URL` to your hosted Workbench instance (e.g. `https://fdsi-workbench.internal.example.com`). Designers leave comments and flag icons as **TODO** in the browser; the AI reads and resolves them remotely via MCP.
- **Local Clone Mode (with Offline Fallback):** Connects to `http://127.0.0.1:4650` when the local server is running (for instant browser SSE hot-reload), or automatically falls back to reading/writing `workbench/src/` on disk when the server is stopped.

### Available MCP Tools & Matching HTTP Endpoints

| MCP Tool | HTTP Endpoint | Description |
| :--- | :--- | :--- |
| `workbench_get_queue` | `GET /api/queue?status=todo` | Lists icons in `todo`, `new`, `review`, `approved`, or missing `crs`/`alias`, including all open designer comments (`openComments` & `reworkNote`). |
| `workbench_get_icon` | `GET /api/icon?slug=<slug>` | Returns the icon's parametric `.js` source, metadata, comment thread, and compiled SVGs (`line`, `solid`, `duotone`, `color`). |
| `workbench_get_skill` | `GET /api/skill` | Returns the FDSI Parametric Authoring Skill (`primitives.js` helpers + Multi-Shape Padded Solid rules). |
| `workbench_validate_icon` | `POST /api/validate-icon` | Compiles candidate `.js` source across all 4 styles & 2D XY Pad extremes (`Sharp`, `Soft Default`, `Plump`) before saving. |
| `workbench_submit_icon` | `POST /api/submit-icon` | Saves the `.js` module, marks open designer comments `"resolved"` with the AI's `summary`, moves `todo` $\rightarrow$ `review`, and hot-reloads the UI. |
| `workbench_post_comment` | `POST /api/comments` | Appends a comment, resolves open comments, or moves an icon between stages (`new`, `todo`, `review`, `approved`). |
| `workbench_publish` | `POST /api/export-fig2global` | Flattens all 232 icons (`928` SVGs) via Skia `PathKit` + `SVGO`, syncs `.js` files, rebuilds the registry, and auto-commits to git. |
