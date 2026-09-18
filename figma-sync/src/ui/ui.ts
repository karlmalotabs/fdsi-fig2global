import type { PluginSettings, SyncPlanEntry } from "../main/types";
import type { PullResult } from "../main/pull";
import type { PushIdentity, SelectionInfo } from "../main/push";
import type { ReconcileEntry } from "../main/reconcile";

function byId<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

const tokenInput = byId<HTMLInputElement>("token");
const ownerInput = byId<HTMLInputElement>("owner");
const repoInput = byId<HTMLInputElement>("repo");
const branchInput = byId<HTMLInputElement>("branch");
const brandInput = byId<HTMLInputElement>("brand");
const logEl = byId<HTMLDivElement>("log");
const mappingEl = byId<HTMLDivElement>("mapping");
const planEl = byId<HTMLDivElement>("plan");
const prepareBtn = byId<HTMLButtonElement>("prepare-push");
const confirmBtn = byId<HTMLButtonElement>("confirm-push");
const cancelBtn = byId<HTMLButtonElement>("cancel-push");

let currentSelection: SelectionInfo[] = [];
let currentIdentities: Record<string, PushIdentity> = {};

function log(message: string, isError = false): void {
  const div = document.createElement("div");
  div.className = isError ? "entry error" : "entry";
  div.textContent = message;
  logEl.prepend(div);
}

function currentSettings(): PluginSettings {
  return {
    token: tokenInput.value.trim(),
    owner: ownerInput.value.trim(),
    repo: repoInput.value.trim(),
    branch: branchInput.value.trim() || "main",
    brand: brandInput.value.trim() || "core",
  };
}

function send(type: string, payload: Record<string, unknown> = {}): void {
  parent.postMessage({ pluginMessage: { type, ...payload } }, "*");
}

function renderMapping(): void {
  mappingEl.innerHTML = "";
  currentIdentities = {};
  for (const info of currentSelection) {
    const row = document.createElement("div");
    row.style.marginBottom = "6px";
    if (info.existing) {
      currentIdentities[info.nodeId] = info.existing;
      row.textContent = `${info.label} \u2192 ${info.existing.name} (${info.existing.brand}/${info.existing.area})`;
    } else {
      row.innerHTML =
        `<div>${info.label} (new)</div>` +
        `<input placeholder="fdsi-use-case" data-field="name" data-node="${info.nodeId}" />` +
        `<input placeholder="area (e.g. global)" data-field="area" data-node="${info.nodeId}" />`;
    }
    mappingEl.appendChild(row);
  }
  prepareBtn.style.display = currentSelection.length ? "inline-block" : "none";
}

function collectMappingInputs(): void {
  mappingEl.querySelectorAll<HTMLInputElement>("input[data-node]").forEach((input) => {
    const nodeId = input.dataset.node as string;
    const field = input.dataset.field as "name" | "area";
    const existing = currentIdentities[nodeId] ?? { name: "", area: "", brand: currentSettings().brand };
    currentIdentities[nodeId] = { ...existing, brand: currentSettings().brand, [field]: input.value.trim() };
  });
}

function renderPlan(plan: SyncPlanEntry[]): void {
  planEl.innerHTML = "";
  for (const entry of plan) {
    const div = document.createElement("div");
    div.className = "entry";
    const fileList = entry.files.map((f) => `${f.delete ? "delete" : "write"} ${f.path}`).join("<br/>");
    const errors = entry.validationErrors.length
      ? `<div class="error">${entry.validationErrors.join("<br/>")}</div>`
      : "";
    div.innerHTML = `<strong>${entry.action} ${entry.iconName}</strong><br/>${fileList}${errors}`;
    planEl.appendChild(div);
  }
  const hasErrors = plan.some((p) => p.validationErrors.length > 0);
  confirmBtn.style.display = plan.length && !hasErrors ? "inline-block" : "none";
  cancelBtn.style.display = plan.length ? "inline-block" : "none";
}

window.onmessage = (event: MessageEvent) => {
  const msg = event.data.pluginMessage;
  if (!msg) return;

  switch (msg.type) {
    case "settings": {
      const s = msg.settings as PluginSettings | null;
      if (s) {
        tokenInput.value = s.token;
        ownerInput.value = s.owner;
        repoInput.value = s.repo;
        branchInput.value = s.branch;
        brandInput.value = s.brand;
      }
      break;
    }
    case "settings-saved":
      log("Settings saved.");
      break;
    case "pull-result": {
      const r = msg.result as PullResult;
      log(
        `Pull done \u2014 created ${r.created.length}, updated ${r.updated.length}, skipped ${r.skipped.length}, errors ${r.errors.length}`
      );
      r.errors.forEach((e) => log(`  ${e.icon}: ${e.error}`, true));
      break;
    }
    case "post-publish-result": {
      const updated = msg.result.updated as string[];
      log(`Post-publish sync recorded componentKey for: ${updated.join(", ") || "(none)"}`);
      break;
    }
    case "reconcile-result": {
      const entries = msg.entries as ReconcileEntry[];
      entries.forEach((e) => log(`${e.name}: ${e.status}`, e.status === "conflict"));
      break;
    }
    case "selection-info": {
      currentSelection = msg.info as SelectionInfo[];
      renderMapping();
      break;
    }
    case "push-plan": {
      renderPlan(msg.plan as SyncPlanEntry[]);
      break;
    }
    case "push-committed":
      log(`Committed ${msg.sha}`);
      planEl.innerHTML = "";
      confirmBtn.style.display = "none";
      cancelBtn.style.display = "none";
      break;
    case "error":
      log(msg.message as string, true);
      break;
    default:
      break;
  }
};

byId<HTMLButtonElement>("save-settings").onclick = () => send("save-settings", { settings: currentSettings() });
byId<HTMLButtonElement>("pull").onclick = () => send("pull", { settings: currentSettings() });
byId<HTMLButtonElement>("reconcile").onclick = () => send("reconcile", { settings: currentSettings() });
byId<HTMLButtonElement>("post-publish").onclick = () => send("post-publish-sync", { settings: currentSettings() });
byId<HTMLButtonElement>("load-selection").onclick = () => send("get-selection");

prepareBtn.onclick = () => {
  collectMappingInputs();
  send("prepare-push", { settings: currentSettings(), identities: currentIdentities });
};
confirmBtn.onclick = () => send("confirm-push", { settings: currentSettings() });
cancelBtn.onclick = () => {
  send("cancel-push");
  planEl.innerHTML = "";
  confirmBtn.style.display = "none";
  cancelBtn.style.display = "none";
};

send("ui-ready");
