// lib/settings.ts
import { getSetting, setSetting } from "./db";

export interface SettingsState {
  fontSize: string;
  theme: "light" | "dark" | "system";
}

export const defaultSettings: SettingsState = {
  fontSize: "100%",
  theme: "system",
};

const SETTINGS_KEY = "app-settings";

export const getStoredSettings = async (): Promise<SettingsState> => {
  try {
    const stored = await getSetting<Partial<SettingsState>>(SETTINGS_KEY, {});
    return {
      fontSize: stored.fontSize ?? defaultSettings.fontSize,
      theme: stored.theme ?? defaultSettings.theme,
    };
  } catch {
    return defaultSettings;
  }
};

export const saveStoredSettings = async (settings: SettingsState): Promise<void> => {
  await setSetting(SETTINGS_KEY, settings);
};