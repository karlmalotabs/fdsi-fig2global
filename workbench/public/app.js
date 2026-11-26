import { compileIcon } from "/src/engine/compiler.js";

const AREA_LABELS = {
  common: "Core",
  sb: "Sports",
  gx: "Casino",
  payments: "Payments",
  bx: "Brand",
};

const ICONS_UI = {
  flagTodo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
  sendReview: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`,
  approve: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  checkMorph: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
};

function flashCopied(el) {
  if (!el || el._copying) return;
  el._copying = true;
  const orig = el.innerHTML;
  el.classList.add("copied");
  el.innerHTML = ICONS_UI.checkMorph;
  setTimeout(() => {
    el.classList.remove("copied");
    el.innerHTML = orig;
    el._copying = false;
  }, 800);
}

const MODIFIER_BADGES = [
  {
    key: "none",
    label: "None (No Modifier)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" stroke-dasharray="3 2"/></svg>`,
  },
  {
    key: "check",
    label: "Check (Verified)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#1a7f37"/><path d="M8.5 12.2L11 14.7L15.8 9.3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    key: "plus",
    label: "Plus (Add)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#1a7f37"/><path d="M12 8v8M8 12h8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  },
  {
    key: "minus",
    label: "Minus (Remove)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#cf222e"/><path d="M8 12h8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  },
  {
    key: "blocked",
    label: "Blocked (Restricted)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#cf222e"/><path d="M8.5 8.5l7 7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  },
  {
    key: "info",
    label: "Info",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#0969da"/><path d="M12 11.5v4.5M12 8.2h.01" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  },
  {
    key: "pending",
    label: "Pending (Clock)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#0969da"/><path d="M12 7.8v4.4l2.8 1.8" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    key: "star",
    label: "Star (Featured)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24"><polygon points="12,3 14.8,8.8 21,9.7 16.5,14.1 17.6,20.3 12,17.3 6.4,20.3 7.5,14.1 3,9.7 9.2,8.8" fill="#d97706"/></svg>`,
  },
  {
    key: "sparkle",
    label: "Sparkle (New)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2Q13.4 10.6 22 12Q13.4 13.4 12 22Q10.6 13.4 2 12Q10.6 10.6 12 2Z" fill="#d97706"/></svg>`,
  },
  {
    key: "padlock",
    label: "Padlock (Locked)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2.5" fill="#0969da"/><path d="M8.5 11V8a3.5 3.5 0 017 0v3" fill="none" stroke="#0969da" stroke-width="2.2"/></svg>`,
  },
  {
    key: "flame",
    label: "Flame (Hot / Popular)",
    svg: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M6 16a6 6 0 0012 0c0-4-3-8-5-12-1 3-3 5-3 5s-1-2-2-3c-1 3-2 6-2 10z" fill="#f97316"/></svg>`,
  },
];

let allIcons = [];
let metaCatalog = {};
let historyLog = [];
let activeSection = "library";
let activeLibView = "cards";
let activeArea = "all";
let searchQuery = "";
let stageFilter = "all";
let govFilter = "all";
let inspectedItem = null;
let saveTimers = new Map();
const flippedCardIds = new Set();

// Engine token state (controlled by 2D XY Pad + Stroke Dots + Modifier Matrix)
const engineState = {
  styleMode: "round",
  s: 1.75,
  r: 2.0,
  b: 0.2,
  duoColor: "#0969da",
  mod: "none",
  showKeylines: false,
  isDark: false,
};

function showToast(msg, ms = 2400) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("show"), ms);
}

function getMeta(item) {
  const hasDiskEntry = Boolean(metaCatalog[item.id]);
  const m = metaCatalog[item.id] || item.meta || {};
  const slug = m.slug || item.slug;
  return {
    slug,
    area: m.area || item.area || "sb",
    alias: m.alias ?? "",
    crsKey: m.crsKey ?? "",
    description: m.description || item.desc || "",
    tags: Array.isArray(m.tags) ? m.tags : [slug],
    // Any brand-new icon file not yet in metadata.json defaults to `"new"` so it lands in Newly Generated!
    status: m.status || (hasDiskEntry ? "approved" : "new"),
    reworkNote: m.reworkNote || "",
  };
}

function cleanDisplayName(item) {
  const m = metaCatalog[item.id];
  const raw = (m && m.name) ? m.name : item.name;
  return raw.replace(/^#\d+\.\s*/, "").replace(/\s*\(.*?\)\s*$/, "").trim();
}

function fdsiName(item, style) {
  const { slug } = getMeta(item);
  const st = style === "line" ? "outline" : style;
  return `fdsi-${slug}-reg-${st}`;
}

async function loadAllIcons() {
  const res = await fetch("/api/manifest");
  const { modules, metadata, history } = await res.json();
  metaCatalog = metadata || {};
  historyLog = Array.isArray(history) ? history : [];

  const loaded = await Promise.all(
    modules.map(async (m) => {
      const mod = await import(m.url);
      const spec = mod.default;
      return { ...spec, _fileArea: m.area, _fileSlug: m.slug };
    })
  );

  loaded.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999) || a.slug.localeCompare(b.slug));
  allIcons = loaded;
  document.getElementById("liveStatusText").textContent = `${allIcons.length} Icons · Live`;

  if (!inspectedItem && allIcons.length > 0) {
    inspectedItem = allIcons[0];
  } else if (inspectedItem) {
    inspectedItem = allIcons.find((x) => x.id === inspectedItem.id || x.slug === inspectedItem.slug) || allIcons[0];
  }

  renderModifierGrids();
  renderAll();
  if (inspectedItem) populateInspector(inspectedItem, false);
}

function renderModifierGrids() {
  const html = MODIFIER_BADGES.map(
    (m) => `
    <button type="button" class="mod-swatch-btn ${m.key === engineState.mod ? "active" : ""}" data-mod-key="${m.key}" data-tip="${m.label}">
      ${m.svg}
    </button>
  `
  ).join("");
  document.getElementById("sidebarModGrid").innerHTML = html;
  document.getElementById("inspectorModGrid").innerHTML = html;
  document.getElementById("modActiveLabel").textContent = engineState.mod === "none" ? "None" : engineState.mod;
}

