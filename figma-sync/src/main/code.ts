import { loadSettings, saveSettings } from "./settings";
import { GitHubClient } from "./github-client";
import { pullIcons, postPublishSync } from "./pull";
import { getSelectionInfo, buildPushPlan, applyPushPlan } from "./push";
import type { PushIdentity, PushPlan } from "./push";
import { reconcile } from "./reconcile";
import { tagIconComponentSet } from "./figma-nodes";
import type { PluginSettings } from "./types";

figma.showUI(__html__, { width: 420, height: 640 });

let pendingPush: PushPlan | null = null;

function post(type: string, payload: Record<string, unknown> = {}): void {
  figma.ui.postMessage({ type, ...payload });
}

function githubClient(settings: PluginSettings): GitHubClient {
  return new GitHubClient({ token: settings.token, owner: settings.owner, repo: settings.repo });
}

figma.ui.onmessage = async (msg: { type: string; [key: string]: unknown }) => {
  try {
    switch (msg.type) {
      case "ui-ready": {
        post("settings", { settings: await loadSettings() });
        break;
      }
      case "save-settings": {
        await saveSettings(msg.settings as PluginSettings);
        post("settings-saved");
        break;
      }
      case "pull": {
        const settings = msg.settings as PluginSettings;
        const result = await pullIcons(settings, githubClient(settings));
        post("pull-result", { result });
        break;
      }
      case "post-publish-sync": {
        const settings = msg.settings as PluginSettings;
        const result = await postPublishSync(settings, githubClient(settings));
        post("post-publish-result", { result });
        break;
      }
      case "reconcile": {
        const settings = msg.settings as PluginSettings;
        const entries = await reconcile(settings, githubClient(settings));
        post("reconcile-result", { entries });
        break;
      }
      case "get-selection": {
        post("selection-info", { info: getSelectionInfo(figma.currentPage.selection) });
        break;
      }
      case "prepare-push": {
        const settings = msg.settings as PluginSettings;
        const identities = msg.identities as Record<string, PushIdentity>;
        const selectedSets = figma.currentPage.selection.filter(
          (n): n is ComponentSetNode => n.type === "COMPONENT_SET"
        );
        pendingPush = await buildPushPlan(selectedSets, identities, settings, githubClient(settings));
        post("push-plan", { plan: pendingPush.plan });
        break;
      }
      case "confirm-push": {
        if (!pendingPush) throw new Error("No push plan is staged");
        const settings = msg.settings as PluginSettings;
        const sha = await applyPushPlan(pendingPush.plan, settings, githubClient(settings));
        for (const [name, set] of pendingPush.nodesByName) {
          const hash = pendingPush.hashesByName.get(name)!;
          const entry = pendingPush.plan.find((p) => p.iconName === name)!;
          tagIconComponentSet(set, { name, brand: entry.brand, area: entry.area, hash });
        }
        pendingPush = null;
        post("push-committed", { sha });
        break;
      }
      case "cancel-push": {
        pendingPush = null;
        break;
      }
      default:
        break;
    }
  } catch (err) {
    post("error", { message: err instanceof Error ? err.message : String(err) });
  }
};
