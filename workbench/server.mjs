#!/usr/bin/env node
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STUDIO_ROOT = path.resolve(__dirname, "../..");
const FIG2GLOBAL_WB = "/Users/kama10/Documents/fdsi_core_iconograpy_resources/workbench";
const PUBLIC_DIR = path.join(__dirname, "public");
const SRC_DIR = path.join(__dirname, "src");
const ICONS_DIR = path.join(SRC_DIR, "icons");
const META_PATH = path.join(SRC_DIR, "data/metadata.json");
const HISTORY_PATH = path.join(SRC_DIR, "data/history.json");
const LEGACY_META_PATH = path.join(STUDIO_ROOT, "docs/styles/rounded-ui/fdsi-icons-metadata.json");
const PORT = Number(process.env.PORT || 4650);
const AREAS = ["common", "sb", "gx", "payments", "bx"];

function mirrorToFig2Global(relPath, content) {
  try {
    const dest = path.join(FIG2GLOBAL_WB, relPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
  } catch {}
}

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

function readMetaCatalog() {
  try {
    return JSON.parse(fs.readFileSync(META_PATH, "utf8"));
  } catch {
    return {};
  }
}

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
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  const pathname = urlObj.pathname;

  // 1. SSE endpoint for live file-watch hot reload:
  if (req.method === "GET" && pathname === "/api/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
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
      catalog[id] = next;
      writeMetaCatalog(catalog);
      const history = readAndRecordHistory(catalog);

      // Also update `meta:` block inside `src/icons/<area>/<slug>.js` (and move file if `area` changed):
      const targetSlug = next.slug || slug;
      const oldFile = path.join(ICONS_DIR, oldArea, `${targetSlug}.js`);
      const newArea = AREAS.includes(next.area) ? next.area : oldArea;
      const newFile = path.join(ICONS_DIR, newArea, `${targetSlug}.js`);
      if (fs.existsSync(oldFile)) {
        let src = fs.readFileSync(oldFile, "utf8");
        const metaBlock = JSON.stringify(
          {
            slug: targetSlug,
            area: newArea,
            alias: next.alias || "",
            crsKey: next.crsKey || "",
            description: next.description || "",
            tags: next.tags || [targetSlug],
            ...(next.status ? { status: next.status } : {}),
            ...(next.reworkNote ? { reworkNote: next.reworkNote } : {}),
          },
          null,
          4
        ).replace(/\n/g, "\n  ");
        src = src.replace(/area:\s*"[^"]*"/, `area: ${JSON.stringify(newArea)}`);
        if (next.name) {
          src = src.replace(/name:\s*"[^"]*"/, `name: ${JSON.stringify(next.name)}`);
        }
        src = src.replace(/meta:\s*\{[\s\S]*?\},\n\s*build:/, `meta: ${metaBlock},\n  build:`);
        fs.writeFileSync(newFile, src);
        mirrorToFig2Global(`src/icons/${newArea}/${targetSlug}.js`, src);
        if (newFile !== oldFile) {
          fs.rmSync(oldFile, { force: true });
          try {
            fs.rmSync(path.join(FIG2GLOBAL_WB, `src/icons/${oldArea}/${targetSlug}.js`), { force: true });
          } catch {}
        }
      }

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

  // 5. POST /api/export-fig2global -> run the Skia PathKit + SVGO flattener & Storybook builder:
  if (req.method === "POST" && pathname === "/api/export-fig2global") {
    const exportScript = path.join(STUDIO_ROOT, "scripts/export-to-fig2global.mjs");
    const sbScript = "/Users/kama10/Documents/fdsi_core_iconograpy_resources/storybook/scripts/build-icons.mjs";
    execFile("node", [exportScript], { cwd: STUDIO_ROOT }, (err, stdout, stderr) => {
      if (err) {
        return sendJson(res, 500, { ok: false, error: stderr || err.message, stdout });
      }
      execFile("node", [sbScript], (err2, stdout2, stderr2) => {
        if (err2) {
          return sendJson(res, 500, { ok: false, error: stderr2 || err2.message, stdout: stdout + "\n" + stdout2 });
        }
        return sendJson(res, 200, {
          ok: true,
          output: (stdout + "\n" + stdout2).trim(),
        });
      });
    });
    return;
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

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n✨ FDSI Icon Workbench Mini-App running at http://localhost:${PORT}`);
  console.log(`   • Modular icons: ${ICONS_DIR}/<area>/<slug>.js`);
  console.log(`   • Metadata JSON: ${META_PATH}`);
  console.log(`   • Live SSE watcher active for multi-agent edits!\n`);
});
