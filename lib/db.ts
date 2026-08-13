import { openDB, IDBPDatabase } from "idb";
import { normalizeForSearch } from "@/lib/utils";
import { getPoemTitle, getPoemSubtitle } from "@/lib/poems";

let db: IDBPDatabase | null = null;

const SEARCH_SESSION_KEY = "search-session";

export type SearchResult = {
  poemId: string;
  poemTitle: string;
  poemSubtitle?: string;
  poet: string;
  /** null یعنی فقط عنوان/نام شعر مطابقت داشته */
  verseIndex: number | null;
  first: string;
  second: string;
};

export type SearchSession = {
  query: string;
  results: SearchResult[];
};

export type MemorizationEntry = {
  poemId: string;
  addedAt: number;
  lastVerseIndex?: number;
};

export const getDB = async () => {
  if (!db) {
    db = await openDB("IbnAlfardDB", 6, {
      upgrade(db, oldVersion) {
        // ایجاد store اشعار
        if (!db.objectStoreNames.contains("poems")) {
          const store = db.createObjectStore("poems", { keyPath: "id" });
          store.createIndex("title", "title");
        }
        // ایجاد store نشانک‌ها
        if (!db.objectStoreNames.contains("bookmarks")) {
          db.createObjectStore("bookmarks", { keyPath: "poemId" });
        }
        // ایجاد store تنظیمات (مهم)
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }
        // لیست اشعار برای حفظ
        if (oldVersion < 6 && !db.objectStoreNames.contains("memorization")) {
          db.createObjectStore("memorization", { keyPath: "poemId" });
        }
      },
    });
  }
  return db;
};

// --- بقیه توابع بدون تغییر ---
export const savePoems = async (poems: any[]) => {
  const db = await getDB();
  const tx = db.transaction("poems", "readwrite");
  await Promise.all(poems.map((p) => tx.store.put(p)));
  await tx.done;
};

export const searchPoems = async (query: string): Promise<SearchResult[]> => {
  const db = await getDB();
  const all = await db.getAll("poems");
  const q = normalizeForSearch(query);
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const p of all) {
    const titleNorm = normalizeForSearch(String(p.title ?? ""));
    const aliasNorm =
      typeof p.alias === "string" ? normalizeForSearch(p.alias) : "";
    const titleMatch = titleNorm.includes(q) || aliasNorm.includes(q);

    let verseMatched = false;
    const verses = Array.isArray(p.verses) ? p.verses : [];

    for (let i = 0; i < verses.length; i++) {
      const v = verses[i];
      const inFirst = normalizeForSearch(String(v.first ?? "")).includes(q);
      const inSecond = normalizeForSearch(String(v.second ?? "")).includes(q);
      const inTranslations = v.translations?.some((t: { text?: string }) =>
        normalizeForSearch(String(t.text ?? "")).includes(q)
      );
      if (inFirst || inSecond || inTranslations) {
        verseMatched = true;
        results.push({
          poemId: p.id,
          poemTitle: getPoemTitle(p),
          poemSubtitle: getPoemSubtitle(p),
          poet: p.poet,
          verseIndex: i,
          first: v.first,
          second: v.second,
        });
      }
    }

    if (titleMatch && !verseMatched) {
      results.push({
        poemId: p.id,
        poemTitle: getPoemTitle(p),
        poemSubtitle: getPoemSubtitle(p),
        poet: p.poet,
        verseIndex: null,
        first: p.title,
        second: "",
      });
    }
  }

  return results;
};

export const saveSearchSession = async (session: SearchSession): Promise<void> => {
  await setSetting(SEARCH_SESSION_KEY, session);
};

export const getSearchSession = async (): Promise<SearchSession | null> => {
  return getSetting<SearchSession | null>(SEARCH_SESSION_KEY, null);
};

export const clearSearchSession = async (): Promise<void> => {
  await setSetting(SEARCH_SESSION_KEY, null);
};

const LAST_SEEN_VERSION_KEY = "last-seen-version";

export const getLastSeenVersion = async (): Promise<string> => {
  return getSetting<string>(LAST_SEEN_VERSION_KEY, "");
};

export const setLastSeenVersion = async (version: string): Promise<void> => {
  await setSetting(LAST_SEEN_VERSION_KEY, version);
};

export const toggleBookmark = async (poemId: string) => {
  const db = await getDB();
  const tx = db.transaction("bookmarks", "readwrite");
  const store = tx.store;
  const existing = await store.get(poemId);
  if (existing) {
    await store.delete(poemId);
    return false;
  } else {
    await store.put({ poemId });
    return true;
  }
};

export const isBookmarked = async (poemId: string): Promise<boolean> => {
  const db = await getDB();
  const result = await db.get("bookmarks", poemId);
  return !!result;
};

export const getBookmarkedPoems = async () => {
  const db = await getDB();
  const bookmarks = await db.getAll("bookmarks");
  const poemIds = bookmarks.map((b) => b.poemId);
  if (poemIds.length === 0) return [];
  const allPoems = await db.getAll("poems");
  return allPoems.filter((p) => poemIds.includes(p.id));
};

export const toggleMemorization = async (poemId: string): Promise<boolean> => {
  const db = await getDB();
  const tx = db.transaction("memorization", "readwrite");
  const store = tx.store;
  const existing = await store.get(poemId);
  if (existing) {
    await store.delete(poemId);
    await tx.done;
    return false;
  }
  await store.put({ poemId, addedAt: Date.now() } satisfies MemorizationEntry);
  await tx.done;
  return true;
};

export const isInMemorizationList = async (poemId: string): Promise<boolean> => {
  const db = await getDB();
  const result = await db.get("memorization", poemId);
  return !!result;
};

export const getMemorizationEntries = async (): Promise<MemorizationEntry[]> => {
  const db = await getDB();
  const entries = await db.getAll("memorization");
  return entries.sort((a, b) => b.addedAt - a.addedAt);
};

export const getMemorizationEntry = async (
  poemId: string
): Promise<MemorizationEntry | undefined> => {
  const db = await getDB();
  return db.get("memorization", poemId);
};

export const getMemorizationPoems = async () => {
  const entries = await getMemorizationEntries();
  if (entries.length === 0) return [];
  const db = await getDB();
  const allPoems = await db.getAll("poems");
  const byId = new Map(entries.map((entry) => [entry.poemId, entry]));
  return allPoems
    .filter((p) => byId.has(p.id))
    .map((p) => ({ poem: p, entry: byId.get(p.id)! }));
};

export const updateMemorizationProgress = async (
  poemId: string,
  lastVerseIndex: number
): Promise<void> => {
  const db = await getDB();
  const existing = await db.get("memorization", poemId);
  if (!existing) return;
  const tx = db.transaction("memorization", "readwrite");
  await tx.store.put({
    ...existing,
    lastVerseIndex,
  } satisfies MemorizationEntry);
  await tx.done;
};

export const getSetting = async <T>(key: string, defaultValue: T): Promise<T> => {
  const db = await getDB();
  try {
    const result = await db.get("settings", key);
    return result ? (result.value as T) : defaultValue;
  } catch (error) {
    console.error("Error getting setting:", error);
    return defaultValue;
  }
};

export const setSetting = async <T>(key: string, value: T): Promise<void> => {
  const db = await getDB();
  try {
    const tx = db.transaction("settings", "readwrite");
    await tx.store.put({ key, value });
    await tx.done;
  } catch (error) {
    console.error("Error setting setting:", error);
    throw error;
  }
};
