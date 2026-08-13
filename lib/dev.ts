/** فقط در `next dev` — در build/production غیرفعال است */
export const isDevEditorEnabled = (): boolean =>
  process.env.NODE_ENV === "development";

/** مسیر API ذخیره — در dev از rewrite هم‌مبدأ Next استفاده می‌شود */
export const DEV_POEM_API_BASE = "";
