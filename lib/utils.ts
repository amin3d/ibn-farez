import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** حذف اعراب و یکسان‌سازی حروف برای جستجوی فارسی/عربی */
export function normalizeForSearch(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u08F0-\u08FF]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ىی]/g, "ي")
    .replace(/ک/g, "ك")
    .toLowerCase()
}