function matchesFilters(item) {
  const m = getMeta(item);
  if (activeArea !== "all" && m.area !== activeArea) return false;
  if (stageFilter !== "all" && m.status !== stageFilter) return false;
  if (govFilter === "missing-crs" && m.crsKey) return false;
  if (govFilter === "missing-alias" && m.alias) return false;
  if (govFilter === "mapped" && !m.crsKey) return false;

  if (searchQuery) {
    const hay = [
      item.id,
      item.name,
      m.slug,
      `fdsi-${m.slug}`,
      m.area,
      m.alias,
      m.crsKey,
      m.description,
      m.reworkNote,
      ...(m.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    const ok = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .every((tok) => hay.includes(tok));
    if (!ok) return false;
  }
  return true;
}

function updateStatsAndQueues() {
  const byArea = { common: 0, sb: 0, gx: 0, payments: 0, bx: 0 };
  let cntNew = 0,
    cntTodo = 0,
    cntReview = 0,
    cntApproved = 0,
    cntCrs = 0,
    cntAlias = 0;

  for (const it of allIcons) {
    const m = getMeta(it);
    byArea[m.area] = (byArea[m.area] || 0) + 1;
    if (m.status === "new") cntNew++;
    else if (m.status === "todo") cntTodo++;
    else if (m.status === "review") cntReview++;
    else cntApproved++;
    if (m.crsKey && m.crsKey.trim()) cntCrs++;
    if (m.alias && m.alias.trim()) cntAlias++;
  }

  const total = allIcons.length || 1;
  const noCrs = allIcons.length - cntCrs;
  const noAlias = allIcons.length - cntAlias;
  const pendingQa = cntNew + cntTodo + cntReview;
  const readyPct = ((cntApproved / total) * 100).toFixed(1).replace(/\.0$/, "") + "%";

  document.getElementById("cnt-all").textContent = allIcons.length;
  document.getElementById("cnt-core").textContent = byArea.common || 0;
  document.getElementById("cnt-gaming").textContent = byArea.sb || 0;
  document.getElementById("cnt-casino").textContent = byArea.gx || 0;
  document.getElementById("cnt-payments").textContent = byArea.payments || 0;
  document.getElementById("cnt-brand").textContent = byArea.bx || 0;

  // Option 1 Attention Queues Dock
  document.getElementById("qReadyPct").textContent = readyPct;
  document.getElementById("qSubLabel").textContent = pendingQa > 0 ? `${pendingQa} in QA pipeline` : `${allIcons.length} approved`;
  document.getElementById("qHeaderActive").textContent = pendingQa > 0 ? `${pendingQa} Active` : "All Clear";
  document.getElementById("qHeaderActive").style.color = cntTodo > 0 ? "var(--danger)" : "var(--success)";

  document.getElementById("qCntTodo").textContent = cntTodo;
  document.getElementById("qCntNew").textContent = cntNew;
  document.getElementById("qCntReview").textContent = cntReview;
  document.getElementById("qCntNoCrs").textContent = noCrs;
  document.getElementById("qCntNoAlias").textContent = noAlias;

  document.getElementById("qBtnTodo").setAttribute("data-tip", `Needs Fix / TODO (${cntTodo} icons)`);
  document.getElementById("qBtnNew").setAttribute("data-tip", `Newly Generated by Agent (${cntNew} icons)`);
  document.getElementById("qBtnReview").setAttribute("data-tip", `Ready for Review (${cntReview} icons)`);
  document.getElementById("qBtnNoCrs").setAttribute("data-tip", `Missing CRS Key (${noCrs} icons)`);
  document.getElementById("qBtnNoAlias").setAttribute("data-tip", `Missing Old Icon Alias (${noAlias} icons)`);

  // Render 100% Real-Data Persisted History Curve (Variant B):
  // Combines historical snapshots in `historyLog` with the live current snapshot (`cntApproved`, `cntCrs`, `cntAlias`)!
  const pts = [
    ...(historyLog.length > 1 ? historyLog.slice(0, -1) : []),
    { total: allIcons.length || 222, approved: cntApproved, crsMapped: cntCrs, aliasMapped: cntAlias },
  ];
  while (pts.length < 2) {
    pts.unshift({ total: allIcons.length || 222, approved: 34, crsMapped: 0, aliasMapped: 0 });
  }
  const W = 212,
    X0 = 6,
    Y_TOP = 6,
    Y_BOT = 44;
  const approvedCoords = pts.map((p, i) => {
    const x = +(X0 + (i / (pts.length - 1)) * (W - X0)).toFixed(1);
    const ratio = Math.max(0, Math.min(1, (p.approved || 0) / (p.total || total)));
    const y = +(Y_BOT - ratio * (Y_BOT - Y_TOP)).toFixed(1);
    return [x, y];
  });
  const mappedCoords = pts.map((p, i) => {
    const x = +(X0 + (i / (pts.length - 1)) * (W - X0)).toFixed(1);
    const mappedAvg = ((p.crsMapped || 0) + (p.aliasMapped || 0)) / 2;
    const ratio = Math.max(0, Math.min(1, mappedAvg / (p.total || total)));
    const y = +(Y_BOT - ratio * (Y_BOT - Y_TOP)).toFixed(1);
    return [x, y];
  });

  const polyAppStr = approvedCoords.map(([x, y]) => `${x},${y}`).join(" ");
  const polyMapStr = mappedCoords.map(([x, y]) => `${x},${y}`).join(" ");
  const areaAppStr =
    `M${approvedCoords[0][0]},${approvedCoords[0][1]} ` +
    approvedCoords
      .slice(1)
      .map(([x, y]) => `L${x},${y}`)
      .join(" ") +
    ` L${approvedCoords[approvedCoords.length - 1][0]},50 L${approvedCoords[0][0]},50 Z`;

  document.getElementById("qPolyApproved")?.setAttribute("points", polyAppStr);
  document.getElementById("qPolyMapped")?.setAttribute("points", polyMapStr);
  document.getElementById("qAreaApproved")?.setAttribute("d", areaAppStr);
  const lastApp = approvedCoords[approvedCoords.length - 1];
  const lastMap = mappedCoords[mappedCoords.length - 1];
  if (lastApp) {
    document.getElementById("qDotApproved")?.setAttribute("cx", String(lastApp[0]));
    document.getElementById("qDotApproved")?.setAttribute("cy", String(lastApp[1]));
  }
  if (lastMap) {
    document.getElementById("qDotMapped")?.setAttribute("cx", String(lastMap[0]));
    document.getElementById("qDotMapped")?.setAttribute("cy", String(lastMap[1]));
  }

  // Overview KPIs
  document.getElementById("kpiTotal").textContent = allIcons.length;
  document.getElementById("kpiQueueSummary").textContent = `${cntNew} New · ${cntTodo} Needs Fix`;
  const crsPct = Math.round((cntCrs / total) * 100);
  const aliasPct = Math.round((cntAlias / total) * 100);
  document.getElementById("kpiCrsPct").textContent = `${crsPct}%`;
  document.getElementById("kpiCrsCount").textContent = `${cntCrs} / ${allIcons.length}`;
  document.getElementById("kpiCrsBar").style.width = `${crsPct}%`;
  document.getElementById("kpiAliasPct").textContent = `${aliasPct}%`;
  document.getElementById("kpiAliasCount").textContent = `${cntAlias} / ${allIcons.length}`;
  document.getElementById("kpiAliasBar").style.width = `${aliasPct}%`;
}

function renderKanbanSection() {
  const cols = [
    { key: "new", title: "Newly Generated", dot: "new" },
    { key: "todo", title: "Needs Fix (TODO)", dot: "todo" },
    { key: "review", title: "Ready for Review", dot: "review" },
    { key: "approved", title: "Approved", dot: "approved" },
  ];

  const board = document.getElementById("kanbanBoard");
  board.innerHTML = cols
    .map((c) => {
      const list = allIcons.filter((it) => {
        const m = getMeta(it);
        if (m.status !== c.key) return false;
        if (activeArea !== "all" && m.area !== activeArea) return false;
        return true;
      });
      // Cap approved column at 40 in Kanban view for instant DOM speed while keeping full count in header
      const shown = c.key === "approved" ? list.slice(0, 40) : list;

      return `<div class="kanban-col">
        <div class="kanban-col-head">
          <span style="display:flex;align-items:center;gap:6px"><span class="status-dot-tag ${c.dot}"></span>${c.title}</span>
          <span class="count-pill">${list.length}</span>
        </div>
        ${
          shown.length === 0
            ? `<div style="padding:18px 8px;text-align:center;color:var(--text-muted);font-size:11.5px">No icons in ${c.title}</div>`
            : shown
                .map((item) => {
                  const m = getMeta(item);
                  const title = cleanDisplayName(item);
                  const isSel = inspectedItem && inspectedItem.id === item.id;
                  const svgL = compileIcon(item, "line", engineState, false);
                  const svgS = compileIcon(item, "solid", engineState, false);
                  const svgD = compileIcon(item, "duotone", engineState, false);
                  const svgC = compileIcon(item, "color", engineState, false);
                  return `<div class="kanban-card ${isSel ? "selected" : ""}" data-select-id="${item.id}">
                    <div class="kanban-card-top">
                      <strong style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${title}</strong>
                      <span class="area-pill area-${m.area}">${AREA_LABELS[m.area] || m.area}</span>
                    </div>
                    <div class="kanban-styles">
                      <span data-tip="${fdsiName(item, "line")}">${svgL}</span>
                      <span data-tip="${fdsiName(item, "solid")}">${svgS}</span>
                      <span data-tip="${fdsiName(item, "duotone")}">${svgD}</span>
                      <span data-tip="${fdsiName(item, "color")}">${svgC}</span>
                    </div>
                    ${m.reworkNote ? `<div class="rework-note">${m.reworkNote}</div>` : ""}
                    <div class="kanban-foot">
                      <span style="font-size:11px;color:var(--text-muted)">${m.crsKey || "No CRS key"}</span>
                      <div class="icon-actions-cluster">
                        ${
                          c.key !== "todo"
                            ? `<button type="button" class="icon-btn tone-danger" data-stage-id="${item.id}" data-next-stage="todo" data-tip="Flag for Fix (Move to TODO)">${ICONS_UI.flagTodo}</button>`
                            : ""
                        }
                        ${
                          c.key === "todo"
                            ? `<button type="button" class="icon-btn tone-warn" data-stage-id="${item.id}" data-next-stage="review" data-tip="Mark Fixed (Send to Review)">${ICONS_UI.sendReview}</button>`
                            : ""
                        }
                        ${
                          c.key !== "approved"
                            ? `<button type="button" class="icon-btn tone-ok" data-stage-id="${item.id}" data-next-stage="approved" data-tip="Approve Icon">${ICONS_UI.approve}</button>`
                            : ""
                        }
                      </div>
                    </div>
                  </div>`;
                })
                .join("")
        }
      </div>`;
    })
    .join("");
}

function renderLibrarySection() {
  const filtered = allIcons.filter(matchesFilters);
  const areaTitle = activeArea === "all" ? "All Categories" : AREA_LABELS[activeArea] || activeArea;
  document.getElementById("libHeading").textContent = areaTitle;
  const countPill = document.getElementById("libCountPill");
  if (countPill) {
    countPill.textContent = `${filtered.length}`;
    countPill.className = `area-pill area-${activeArea === "all" ? "common" : activeArea}`;
  }

  const root = document.getElementById("libraryContent");
  if (filtered.length === 0) {
    root.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">No icons match the current filter.</div>`;
    return;
  }

  if (activeLibView === "cards") {
    root.innerHTML =
      `<div class="cards-grid">` +
      filtered
        .map((item) => {
          const m = getMeta(item);
          const title = cleanDisplayName(item);
          const isSel = inspectedItem && inspectedItem.id === item.id;
          const isFlipped = flippedCardIds.has(item.id);
          const cardDark = isFlipped ? !engineState.isDark : engineState.isDark;
          const cardState = { ...engineState, isDark: cardDark };
          const stageClass = isFlipped ? (cardDark ? "force-dark" : "force-light") : "";
          const flipLabel = cardDark ? "☀ Light" : "☾ Dark";

          const svgL = compileIcon(item, "line", cardState, engineState.showKeylines);
          const svgS = compileIcon(item, "solid", cardState, engineState.showKeylines);
          const svgD = compileIcon(item, "duotone", cardState, engineState.showKeylines);
          const svgC = compileIcon(item, "color", cardState, engineState.showKeylines);
          const areaLabel = AREA_LABELS[m.area] || m.area;
          const crsLabel = m.crsKey ? `<b style="color:var(--success)">✓</b> ${m.crsKey}` : `No CRS key`;

          return `<div class="asset-card ${isSel ? "selected" : ""}" data-select-id="${item.id}">
            <div class="stage-3b ${stageClass}" data-stage-card="${item.id}">
              <button type="button" class="surface-flip-btn" data-flip-card="${item.id}">${flipLabel}</button>
              <span class="icon-slot" data-copy-svg="line" data-id="${item.id}" data-token="${fdsiName(item, "line")}" data-tip="Copy ${fdsiName(item, "line")}">${svgL}</span>
              <span class="icon-slot" data-copy-svg="solid" data-id="${item.id}" data-token="${fdsiName(item, "solid")}" data-tip="Copy ${fdsiName(item, "solid")}">${svgS}</span>
              <span class="icon-slot" data-copy-svg="duotone" data-id="${item.id}" data-token="${fdsiName(item, "duotone")}" data-tip="Copy ${fdsiName(item, "duotone")}">${svgD}</span>
              <span class="icon-slot" data-copy-svg="color" data-id="${item.id}" data-token="${fdsiName(item, "color")}" data-tip="Copy ${fdsiName(item, "color")}">${svgC}</span>
              <span class="stage-style-readout">fdsi-${m.slug}-reg</span>
            </div>
            <div class="d3-foot">
              <div style="min-width:0">
                <div style="font-weight:600;font-size:12.5px;display:flex;align-items:center;gap:6px">
                  <span class="status-dot-tag ${m.status}" data-tip="Stage: ${m.status}"></span>
                  <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${title}</span>
                </div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:1px">${areaLabel} · ${crsLabel}</div>
              </div>
              <div class="d3-actions">
                <button type="button" class="icon-btn" data-copy-svg="line" data-id="${item.id}" data-tip="Copy Outline SVG">${ICONS_UI.copy}</button>
                <button type="button" class="icon-btn" data-open-code="${item.id}" data-tip="Edit Vector JS">${ICONS_UI.code}</button>
                <button type="button" class="icon-btn tone-danger" data-stage-id="${item.id}" data-next-stage="todo" data-tip="Flag for Fix (Move to TODO)">${ICONS_UI.flagTodo}</button>
              </div>
            </div>
          </div>`;
        })
        .join("") +
      `</div>`;
  } else {
    root.innerHTML = `<div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Preview (4 Styles)</th>
            <th>Icon Name</th>
            <th>Category</th>
            <th>Old Icon Name (Alias)</th>
            <th>CRS Key</th>
            <th style="text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map((item) => {
              const m = getMeta(item);
              const title = cleanDisplayName(item);
              const isSel = inspectedItem && inspectedItem.id === item.id;
              const safeAlias = (m.alias || "").replace(/"/g, "&quot;");
              const safeCrs = (m.crsKey || "").replace(/"/g, "&quot;");
              return `<tr class="${isSel ? "selected" : ""}" data-select-id="${item.id}">
                <td>
                  <div style="display:inline-flex;gap:8px;align-items:center">
                    <span style="width:22px;height:22px;display:inline-flex" data-tip="${fdsiName(item, "line")}">${compileIcon(item, "line", engineState, false)}</span>
                    <span style="width:22px;height:22px;display:inline-flex" data-tip="${fdsiName(item, "solid")}">${compileIcon(item, "solid", engineState, false)}</span>
                    <span style="width:22px;height:22px;display:inline-flex" data-tip="${fdsiName(item, "duotone")}">${compileIcon(item, "duotone", engineState, false)}</span>
                    <span style="width:22px;height:22px;display:inline-flex" data-tip="${fdsiName(item, "color")}">${compileIcon(item, "color", engineState, false)}</span>
                  </div>
                </td>
                <td>
                  <div style="display:flex;align-items:center;gap:6px">
                    <span class="status-dot-tag ${m.status}" data-tip="Stage: ${m.status}"></span>
                    <input class="table-input" style="font-weight:600" value="${title.replace(/"/g, "&quot;")}" data-meta-id="${item.id}" data-meta-field="name" placeholder="Icon title…" />
                  </div>
                </td>
                <td><span class="area-pill area-${m.area}">${AREA_LABELS[m.area] || m.area}</span></td>
                <td><input class="table-input" value="${safeAlias}" data-meta-id="${item.id}" data-meta-field="alias" placeholder="Enter old icon name…" /></td>
                <td><input class="table-input" value="${safeCrs}" data-meta-id="${item.id}" data-meta-field="crsKey" placeholder="Enter CRS key…" /></td>
                <td style="text-align:right">
                  <div class="icon-actions-cluster" style="justify-content:flex-end">
                    <button type="button" class="icon-btn" data-copy-svg="line" data-id="${item.id}" data-tip="Copy SVG">${ICONS_UI.copy}</button>
                    <button type="button" class="icon-btn" data-open-code="${item.id}" data-tip="Edit Vector JS">${ICONS_UI.code}</button>
                    <button type="button" class="icon-btn tone-danger" data-stage-id="${item.id}" data-next-stage="todo" data-tip="Flag for Fix (Move to TODO)">${ICONS_UI.flagTodo}</button>
                  </div>
                </td>
              </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`;
  }
}

function renderOverviewSection() {
  for (const [mode, elId] of [
    ["line", "ovStripOutline"],
    ["solid", "ovStripSolid"],
    ["duotone", "ovStripDuotone"],
    ["color", "ovStripColor"],
  ]) {
    document.getElementById(elId).innerHTML = allIcons
      .map((it) => {
        const token = fdsiName(it, mode);
        return `<span data-select-id="${it.id}" data-tip="${token}">${compileIcon(it, mode, engineState, false)}</span>`;
      })
      .join("");
  }
}

function renderAll() {
  updateStatsAndQueues();
  if (activeSection === "pipeline") renderKanbanSection();
  else if (activeSection === "library") renderLibrarySection();
  else if (activeSection === "overview") renderOverviewSection();
  if (inspectedItem) renderInspectorStages(inspectedItem);
}

function renderInspectorStages(item) {
  const m = getMeta(item);
  const lightState = { ...engineState, isDark: false };
  const darkState = { ...engineState, isDark: true };
  document.getElementById("inspLightSvg").innerHTML = compileIcon(item, "color", lightState, engineState.showKeylines);
  document.getElementById("inspDarkSvg").innerHTML = compileIcon(item, "color", darkState, engineState.showKeylines);

  document.getElementById("miniCopyLine").innerHTML = compileIcon(item, "line", engineState, engineState.showKeylines);
  document.getElementById("miniCopySolid").innerHTML = compileIcon(item, "solid", engineState, engineState.showKeylines);
  document.getElementById("miniCopyDuotone").innerHTML = compileIcon(item, "duotone", engineState, engineState.showKeylines);
  document.getElementById("miniCopyColor").innerHTML = compileIcon(item, "color", engineState, engineState.showKeylines);

  document.querySelectorAll("#inspStageCluster [data-set-stage]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.setStage === m.status);
  });
}

async function populateInspector(item, loadSource = true) {
  inspectedItem = item;
  const m = getMeta(item);
  document.getElementById("inspTitle").textContent = cleanDisplayName(item);
  document.getElementById("inspNameInput").value = cleanDisplayName(item);
  const pill = document.getElementById("inspAreaPill");
  pill.className = `area-pill area-${m.area}`;
  pill.textContent = AREA_LABELS[m.area] || m.area;

  document.getElementById("inspReworkNote").value = m.reworkNote || "";
  document.getElementById("inspArea").value = m.area;
  document.getElementById("inspDesc").value = m.description || "";
  document.getElementById("inspTags").value = (m.tags || []).join(", ");
  document.getElementById("inspCrsKey").value = m.crsKey || "";
  document.getElementById("inspAlias").value = m.alias || "";
  document.getElementById("inspTokenId").value = `fdsi-${m.slug}-reg`;

  renderInspectorStages(item);

  if (loadSource || document.getElementById("devCodeDetails").open) {
    const res = await fetch(
      `/api/icon-source?area=${encodeURIComponent(item._fileArea || m.area)}&slug=${encodeURIComponent(m.slug)}`
    );
    const data = await res.json();
    document.getElementById("inspCode").value = data.ok ? data.source : `// Error loading source: ${data.error}`;
  }
}

