#!/usr/bin/env node
/**
 * FDSI Iconography Workbench — MCP Server (stdio, zero external dependencies)
 *
 * Works in BOTH modes:
 * 1. Self-Hosted / Live Server Mode: connects to WORKBENCH_URL (default http://127.0.0.1:4650)
 *    so every AI edit/comment immediately hot-reloads in the designer's browser via SSE.
 * 2. Offline Local Clone Fallback: if the HTTP server is not running locally, reads and writes
 *    `src/data/metadata.json` and `src/icons/<area>/<slug>.js` directly on disk.
 */
import fs from "node:fs";
import path from "node:path";
import {
  AREAS,
  ICONS_DIR,
  META_PATH,
  buildQueueResponse,
  findIconEntry,
  getAuthoringSkillMarkdown,
  latestOpenNote,
  mirrorToFig2Global,
  normalizeComments,
  readMetaCatalog,
  syncIconJsMetaBlock,
  validateIconSource,
} from "./src/engine/agent-tools.js";

const WORKBENCH_URL = (process.env.WORKBENCH_URL || "http://127.0.0.1:4650").replace(/\/+$/, "");

async function callWorkbenchApi(method, apiPath, body = null) {
  const res = await fetch(`${WORKBENCH_URL}${apiPath}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  return await res.json();
}

function saveCatalogOffline(catalog) {
  const txt = JSON.stringify(catalog, null, 2) + "\n";
  fs.writeFileSync(META_PATH, txt);
  mirrorToFig2Global("src/data/metadata.json", txt);
}

const TOOLS = [
  {
    name: "workbench_get_queue",
    description:
      "Start here. Lists icons in the FDSI Workbench queue filtered by stage (`todo`, `new`, `review`, `approved`, `attention`, or `all`), category (`common`, `sb`, `gx`, `payments`, `bx`), or missing governance fields (`crs`, `alias`). Returns every open designer comment (`openComments` and `reworkNote`) so you know what to fix.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["todo", "new", "review", "approved", "attention", "all"],
          description: "Queue stage filter. Default `todo` returns icons flagged for fixes/comments.",
        },
        area: {
          type: "string",
          enum: ["common", "sb", "gx", "payments", "bx"],
          description: "Optional domain filter.",
        },
        missing: {
          type: "string",
          enum: ["crs", "alias"],
          description: "Optional filter for icons missing CRS key or Old Alias.",
        },
      },
    },
  },
  {
    name: "workbench_get_icon",
    description:
      "Reads one icon from the Workbench: its full parametric `.js` ES module source code, metadata, all designer comments (`openComments` and `comments`), and compiled SVGs across `line`, `solid`, `duotone`, and `color`.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Icon slug, e.g. `football-soccer` or `home`.",
        },
        area: {
          type: "string",
          enum: ["common", "sb", "gx", "payments", "bx"],
          description: "Optional domain folder.",
        },
        id: {
          type: "string",
          description: "Optional internal icon id, e.g. `sb-football-soccer`.",
        },
      },
    },
  },
  {
    name: "workbench_get_skill",
    description:
      "Returns the FDSI Parametric Icon Authoring Skill: how `.js` icon modules are structured, all `primitives.js` helpers (`bloatPoly`, `bloatRect`, `facePoly`, `sectorFace`, `spanLine`, `edgeX`, `edgeY`, `circleToD`), and the Multi-Shape Padded Solid rules.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "workbench_validate_icon",
    description:
      "Compiles and validates candidate `.js` icon module source code in memory across all 4 styles (`line`, `solid`, `duotone`, `color`) and 2D XY Pad extremes (`Sharp`, `Soft Default`, `Plump`) before saving. Always run this before `workbench_submit_icon`.",
    inputSchema: {
      type: "object",
      required: ["source"],
      properties: {
        source: {
          type: "string",
          description: "Full ES module source code exporting default `{ id, slug, name, area, meta, build }`.",
        },
        area: {
          type: "string",
          enum: ["common", "sb", "gx", "payments", "bx"],
        },
        slug: {
          type: "string",
        },
      },
    },
  },
  {
    name: "workbench_submit_icon",
    description:
      "Saves an updated or newly created `.js` icon module to `src/icons/<area>/<slug>.js`, resolves open designer comments with your `summary`, moves `todo` icons to `review` (or `new` for newly created icons), and hot-reloads the Workbench UI via SSE.",
    inputSchema: {
      type: "object",
      required: ["area", "slug", "source", "summary"],
      properties: {
        area: {
          type: "string",
          enum: ["common", "sb", "gx", "payments", "bx"],
          description: "Domain folder (`common`, `sb`, `gx`, `payments`, `bx`).",
        },
        slug: {
          type: "string",
          description: "Kebab-case icon filename without `.js`, e.g. `football-soccer`.",
        },
        source: {
          type: "string",
          description: "Full validated ES module source code.",
        },
        summary: {
          type: "string",
          description: "One-sentence summary of what was fixed or created (recorded in the icon's comment thread).",
        },
        status: {
          type: "string",
          enum: ["new", "todo", "review", "approved"],
          description: "Optional explicit status override (defaults to `review` for updates or `new` for brand-new icons).",
        },
      },
    },
  },
  {
    name: "workbench_post_comment",
    description:
      "Posts a comment or question on an icon's thread, resolves existing comments, or updates its stage (`todo`, `review`, `approved`) / governance metadata (`name`, `crsKey`, `alias`, `description`, `tags`).",
    inputSchema: {
      type: "object",
      required: ["slug"],
      properties: {
        slug: { type: "string", description: "Icon slug, e.g. `football-soccer`." },
        area: { type: "string", enum: ["common", "sb", "gx", "payments", "bx"] },
        text: { type: "string", description: "Comment text to append to the icon's thread." },
        author: { type: "string", enum: ["ai", "designer"], description: "Defaults to `ai`." },
        moveToStage: { type: "string", enum: ["new", "todo", "review", "approved"] },
        resolveAll: { type: "boolean", description: "Mark all open comments on this icon as resolved." },
      },
    },
  },
  {
    name: "workbench_publish",
    description:
      "Runs the Skia PathKit + SVGO flattener to export all 928 flattened SVGs into `core/`, syncs `workbench/` `.js` files, rebuilds the registry + Storybook icons, and auto-commits to the `fdsi-fig2global` repository.",
    inputSchema: {
      type: "object",
      properties: {
        autoCommit: {
          type: "boolean",
          description: "Whether to automatically git commit and push in `fdsi-fig2global` (default true).",
        },
        commitMessage: {
          type: "string",
          description: "Optional git commit message.",
        },
      },
    },
  },
];

async function executeTool(name, args = {}) {
  switch (name) {
    case "workbench_get_queue": {
      const qs = new URLSearchParams();
      if (args.status) qs.set("status", args.status);
      if (args.area) qs.set("area", args.area);
      if (args.missing) qs.set("missing", args.missing);
      try {
        return await callWorkbenchApi("GET", `/api/queue?${qs.toString()}`);
      } catch {
        const catalog = readMetaCatalog();
        return { ok: true, mode: "offline-disk", ...buildQueueResponse(catalog, args) };
      }
    }

    case "workbench_get_icon": {
      const qs = new URLSearchParams();
      if (args.id) qs.set("id", args.id);
      if (args.slug) qs.set("slug", args.slug);
      if (args.area) qs.set("area", args.area);
      try {
        return await callWorkbenchApi("GET", `/api/icon?${qs.toString()}`);
      } catch {
        const catalog = readMetaCatalog();
        const found = findIconEntry(catalog, args);
        if (!found) return { ok: false, error: "Icon not found" };
        const { id: iconId, meta } = found;
        const filePath = path.join(ICONS_DIR, meta.area || "sb", `${meta.slug}.js`);
        const source = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
        const comments = normalizeComments(meta);
        const validation = source ? await validateIconSource(source, meta.area, meta.slug) : { svgs: {} };
        return {
          ok: true,
          mode: "offline-disk",
          id: iconId,
          slug: meta.slug,
          area: meta.area,
          path: `src/icons/${meta.area}/${meta.slug}.js`,
          meta,
          comments,
          openComments: comments.filter((c) => c.status !== "resolved"),
          source,
          svgs: validation.svgs || {},
        };
      }
    }

    case "workbench_get_skill": {
      return { ok: true, markdown: getAuthoringSkillMarkdown() };
    }

    case "workbench_validate_icon": {
      try {
        return await callWorkbenchApi("POST", "/api/validate-icon", args);
      } catch {
        return await validateIconSource(args.source, args.area || "sb", args.slug || "draft");
      }
    }

    case "workbench_submit_icon": {
      try {
        return await callWorkbenchApi("POST", "/api/submit-icon", args);
      } catch {
        const { area = "sb", slug, source, summary = "Updated icon geometry", status } = args;
        if (!AREAS.includes(area) || !slug || !/^[a-z0-9-]+$/.test(slug)) {
          return { ok: false, error: "Valid area and kebab-case slug are required." };
        }
        const validation = await validateIconSource(source, area, slug);
        if (!validation.ok) {
          return { ok: false, error: "Icon validation failed", issues: validation.issues };
        }
        const filePath = path.join(ICONS_DIR, area, `${slug}.js`);
        const isNewFile = !fs.existsSync(filePath);
        fs.writeFileSync(filePath, source);
        mirrorToFig2Global(`src/icons/${area}/${slug}.js`, source);

        const catalog = readMetaCatalog();
        const found = findIconEntry(catalog, { slug, area });
        const iconId = found?.id || validation.specMeta.id || `${area}-${slug}`;
        const curMeta = found?.meta || {
          id: iconId,
          slug,
          name: validation.specMeta.name || slug,
          area,
          alias: "",
          crsKey: "",
          description: validation.specMeta.desc || "",
          tags: [slug],
        };
        const comments = normalizeComments(curMeta);
        for (const c of comments) c.status = "resolved";
        if (summary) {
          comments.push({
            id: `c_${Date.now()}_ai`,
            author: "ai",
            text: String(summary).trim(),
            status: "resolved",
            createdAt: new Date().toISOString(),
          });
        }
        const nextStatus = status || (isNewFile ? "new" : "review");
        const nextMeta = {
          ...curMeta,
          id: iconId,
          slug,
          area,
          name: validation.specMeta.name || curMeta.name || slug,
          status: nextStatus,
          reworkNote: "",
          comments,
        };
        catalog[iconId] = nextMeta;
        saveCatalogOffline(catalog);
        syncIconJsMetaBlock(area, slug, nextMeta);
        return {
          ok: true,
          mode: "offline-disk",
          id: iconId,
          slug,
          area,
          status: nextStatus,
          path: `src/icons/${area}/${slug}.js`,
          entry: nextMeta,
        };
      }
    }

    case "workbench_post_comment": {
      try {
        return await callWorkbenchApi("POST", "/api/comments", { ...args, author: args.author || "ai" });
      } catch {
        const catalog = readMetaCatalog();
        const found = findIconEntry(catalog, args);
        if (!found) return { ok: false, error: "Icon not found" };
        const { id: iconId, meta } = found;
        const comments = normalizeComments(meta);
        if (args.resolveAll) {
          for (const c of comments) c.status = "resolved";
        }
        if (args.text && String(args.text).trim()) {
          const author = args.author || "ai";
          comments.push({
            id: `c_${Date.now()}`,
            author,
            text: String(args.text).trim(),
            status: author === "ai" ? "resolved" : "open",
            createdAt: new Date().toISOString(),
          });
        }
        const updated = {
          ...meta,
          status: args.moveToStage || meta.status || "approved",
          reworkNote: latestOpenNote(comments),
          comments,
        };
        catalog[iconId] = updated;
        saveCatalogOffline(catalog);
        syncIconJsMetaBlock(updated.area || "sb", updated.slug, updated);
        return { ok: true, mode: "offline-disk", id: iconId, entry: updated };
      }
    }

    case "workbench_publish": {
      return await callWorkbenchApi("POST", "/api/export-fig2global", args);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Dual-Framing JSON-RPC 2.0 stdio transport (supports both newline-delimited JSON and Content-Length headers)
let useContentLength = false;
function sendRpcResponse(msg) {
  const json = JSON.stringify(msg);
  if (useContentLength) {
    process.stdout.write(`Content-Length: ${Buffer.byteLength(json, "utf8")}\r\n\r\n${json}`);
  } else {
    process.stdout.write(`${json}\n`);
  }
}

async function handleRpcMessage(msg) {
  if (!msg || typeof msg !== "object") return;
  const { id, method, params } = msg;

  if (method === "initialize") {
    return sendRpcResponse({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: params?.protocolVersion || "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: "fdsi-workbench",
          version: "1.0.0",
        },
      },
    });
  }

  if (method === "notifications/initialized" || id === undefined) {
    return;
  }

  if (method === "ping") {
    return sendRpcResponse({ jsonrpc: "2.0", id, result: {} });
  }

  if (method === "tools/list") {
    return sendRpcResponse({
      jsonrpc: "2.0",
      id,
      result: { tools: TOOLS },
    });
  }

  if (method === "tools/call") {
    try {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      const out = await executeTool(toolName, toolArgs);
      const text = typeof out?.markdown === "string" && Object.keys(out).length === 2 ? out.markdown : JSON.stringify(out, null, 2);
      return sendRpcResponse({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text }],
          isError: out?.ok === false,
        },
      });
    } catch (err) {
      return sendRpcResponse({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify({ ok: false, error: err.message }) }],
          isError: true,
        },
      });
    }
  }

  return sendRpcResponse({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  });
}

let buffer = Buffer.alloc(0);
let rpcQueue = Promise.resolve();
function enqueueRpc(bodyStr) {
  let parsed;
  try {
    parsed = JSON.parse(bodyStr);
  } catch {
    return;
  }
  rpcQueue = rpcQueue.then(() => handleRpcMessage(parsed)).catch(() => {});
}

process.stdin.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  while (buffer.length > 0) {
    const str = buffer.toString("utf8");
    if (str.startsWith("Content-Length:")) {
      useContentLength = true;
      const headerEnd = buffer.indexOf("\r\n\r\n");
      if (headerEnd === -1) break;
      const header = buffer.subarray(0, headerEnd).toString("utf8");
      const m = /Content-Length:\s*(\d+)/i.exec(header);
      const len = m ? parseInt(m[1], 10) : 0;
      const totalLen = headerEnd + 4 + len;
      if (buffer.length < totalLen) break;
      const bodyStr = buffer.subarray(headerEnd + 4, totalLen).toString("utf8");
      buffer = buffer.subarray(totalLen);
      enqueueRpc(bodyStr);
    } else {
      const nlIdx = buffer.indexOf("\n");
      if (nlIdx === -1) break;
      const line = buffer.subarray(0, nlIdx).toString("utf8").trim();
      buffer = buffer.subarray(nlIdx + 1);
      if (!line) continue;
      enqueueRpc(line);
    }
  }
});
