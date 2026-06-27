import { openDB, IDBPDatabase } from "idb";

let db: IDBPDatabase | null = null;

export const getDB = async () => {
  if (!db) {
    db = await openDB("IbnAlfardDB", 2, {
      upgrade(db, oldVersion) {
        // Object store برای اشعار
        if (!db.objectStoreNames.contains("poems")) {
          const store = db.createObjectStore("poems", { keyPath: "id" });
          store.createIndex("title", "title");
        }
        // Object store برای نشانک‌ها (فقط id شعر)
        if (oldVersion < 2 && !db.objectStoreNames.contains("bookmarks")) {
          db.createObjectStore("bookmarks", { keyPath: "poemId" });
        }
      },
    });
  }
  return db;
};

// --- توابع مربوط به اشعار (قبلاً موجود) ---
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

// --- توابع جدید برای نشانک‌ها ---
export const toggleBookmark = async (poemId: string) => {
  const db = await getDB();
  const tx = db.transaction("bookmarks", "readwrite");
  const store = tx.store;
  const existing = await store.get(poemId);
  if (existing) {
    await store.delete(poemId);
    return false; // removed
  } else {
    await store.put({ poemId });
    return true; // added
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