import type { PluginSettings } from "./types";

const SETTINGS_KEY = "fdsi-sync-settings";

export async function loadSettings(): Promise<PluginSettings | null> {
  const value = await figma.clientStorage.getAsync(SETTINGS_KEY);
  return (value as PluginSettings | undefined) ?? null;
}

export async function saveSettings(settings: PluginSettings): Promise<void> {
  await figma.clientStorage.setAsync(SETTINGS_KEY, settings);
}