function scheduleMetaSave(id, patch, immediateRender = false) {
  const item = allIcons.find((x) => x.id === id);
  if (!item) return;
  const cur = getMeta(item);
  const nextName = patch.name ?? metaCatalog[id]?.name ?? item.name;
  item.name = nextName;
  metaCatalog[id] = { ...cur, ...patch, id, name: nextName, order: item.order };

  if (immediateRender) {
    renderAll();
    if (inspectedItem && inspectedItem.id === id) populateInspector(item, false);
  } else {
    updateStatsAndQueues();
  }

  clearTimeout(saveTimers.get(id));
  saveTimers.set(
    id,
    setTimeout(async () => {
      const res = await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          slug: cur.slug,
          area: cur.area,
          patch: metaCatalog[id],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.history)) {
          historyLog = data.history;
          updateStatsAndQueues();
        }
        showToast(`✓ Saved changes for ${cleanDisplayName(item)}`, 1400);
      }
    }, 280)
  );
}

function switchSection(sec) {
  activeSection = sec;
  document.querySelectorAll(".section-page").forEach((p) => p.classList.remove("active"));
  document.getElementById(`sec-${sec}`).classList.add("active");
  const order = ["pipeline", "library", "overview"];
  const idx = Math.max(0, order.indexOf(sec));
  const thumb = document.getElementById("wsThumb");
  if (thumb) thumb.style.transform = `translateX(${idx * 100}%)`;
  document.querySelectorAll(".ws-pill-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.ws === sec);
  });
  renderAll();
}

