import { openDB, IDBPDatabase } from "idb";

let db: IDBPDatabase | null = null;

export const getDB = async () => {
  if (!db) {
    db = await openDB("IbnAlfardDB", 5, {
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

export const searchPoems = async (query: string) => {
  const db = await getDB();
  const all = await db.getAll("poems");
  const lowerQuery = query.toLowerCase();
  return all.filter((p) => {
    if (p.title.toLowerCase().includes(lowerQuery)) return true;
    return p.verses.some((v: any) => {
      const inFirst = v.first.toLowerCase().includes(lowerQuery);
      const inSecond = v.second.toLowerCase().includes(lowerQuery);
      const inTranslations = v.translations?.some((t: any) =>
        t.text.toLowerCase().includes(lowerQuery)
      );
      return inFirst || inSecond || inTranslations;
    });
  });
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