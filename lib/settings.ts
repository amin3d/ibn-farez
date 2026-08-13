import { getSetting, setSetting } from "./db";

export interface SettingsState {
  fontSize: string;
  theme: "light" | "dark" | "system";
  /** ثانیه تا نمایش کامل بیت */
  memorizationRevealDelay: number;
  /** ثانیه تا نمایش راهنما */
  memorizationHintDelay: number;
  /** پس از نمایش بیت، خودکار به بیت بعد برود */
  memorizationAutoAdvance: boolean;
  /** ثانیه مکث پس از نمایش قبل از رفتن به بیت بعد */
  memorizationAutoAdvanceDelay: number;
}

export const defaultSettings: SettingsState = {
  fontSize: "100%",
  theme: "system",
  memorizationRevealDelay: 15,
  memorizationHintDelay: 10,
  memorizationAutoAdvance: true,
  memorizationAutoAdvanceDelay: 4,
};

export const MEMORIZATION_REVEAL_OPTIONS = [10, 15, 20, 30, 45] as const;
export const MEMORIZATION_HINT_OPTIONS = [5, 8, 10, 12, 15] as const;

const SETTINGS_KEY = "app-settings";

export const getStoredSettings = async (): Promise<SettingsState> => {
  try {
    const stored = await getSetting<Partial<SettingsState>>(SETTINGS_KEY, {});
    console.log("🔍 Stored settings from DB:", stored);
    return {
      fontSize: stored.fontSize ?? defaultSettings.fontSize,
      theme: stored.theme ?? defaultSettings.theme,
      memorizationRevealDelay:
        stored.memorizationRevealDelay ?? defaultSettings.memorizationRevealDelay,
      memorizationHintDelay:
        stored.memorizationHintDelay ?? defaultSettings.memorizationHintDelay,
      memorizationAutoAdvance:
        stored.memorizationAutoAdvance ?? defaultSettings.memorizationAutoAdvance,
      memorizationAutoAdvanceDelay:
        stored.memorizationAutoAdvanceDelay ??
        defaultSettings.memorizationAutoAdvanceDelay,
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