// 2D XY Shape Character Pad Interaction with Magnetic Preset Snap
function setPadValues(nx, ny, rVal, bVal, snappedLabel = null) {
  engineState.r = +rVal.toFixed(2);
  engineState.b = +bVal.toFixed(2);
  engineState.styleMode = engineState.r < 0.15 ? "angular" : "round";

  const puck = document.getElementById("xyPuck");
  puck.style.left = `${nx * 100}%`;
  puck.style.top = `${ny * 100}%`;
  document.getElementById("readoutR").innerHTML = `Roundness: <b style="color:var(--text-main)">${engineState.r.toFixed(1)}px</b>`;
  document.getElementById("readoutB").innerHTML = `Bloat: <b style="color:var(--text-main)">${engineState.b.toFixed(2)}</b>`;
  document.getElementById("puckSquircle").setAttribute("rx", String(Math.max(0.5, engineState.r * 2.2)));

  const snapToast = document.getElementById("xySnapToast");
  if (snapToast) {
    if (snappedLabel) {
      snapToast.textContent = `★ ${snappedLabel}`;
      snapToast.classList.add("show");
    } else {
      snapToast.classList.remove("show");
    }
  }
  renderAll();
}

function handlePadPointer(e) {
  const pad = document.getElementById("xyPad");
  const rect = pad.getBoundingClientRect();
  let nx = Math.max(0.04, Math.min(0.96, (e.clientX - rect.left) / rect.width));
  let ny = Math.max(0.06, Math.min(0.94, (e.clientY - rect.top) / rect.height));
  let rVal = nx * 3.0;
  let bVal = (1 - ny) * 0.45;
  let snappedLabel = null;

  document.querySelectorAll("#xyPad .xy-anchor").forEach((a) => {
    a.classList.remove("snapped");
    const ax = parseFloat(a.dataset.nx);
    const ay = parseFloat(a.dataset.ny);
    if (Math.hypot(nx - ax, ny - ay) < 0.085) {
      nx = ax;
      ny = ay;
      rVal = parseFloat(a.dataset.r);
      bVal = parseFloat(a.dataset.b);
      snappedLabel = a.dataset.preset;
      a.classList.add("snapped");
    }
  });

  setPadValues(nx, ny, rVal, bVal, snappedLabel);
}

