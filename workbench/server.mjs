#!/usr/bin/env node
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  AREAS,
  FIG2GLOBAL_ROOT,
  FIG2GLOBAL_WB,
  HISTORY_PATH,
  ICONS_DIR,
  META_PATH,
  SRC_DIR,
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

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STUDIO_ROOT = path.resolve(__dirname, "../..");
const PUBLIC_DIR = path.join(__dirname, "public");
const LEGACY_META_PATH = path.join(STUDIO_ROOT, "docs/styles/rounded-ui/fdsi-icons-metadata.json");
const PORT = Number(process.env.PORT || 4650);
const HOST = process.env.HOST || "127.0.0.1";

function computeHistoryPoint(catalog) {
  const entries = Object.values(catalog);
  const total = entries.length || 222;
  let approved = 0,
    crsMapped = 0,
    aliasMapped = 0,
    todo = 0,
    newCount = 0;
  for (const m of entries) {
    const st = m.status || "approved";
    if (st === "approved") approved++;
    else if (st === "todo") todo++;
    else if (st === "new") newCount++;
    if (m.crsKey && String(m.crsKey).trim()) crsMapped++;
    if (m.alias && String(m.alias).trim()) aliasMapped++;
  }
  return {
    at: new Date().toISOString(),
    total,
    approved,
    todo,
    newCount,
    crsMapped,
    aliasMapped,
  };
}

function readAndRecordHistory(catalog) {
  let history = [];
  try {
    if (fs.existsSync(HISTORY_PATH)) {
      history = JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8"));
    }
  } catch {}

  const cur = computeHistoryPoint(catalog);
  if (!Array.isArray(history) || history.length === 0) {
    // Seed with the actual historical progression of the library (34 base -> 62 hero -> 142 Wave 1 -> 222 Wave 2 -> current live state):
    history = [
      { label: "Initial", total: 222, approved: 34, crsMapped: 0, aliasMapped: 0 },
      { label: "Hero Pack", total: 222, approved: 62, crsMapped: 0, aliasMapped: 0 },
      { label: "Wave 1", total: 222, approved: 142, crsMapped: 0, aliasMapped: 0 },
      { label: "Wave 2", total: 222, approved: 222, crsMapped: 0, aliasMapped: 0 },
      cur,
    ];
    const txt = JSON.stringify(history, null, 2) + "\n";
    fs.writeFileSync(HISTORY_PATH, txt);
    mirrorToFig2Global("src/data/history.json", txt);
  } else {
    const last = history[history.length - 1];
    if (
      !last ||
      last.approved !== cur.approved ||
      last.crsMapped !== cur.crsMapped ||
      last.aliasMapped !== cur.aliasMapped ||
      last.todo !== cur.todo ||
      last.newCount !== cur.newCount
    ) {
      history.push(cur);
      if (history.length > 24) history = history.slice(-24);
      const txt = JSON.stringify(history, null, 2) + "\n";
      fs.writeFileSync(HISTORY_PATH, txt);
      mirrorToFig2Global("src/data/history.json", txt);
    }
  }
  return history;
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function writeMetaCatalog(catalog) {
  const jsonText = JSON.stringify(catalog, null, 2) + "\n";
  fs.writeFileSync(META_PATH, jsonText);
  mirrorToFig2Global("src/data/metadata.json", jsonText);
  // Also keep `docs/styles/rounded-ui/fdsi-icons-metadata.json` in sync:
  const out = {};
  for (const [id, m] of Object.entries(catalog)) {
    out[`fdsi-${m.slug}-reg`] = {
      id: `fdsi-${m.slug}-reg`,
      sourceId: id,
      tokens: {
        line: `fdsi-${m.slug}-reg-line`,
        solid: `fdsi-${m.slug}-reg-solid`,
        duotone: `fdsi-${m.slug}-reg-duotone`,
        color: `fdsi-${m.slug}-reg-color`,
      },
      alias: m.alias || "",
      crsKey: m.crsKey || "",
      description: m.description || "",
      area: m.area || "sb",
      tags: m.tags || [m.slug],
      status: m.status || "approved",
      ...(m.reworkNote ? { reworkNote: m.reworkNote } : {}),
      ...(Array.isArray(m.comments) && m.comments.length ? { comments: m.comments } : {}),
    };
  }
  try {
    fs.writeFileSync(LEGACY_META_PATH, JSON.stringify(out, null, 2) + "\n");
  } catch {}
}

function scanIconModules() {
  const modules = [];
  for (const area of AREAS) {
    const dir = path.join(ICONS_DIR, area);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".js")).sort()) {
      const slug = file.replace(/\.js$/, "");
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      modules.push({
        area,
        slug,
        url: `/src/icons/${area}/${file}?v=${Math.floor(stat.mtimeMs)}`,
        mtime: Math.floor(stat.mtimeMs),
      });
    }
  }
  return modules;
}

