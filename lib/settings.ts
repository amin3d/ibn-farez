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
    console.log("🔍 Stored settings from DB:", stored);
    return {
      fontSize: stored.fontSize ?? defaultSettings.fontSize,
      theme: stored.theme ?? defaultSettings.theme,
    };
  } catch (error) {
    console.error("Error reading settings:", error);
    return defaultSettings;
  }
};

export const saveStoredSettings = async (settings: SettingsState): Promise<void> => {
  try {
    await setSetting(SETTINGS_KEY, settings);
    console.log("✅ Settings saved successfully:", settings);
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
};