document.getElementById("xyPad").addEventListener("mousedown", (e) => {
  handlePadPointer(e);
  const move = (ev) => handlePadPointer(ev);
  const up = () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
  };
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
});

document.getElementById("btnResetPad").addEventListener("click", () => {
  engineState.s = 1.75;
  document.querySelectorAll("#strokeDotsBar .stroke-dot-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.s === "1.75");
  });
  setPadValues(0.66, 0.56, 2.0, 0.2);
});

document.getElementById("strokeDotsBar").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-s]");
  if (!btn) return;
  engineState.s = parseFloat(btn.dataset.s);
  document.querySelectorAll("#strokeDotsBar .stroke-dot-btn").forEach((b) => b.classList.toggle("active", b === btn));
  renderAll();
});

// Workspace & Category Navigation
document.querySelectorAll(".ws-pill-btn").forEach((btn) => {
  btn.addEventListener("click", () => switchSection(btn.dataset.ws));
});

document.getElementById("categoryFilterBox").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-area]");
  if (!btn) return;
  activeArea = btn.dataset.area;
  document.querySelectorAll("#categoryFilterBox .cat-chip").forEach((r) => r.classList.toggle("active", r === btn));
  if (activeSection === "overview") switchSection("library");
  else renderAll();
});

// Option 1 Attention Queues Dock Buttons
document.getElementById("qBtnTodo").addEventListener("click", () => switchSection("pipeline"));
document.getElementById("qBtnNew").addEventListener("click", () => switchSection("pipeline"));
document.getElementById("qBtnReview").addEventListener("click", () => switchSection("pipeline"));
document.getElementById("qBtnNoCrs").addEventListener("click", () => {
  govFilter = "missing-crs";
  document.getElementById("govFilter").value = "missing-crs";
  activeLibView = "table";
  document.querySelectorAll("#libViewTabs .view-pill-btn").forEach((b) => b.classList.toggle("active", b.dataset.libView === "table"));
  switchSection("library");
});
document.getElementById("qBtnNoAlias").addEventListener("click", () => {
  govFilter = "missing-alias";
  document.getElementById("govFilter").value = "missing-alias";
  activeLibView = "table";
  document.querySelectorAll("#libViewTabs .view-pill-btn").forEach((b) => b.classList.toggle("active", b.dataset.libView === "table"));
  switchSection("library");
});

