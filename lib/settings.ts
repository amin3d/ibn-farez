import { openDB } from "idb";

const DB_NAME = "ibn-alfard-db";
const STORE = "settings";
const KEY = "prefs";

type SettingsState = {
  fontSize: string;
  theme: string;
};

const defaultSettings: SettingsState = {
  fontSize: "100%",
  theme: "system",
};

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    },
  });
}

export async function getStoredSettings(): Promise<SettingsState> {
  try {
    const db = await getDB();
    const res = await db.get(STORE, KEY);
    return (res as SettingsState) ?? defaultSettings;
  } catch (e) {
    return defaultSettings;
  }
}

export async function saveStoredSettings(settings: SettingsState) {
  const db = await getDB();
  await db.put(STORE, settings, KEY);
}

export { defaultSettings };