// SSE clients for live multi-agent hot-reload:
const sseClients = new Set();
function broadcastSse(event, payload) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(msg);
    } catch {
      sseClients.delete(res);
    }
  }
}

let watchTimer = null;
for (const area of AREAS) {
  const dir = path.join(ICONS_DIR, area);
  if (!fs.existsSync(dir)) continue;
  fs.watch(dir, (eventType, filename) => {
    if (!filename || !filename.endsWith(".js")) return;
    clearTimeout(watchTimer);
    watchTimer = setTimeout(() => {
      broadcastSse("icons-changed", { area, file: filename, at: Date.now() });
    }, 120);
  });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) reject(new Error("Payload too large"));
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }
  const urlObj = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  const pathname = urlObj.pathname;

  // 1. SSE endpoint for live file-watch & comment hot reload:
  if (req.method === "GET" && pathname === "/api/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    res.write(`event: connected\ndata: {"ok":true}\n\n`);
    sseClients.add(res);
    req.on("close", () => sseClients.delete(res));
    return;
  }

  // 2. GET /api/manifest -> list all discovered icon ES modules + disk metadata + real persisted history:
  if (req.method === "GET" && pathname === "/api/manifest") {
    const metadata = readMetaCatalog();
    return sendJson(res, 200, {
      modules: scanIconModules(),
      metadata,
      history: readAndRecordHistory(metadata),
    });
  }

  // 2B. GET /api/queue -> AI & UI attention queue (filter by status=todo|new|review|approved|attention|all, area, missing=crs|alias):
  if (req.method === "GET" && pathname === "/api/queue") {
    const status = urlObj.searchParams.get("status") || "todo";
    const area = urlObj.searchParams.get("area") || "";
    const missing = urlObj.searchParams.get("missing") || "";
    const catalog = readMetaCatalog();
    return sendJson(res, 200, {
      ok: true,
      ...buildQueueResponse(catalog, { status, area, missing }),
    });
  }

  // 2C. GET /api/icon -> Full icon inspection for AI agents (source, metadata, comments, compiled SVGs):
  if (req.method === "GET" && pathname === "/api/icon") {
    const id = urlObj.searchParams.get("id") || "";
    const slug = urlObj.searchParams.get("slug") || "";
    const area = urlObj.searchParams.get("area") || "";
    const catalog = readMetaCatalog();
    const found = findIconEntry(catalog, { id, slug, area });
    if (!found) {
      return sendJson(res, 404, { ok: false, error: "Icon not found" });
    }
    const { id: iconId, meta } = found;
    const filePath = path.join(ICONS_DIR, meta.area || "sb", `${meta.slug}.js`);
    const source = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
    const comments = normalizeComments(meta);
    const validation = source ? await validateIconSource(source, meta.area, meta.slug) : { ok: false, svgs: {} };
    return sendJson(res, 200, {
      ok: true,
      id: iconId,
      slug: meta.slug,
      area: meta.area,
      path: `src/icons/${meta.area}/${meta.slug}.js`,
      meta: {
        ...meta,
        comments,
        reworkNote: meta.reworkNote || latestOpenNote(comments) || "",
      },
      comments,
      openComments: comments.filter((c) => c.status !== "resolved"),
      source,
      svgs: validation.svgs || {},
    });
  }

  // 2D. GET /api/skill -> Self-contained FDSI Parametric Authoring Skill for AI agents:
  if (req.method === "GET" && pathname === "/api/skill") {
    return sendJson(res, 200, {
      ok: true,
      markdown: getAuthoringSkillMarkdown(),
    });
  }

  // 2E. POST /api/validate-icon -> Compile & test candidate .js icon source in memory before saving:
  if (req.method === "POST" && pathname === "/api/validate-icon") {
    try {
      const { source, area = "sb", slug = "draft" } = await readJsonBody(req);
      const resValidation = await validateIconSource(source, area, slug);
      return sendJson(res, 200, resValidation);
    } catch (e) {
      return sendJson(res, 400, { ok: false, issues: [e.message] });
    }
  }

  // 2F. POST /api/comments -> Add or resolve comments on an icon (syncs reworkNote + stage + SSE):
  if (req.method === "POST" && pathname === "/api/comments") {
    try {
      const { id, slug, area, author = "designer", text = "", moveToStage, resolveCommentId, resolveAll = false } =
        await readJsonBody(req);
      const catalog = readMetaCatalog();
      const found = findIconEntry(catalog, { id, slug, area });
      if (!found) {
        return sendJson(res, 404, { ok: false, error: "Icon not found" });
      }
      const { id: iconId, meta } = found;
      const comments = normalizeComments(meta);

      if (resolveAll) {
        for (const c of comments) c.status = "resolved";
      } else if (resolveCommentId) {
        for (const c of comments) {
          if (c.id === resolveCommentId) c.status = "resolved";
        }
      }

      let addedComment = null;
      if (text && String(text).trim()) {
        addedComment = {
          id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          author: author === "ai" ? "ai" : "designer",
          text: String(text).trim(),
          status: author === "ai" ? "resolved" : "open",
          createdAt: new Date().toISOString(),
        };
        comments.push(addedComment);
      }

      const nextStatus = moveToStage || meta.status || "approved";
      const nextReworkNote = latestOpenNote(comments);
      const updated = {
        ...meta,
        status: nextStatus,
        reworkNote: nextReworkNote,
        comments,
      };
      catalog[iconId] = updated;
      writeMetaCatalog(catalog);
      syncIconJsMetaBlock(updated.area || "sb", updated.slug, updated);
      const history = readAndRecordHistory(catalog);
      broadcastSse("icons-changed", { id: iconId, slug: updated.slug, area: updated.area, at: Date.now() });

      return sendJson(res, 200, {
        ok: true,
        id: iconId,
        entry: updated,
        addedComment,
        history,
      });
    } catch (e) {
      return sendJson(res, 400, { ok: false, error: e.message });
    }
  }

  // 2G. POST /api/submit-icon -> AI or developer submits updated/new .js icon module, resolves open comments, moves to review:
  if (req.method === "POST" && pathname === "/api/submit-icon") {
    try {
      const { id, slug, area = "sb", source, summary = "Updated icon geometry", status } = await readJsonBody(req);
      if (!AREAS.includes(area) || !slug || !/^[a-z0-9-]+$/.test(slug)) {
        return sendJson(res, 400, { ok: false, error: "Valid area and kebab-case slug are required." });
      }
      const validation = await validateIconSource(source, area, slug);
      if (!validation.ok) {
        return sendJson(res, 400, { ok: false, error: "Icon validation failed", issues: validation.issues });
      }

      const filePath = path.join(ICONS_DIR, area, `${slug}.js`);
      const isNewFile = !fs.existsSync(filePath);
      fs.writeFileSync(filePath, source);
      mirrorToFig2Global(`src/icons/${area}/${slug}.js`, source);

      const catalog = readMetaCatalog();
      const found = findIconEntry(catalog, { id, slug, area });
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
        status: isNewFile ? "new" : "review",
      };

      const comments = normalizeComments(curMeta);
      // Resolve open designer comments and record the AI's summary reply:
      for (const c of comments) {
        if (c.status !== "resolved") c.status = "resolved";
      }
      if (summary && String(summary).trim()) {
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
      writeMetaCatalog(catalog);
      syncIconJsMetaBlock(area, slug, nextMeta);
      const history = readAndRecordHistory(catalog);
      broadcastSse("icons-changed", { area, file: `${slug}.js`, id: iconId, at: Date.now() });

      return sendJson(res, 200, {
        ok: true,
        id: iconId,
        slug,
        area,
        status: nextStatus,
        path: `src/icons/${area}/${slug}.js`,
        entry: nextMeta,
        history,
      });
    } catch (e) {
      return sendJson(res, 400, { ok: false, error: e.message });
    }
  }

  // 3. POST /api/metadata -> update metadata on disk (both metadata.json and the icon's .js file):
  if (req.method === "POST" && pathname === "/api/metadata") {
    try {
      const { id, slug, area, patch } = await readJsonBody(req);
      const catalog = readMetaCatalog();
      const current = catalog[id] || { id, slug, area: area || "sb", alias: "", crsKey: "", description: "", tags: [slug] };
      const oldArea = current.area || area || "sb";
      const next = { ...current, ...patch };
      if (typeof next.tags === "string") {
        next.tags = next.tags
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
      }
      // Keep comments array and reworkNote synchronized when designer edits reworkNote directly:
      const comments = normalizeComments(current);
      if (typeof patch?.reworkNote === "string") {
        const trimmed = patch.reworkNote.trim();
        const openIdx = [...comments].reverse().findIndex((c) => c.status !== "resolved" && c.author !== "ai");
        if (trimmed) {
          if (openIdx !== -1) {
            const realIdx = comments.length - 1 - openIdx;
            comments[realIdx].text = trimmed;
          } else {
            comments.push({
              id: `c_${Date.now()}`,
              author: "designer",
              text: trimmed,
              status: "open",
              createdAt: new Date().toISOString(),
            });
          }
        }
        next.comments = comments;
      }
      catalog[id] = next;
      writeMetaCatalog(catalog);
      const history = readAndRecordHistory(catalog);

      // Also update `meta:` block inside `src/icons/<area>/<slug>.js` (and move file if `area` changed):
      const targetSlug = next.slug || slug;
      const oldFile = path.join(ICONS_DIR, oldArea, `${targetSlug}.js`);
      const newArea = AREAS.includes(next.area) ? next.area : oldArea;
      const newFile = path.join(ICONS_DIR, newArea, `${targetSlug}.js`);
      if (fs.existsSync(oldFile) && newFile !== oldFile) {
        fs.copyFileSync(oldFile, newFile);
        fs.rmSync(oldFile, { force: true });
        try {
          fs.rmSync(path.join(FIG2GLOBAL_WB, `src/icons/${oldArea}/${targetSlug}.js`), { force: true });
        } catch {}
      }
      syncIconJsMetaBlock(newArea, targetSlug, next);

      return sendJson(res, 200, { ok: true, entry: next, history });
    } catch (e) {
      return sendJson(res, 400, { ok: false, error: e.message });
    }
  }

  // 4. GET /api/icon-source & POST /api/icon-source -> read or live-edit an icon's ES module source code:
  if (req.method === "GET" && pathname === "/api/icon-source") {
    const area = urlObj.searchParams.get("area") || "";
    const slug = urlObj.searchParams.get("slug") || "";
    if (!AREAS.includes(area) || !/^[a-z0-9-]+$/.test(slug)) {
      return sendJson(res, 400, { ok: false, error: "Invalid area or slug" });
    }
    const filePath = path.join(ICONS_DIR, area, `${slug}.js`);
    if (!fs.existsSync(filePath)) {
      return sendJson(res, 404, { ok: false, error: "Icon file not found" });
    }
    return sendJson(res, 200, {
      ok: true,
      path: `apps/workbench/src/icons/${area}/${slug}.js`,
      absPath: filePath,
      source: fs.readFileSync(filePath, "utf8"),
    });
  }

  if (req.method === "POST" && pathname === "/api/icon-source") {
    try {
      const { area, slug, source } = await readJsonBody(req);
      if (!AREAS.includes(area) || !/^[a-z0-9-]+$/.test(slug) || typeof source !== "string") {
        return sendJson(res, 400, { ok: false, error: "Invalid area, slug, or source" });
      }
      const filePath = path.join(ICONS_DIR, area, `${slug}.js`);
      fs.writeFileSync(filePath, source);
      mirrorToFig2Global(`src/icons/${area}/${slug}.js`, source);
      broadcastSse("icons-changed", { area, file: `${slug}.js`, at: Date.now() });
      return sendJson(res, 200, { ok: true, path: `apps/workbench/src/icons/${area}/${slug}.js` });
    } catch (e) {
      return sendJson(res, 400, { ok: false, error: e.message });
    }
  }

  // 5. POST /api/export-fig2global -> run the Skia PathKit + SVGO flattener, rebuild registry & Storybook, and auto-commit:
  if (req.method === "POST" && pathname === "/api/export-fig2global") {
    try {
      const body = await readJsonBody(req).catch(() => ({}));
      const autoCommit = body.autoCommit !== false;
      const commitMessage =
        body.commitMessage || "chore(icons): export flattened SVGs, sync workbench .js modules, and rebuild registry";
      const exportScript = path.join(STUDIO_ROOT, "scripts/export-to-fig2global.mjs");
      const sbScript = path.join(FIG2GLOBAL_ROOT, "storybook/scripts/build-icons.mjs");

      const logs = [];
      if (fs.existsSync(exportScript)) {
        const { stdout } = await execFileAsync("node", [exportScript], { cwd: STUDIO_ROOT });
        logs.push(stdout.trim());
      } else {
        // Running standalone inside fdsi-fig2global/workbench: rebuild registry directly
        const regScript = path.join(FIG2GLOBAL_ROOT, "registry/scripts/load-icons.mjs");
        if (fs.existsSync(regScript)) {
          const { stdout } = await execFileAsync("node", [regScript], { cwd: FIG2GLOBAL_ROOT });
          logs.push(stdout.trim());
        }
      }

      if (fs.existsSync(sbScript)) {
        const { stdout } = await execFileAsync("node", [sbScript], { cwd: FIG2GLOBAL_ROOT });
        logs.push(stdout.trim());
      }

      let gitStatus = "skipped";
      if (autoCommit && fs.existsSync(path.join(FIG2GLOBAL_ROOT, ".git"))) {
        await execFileAsync("git", ["add", "core", "workbench", "registry", "storybook", "figma-sync"], {
          cwd: FIG2GLOBAL_ROOT,
        });
        const { stdout: diffOut } = await execFileAsync("git", ["status", "--porcelain"], {
          cwd: FIG2GLOBAL_ROOT,
        });
        if (diffOut.trim()) {
          await execFileAsync("git", ["commit", "-m", commitMessage], { cwd: FIG2GLOBAL_ROOT });
          gitStatus = "committed";
          try {
            await execFileAsync("git", ["push", "origin", "main"], { cwd: FIG2GLOBAL_ROOT, timeout: 15000 });
            gitStatus = "committed_and_pushed";
          } catch {
            gitStatus = "committed_local";
          }
          logs.push(`Git: ${gitStatus}`);
        } else {
          gitStatus = "clean_no_changes";
          logs.push("Git: working tree already clean");
        }
      }

      return sendJson(res, 200, {
        ok: true,
        gitStatus,
        output: logs.filter(Boolean).join("\n"),
      });
    } catch (err) {
      return sendJson(res, 500, {
        ok: false,
        error: err.stderr || err.message,
        stdout: err.stdout || "",
      });
    }
  }

  // 6. Serve static files from `/src/*` and `/public/*`:
  let filePath = null;
  if (pathname.startsWith("/src/")) {
    const rel = path.normalize(pathname.slice(5));
    if (!rel.startsWith("..")) filePath = path.join(SRC_DIR, rel);
  } else {
    const rel = pathname === "/" ? "index.html" : path.normalize(pathname.slice(1));
    if (!rel.startsWith("..")) filePath = path.join(PUBLIC_DIR, rel);
  }

  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath);
  res.writeHead(200, {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`\n✨ FDSI Icon Workbench Mini-App running at http://${HOST}:${PORT}`);
  console.log(`   • Modular icons: ${ICONS_DIR}/<area>/<slug>.js`);
  console.log(`   • Metadata JSON: ${META_PATH}`);
  console.log(`   • AI / MCP REST API: /api/queue, /api/icon, /api/skill, /api/validate-icon, /api/submit-icon, /api/comments`);
  console.log(`   • Live SSE watcher active for multi-agent edits!\n`);
});