document.getElementById("libViewTabs").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-lib-view]");
  if (!btn) return;
  activeLibView = btn.dataset.libView;
  document.querySelectorAll("#libViewTabs .view-pill-btn").forEach((b) => b.classList.toggle("active", b === btn));
  renderLibrarySection();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  renderLibrarySection();
});
document.getElementById("stageFilter").addEventListener("change", (e) => {
  stageFilter = e.target.value;
  renderLibrarySection();
});
document.getElementById("govFilter").addEventListener("change", (e) => {
  govFilter = e.target.value;
  renderLibrarySection();
});

document.getElementById("libraryContent").addEventListener("input", (e) => {
  const inp = e.target.closest("[data-meta-id]");
  if (!inp) return;
  scheduleMetaSave(inp.dataset.metaId, { [inp.dataset.metaField]: inp.value }, false);
});

// Global Click Delegation (Modifier Swatches, Card Flip, Card Selection, Stage Transitions, Copy SVG)
document.addEventListener("click", async (e) => {
  const flipBtn = e.target.closest("[data-flip-card]");
  if (flipBtn) {
    e.stopPropagation();
    const id = flipBtn.dataset.flipCard;
    if (flippedCardIds.has(id)) flippedCardIds.delete(id);
    else flippedCardIds.add(id);
    renderLibrarySection();
    return;
  }

  const modBtn = e.target.closest("[data-mod-key]");
  if (modBtn) {
    engineState.mod = modBtn.dataset.modKey;
    renderModifierGrids();
    renderAll();
    return;
  }

  const stageBtn = e.target.closest("[data-stage-id]");
  if (stageBtn) {
    e.stopPropagation();
    const id = stageBtn.dataset.stageId;
    const nextStage = stageBtn.dataset.nextStage;
    scheduleMetaSave(id, { status: nextStage }, true);
    const it = allIcons.find((x) => x.id === id);
    if (it) populateInspector(it, false);
    return;
  }

  const setStageBtn = e.target.closest("[data-set-stage]");
  if (setStageBtn && inspectedItem) {
    scheduleMetaSave(inspectedItem.id, { status: setStageBtn.dataset.setStage }, true);
    return;
  }

  const openCodeBtn = e.target.closest("[data-open-code]");
  if (openCodeBtn) {
    e.stopPropagation();
    const it = allIcons.find((x) => x.id === openCodeBtn.dataset.openCode);
    if (it) {
      document.getElementById("devCodeDetails").open = true;
      await populateInspector(it, true);
    }
    return;
  }

  const copyCell = e.target.closest("[data-copy-svg]");
  if (copyCell) {
    e.stopPropagation();
    const it = allIcons.find((x) => x.id === copyCell.dataset.id);
    if (!it) return;
    const st = copyCell.dataset.copySvg;
    const svg = compileIcon(it, st, engineState, false);
    await navigator.clipboard?.writeText(svg);
    flashCopied(copyCell);
    showToast(`Copied ${fdsiName(it, st)} SVG to clipboard!`);
    return;
  }

  const copyStyleBtn = e.target.closest("[data-copy-style]");
  if (copyStyleBtn && inspectedItem) {
    const st = copyStyleBtn.dataset.copyStyle;
    const svg = compileIcon(inspectedItem, st, engineState, false);
    await navigator.clipboard?.writeText(svg);
    flashCopied(copyStyleBtn);
    showToast(`Copied ${fdsiName(inspectedItem, st)} SVG to clipboard!`);
    return;
  }

  const selectCard = e.target.closest("[data-select-id]");
  if (selectCard && !e.target.closest("input, button, select, textarea")) {
    const it = allIcons.find((x) => x.id === selectCard.dataset.selectId);
    if (it) {
      inspectedItem = it;
      document.querySelectorAll("[data-select-id]").forEach((el) => {
        el.classList.toggle("selected", el.dataset.selectId === it.id);
      });
      await populateInspector(it, false);
    }
  }
});

// Inspector Form Inputs -> Auto-Save to Disk
["inspNameInput", "inspReworkNote", "inspArea", "inspDesc", "inspTags", "inspCrsKey", "inspAlias"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => {
    if (!inspectedItem) return;
    const newTitle = document.getElementById("inspNameInput").value.trim() || inspectedItem.name;
    document.getElementById("inspTitle").textContent = newTitle;
    scheduleMetaSave(
      inspectedItem.id,
      {
        name: newTitle,
        reworkNote: document.getElementById("inspReworkNote").value,
        area: document.getElementById("inspArea").value,
        description: document.getElementById("inspDesc").value,
        tags: document
          .getElementById("inspTags")
          .value.split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
        crsKey: document.getElementById("inspCrsKey").value,
        alias: document.getElementById("inspAlias").value,
      },
      false
    );
  });
});

// Duotone Accent Color Swatches & Custom Picker
document.getElementById("duoSwatchBar").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-duo]");
  if (!btn) return;
  engineState.duoColor = btn.dataset.duo;
  document.getElementById("duoCustomPicker").value = engineState.duoColor;
  document.getElementById("duoHexLabel").textContent = engineState.duoColor;
  document.querySelectorAll("#duoSwatchBar .duo-dot").forEach((d) => d.classList.toggle("active", d === btn));
  renderAll();
});

document.getElementById("duoCustomPicker").addEventListener("input", (e) => {
  engineState.duoColor = e.target.value;
  document.getElementById("duoHexLabel").textContent = engineState.duoColor;
  document.querySelectorAll("#duoSwatchBar .duo-dot").forEach((d) =>
    d.classList.toggle("active", d.dataset.duo.toLowerCase() === engineState.duoColor.toLowerCase())
  );
  renderAll();
});

document.getElementById("devCodeDetails").addEventListener("toggle", (e) => {
  if (e.target.open && inspectedItem) {
    populateInspector(inspectedItem, true);
  }
});

document.getElementById("btnCopyFdsTag").addEventListener("click", async (e) => {
  if (!inspectedItem) return;
  const m = getMeta(inspectedItem);
  const modAttr = engineState.mod !== "none" ? ` modifier="${engineState.mod}"` : "";
  const snippet = `<fds-icon name="fdsi-${m.slug}" size="reg" variant="outline"${modAttr}></fds-icon>`;
  await navigator.clipboard?.writeText(snippet);
  flashCopied(e.currentTarget);
  showToast(`Copied ${snippet}`);
});

async function saveInspectorSource() {
  if (!inspectedItem) return;
  const m = getMeta(inspectedItem);
  const source = document.getElementById("inspCode").value;
  const res = await fetch("/api/icon-source", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      area: inspectedItem._fileArea || m.area,
      slug: m.slug,
      source,
    }),
  });
  const data = await res.json();
  if (data.ok) {
    showToast(`✓ Saved ${data.path} & hot-reloaded!`);
    await loadAllIcons();
  } else {
    showToast(`✗ Error saving: ${data.error}`, 4000);
  }
}

document.getElementById("btnSaveSource").addEventListener("click", saveInspectorSource);

document.getElementById("btnApproveAllReady").addEventListener("click", () => {
  let count = 0;
  for (const it of allIcons) {
    const m = getMeta(it);
    if (m.status === "review") {
      scheduleMetaSave(it.id, { status: "approved" }, false);
      count++;
    }
  }
  renderAll();
  showToast(count > 0 ? `✓ Approved ${count} icons in review!` : "No icons currently in review.");
});

// Top Navbar Controls
document.getElementById("btnKeylines").addEventListener("click", (e) => {
  engineState.showKeylines = !engineState.showKeylines;
  e.currentTarget.classList.toggle("active", engineState.showKeylines);
  renderAll();
  showToast(
    engineState.showKeylines
      ? "Keyline Blueprints ON (24×24 grid + construction circles + tangent nodes)"
      : "Keyline Blueprints OFF",
    1600
  );
});

// Native-Mode Theme Engine (Light Themes: enterprise-light, warm-paper | Dark Themes: enterprise-dark, dracula, catppuccin-mocha, tokyo-night)
const THEME_META = {
  "enterprise-light": { isDark: false, label: "Enterprise Light" },
  "warm-paper": { isDark: false, label: "Warm Paper" },
  "enterprise-dark": { isDark: true, label: "Enterprise Dark" },
  "dracula": { isDark: true, label: "Dracula" },
  "catppuccin-mocha": { isDark: true, label: "Catppuccin Mocha" },
  "tokyo-night": { isDark: true, label: "Tokyo Night" },
};

let activeThemeId = localStorage.getItem("fdsi_wb_theme_id") || "enterprise-light";
if (!THEME_META[activeThemeId]) activeThemeId = "enterprise-light";
let lastLightTheme = localStorage.getItem("fdsi_wb_last_light") || "enterprise-light";
let lastDarkTheme = localStorage.getItem("fdsi_wb_last_dark") || "enterprise-dark";

function syncThemeAttributes() {
  const meta = THEME_META[activeThemeId] || THEME_META["enterprise-light"];
  engineState.isDark = meta.isDark;
  if (meta.isDark) {
    lastDarkTheme = activeThemeId;
    localStorage.setItem("fdsi_wb_last_dark", lastDarkTheme);
  } else {
    lastLightTheme = activeThemeId;
    localStorage.setItem("fdsi_wb_last_light", lastLightTheme);
  }
  localStorage.setItem("fdsi_wb_theme_id", activeThemeId);
  document.documentElement.setAttribute("data-theme", activeThemeId);
  document.body.classList.toggle("dark", engineState.isDark);
  const sel = document.getElementById("themeFamilySelect");
  if (sel) sel.value = activeThemeId;
  const btn = document.getElementById("btnTheme");
  if (btn) {
    btn.classList.toggle("active", engineState.isDark);
    const targetId = engineState.isDark ? lastLightTheme : lastDarkTheme;
    const targetName = THEME_META[targetId]?.label || targetId;
    btn.setAttribute("data-tip", `Switch to ${engineState.isDark ? "Light" : "Dark"} (${targetName})`);
  }
}
syncThemeAttributes();

// Atomic, 100% synchronized theme switching: locks out all individual component
// CSS transitions (`html.theme-switching * { transition: none !important }`) so every
// surface, border, button, and SVG updates in the exact same paint frame with zero stagger.
function applySyncedTheme(nextThemeId) {
  activeThemeId = THEME_META[nextThemeId] ? nextThemeId : "enterprise-light";
  const root = document.documentElement;
  root.classList.add("theme-switching");
  syncThemeAttributes();
  renderAll();
  // Force style flush while transitions are disabled so all elements settle simultaneously
  void root.offsetHeight;
  requestAnimationFrame(() => {
    root.classList.remove("theme-switching");
  });
}

document.getElementById("themeFamilySelect").addEventListener("change", (e) => {
  applySyncedTheme(e.target.value);
});

document.getElementById("btnTheme").addEventListener("click", () => {
  const nextId = engineState.isDark ? lastLightTheme : lastDarkTheme;
  applySyncedTheme(nextId);
});

// Bulletproof Portal Tooltip (#globalTooltip attached to document.body, viewport-clamped & auto-flipped!)
const portalTip = document.getElementById("globalTooltip");
let activeTipEl = null;

function positionPortalTooltip(target) {
  const text = target?.getAttribute("data-tip");
  if (!text) {
    portalTip.classList.remove("visible");
    return;
  }
  portalTip.textContent = text;
  portalTip.classList.add("visible");

  const r = target.getBoundingClientRect();
  const tw = portalTip.offsetWidth;
  const th = portalTip.offsetHeight;
  const margin = 8;

  // Prefer above target; flip below if near top edge of viewport:
  let top = r.top - th - 7;
  if (top < margin) {
    top = r.bottom + 7;
  }
  // Clamp horizontally inside [margin, window.innerWidth - tw - margin] so it NEVER bleeds off screen:
  let left = r.left + r.width / 2 - tw / 2;
  left = Math.max(margin, Math.min(window.innerWidth - tw - margin, left));

  portalTip.style.top = `${Math.round(top)}px`;
  portalTip.style.left = `${Math.round(left)}px`;
}

document.addEventListener("mouseover", (e) => {
  const slotWithToken = e.target.closest(".icon-slot[data-token]");
  if (slotWithToken) {
    const stage = slotWithToken.closest(".stage-3b");
    const readout = stage?.querySelector(".stage-style-readout");
    if (readout) readout.textContent = slotWithToken.dataset.token;
  }

  const tipTarget = e.target.closest("[data-tip]");
  if (tipTarget) {
    activeTipEl = tipTarget;
    positionPortalTooltip(tipTarget);
  } else if (activeTipEl) {
    activeTipEl = null;
    portalTip.classList.remove("visible");
  }
});

document.addEventListener("mouseout", (e) => {
  if (activeTipEl && !e.relatedTarget?.closest?.("[data-tip]")) {
    activeTipEl = null;
    portalTip.classList.remove("visible");
  }
});

window.addEventListener(
  "scroll",
  () => {
    if (activeTipEl) positionPortalTooltip(activeTipEl);
  },
  true
);

document.getElementById("btnToggleInspector").addEventListener("click", (e) => {
  const shell = document.getElementById("appShell");
  shell.classList.toggle("no-inspector");
  e.currentTarget.classList.toggle("active", !shell.classList.contains("no-inspector"));
});

document.getElementById("btnExportMeta").addEventListener("click", () => {
  const out = {};
  for (const item of allIcons) {
    const m = getMeta(item);
    out[`fdsi-${m.slug}-reg`] = {
      id: `fdsi-${m.slug}-reg`,
      sourceId: item.id,
      tokens: {
        line: `fdsi-${m.slug}-reg-line`,
        solid: `fdsi-${m.slug}-reg-solid`,
        duotone: `fdsi-${m.slug}-reg-duotone`,
        color: `fdsi-${m.slug}-reg-color`,
      },
      alias: m.alias || "",
      crsKey: m.crsKey || "",
      description: m.description || "",
      area: m.area,
      tags: m.tags,
      status: m.status,
      ...(m.reworkNote ? { reworkNote: m.reworkNote } : {}),
    };
  }
  const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "fdsi-icons-metadata.json";
  a.click();
});

document.getElementById("btnPublishRepo").addEventListener("click", async () => {
  const btn = document.getElementById("btnPublishRepo");
  const prev = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Publishing 928 SVGs…";
  showToast("Running Skia PathKit + SVGO flattener and exporting to fdsi-fig2global…", 15000);
  try {
    const res = await fetch("/api/export-fig2global", { method: "POST" });
    const data = await res.json();
    if (data.ok) {
      showToast(`✅ Published to fdsi-fig2global!\n${data.output}`, 5000);
    } else {
      showToast(`❌ Export failed:\n${data.error}`, 6000);
    }
  } catch (e) {
    showToast(`❌ Export error: ${e.message}`, 5000);
  } finally {
    btn.disabled = false;
    btn.textContent = prev;
  }
});

window.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    switchSection("library");
    document.getElementById("searchInput").focus();
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s" && document.getElementById("devCodeDetails").open) {
    e.preventDefault();
    saveInspectorSource();
  }
});

// Live SSE File Watcher
const ev = new EventSource("/api/events");
ev.addEventListener("icons-changed", (e) => {
  const info = JSON.parse(e.data || "{}");
  showToast(`🔄 Hot-reloading (${info.area}/${info.file})…`, 1800);
  loadAllIcons();
});

loadAllIcons();
