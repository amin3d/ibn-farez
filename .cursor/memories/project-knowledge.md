# Project Knowledge — دیوان ابن الفارض

> Context پایدار پروژه برای Cursor Agent. این فایل مکمل `.cursor/rules/` است.

## هویت پروژه

- **نام**: دیوان ابن الفارض (ibn-alfard-app)
- **هدف**: مطالعه آفلاین اشعار عرفانی ابن‌الفارض با ترجمه فارسی
- **مخاطب**: فارسی‌زبان، RTL
- **Repo**: Next.js static site بسته‌شده در Capacitor Android APK

## تصمیمات معماری (ثابت)

1. Static export به‌جای SSR — سادگی deploy و سازگاری Capacitor
2. poems.json در bundle — بدون backend
3. IndexedDB برای bookmarks/settings/search cache — persistence سمت کلاینت
4. shadcn/ui + Tailwind v4 — UI سریع و consistent
5. Vazirmatn — readability فارسی/عربی

## مسیرهای اصلی

| Route | فایل | توضیح |
|-------|------|-------|
| `/` | `app/page.tsx` | لیست + فیلتر عنوان |
| `/search` | `app/search/page.tsx` | جستجو در متن (IndexedDB) |
| `/bookmarks` | `app/bookmarks/page.tsx` | نشانک‌ها |
| `/settings` | `app/settings/page.tsx` | تم و fontSize |
| `/poems/[id]` | `app/poems/[id]/` | نمایش شعر + navigation |

## وابستگی‌های حساس

- Next 16.2.x + React 19 — params در dynamic routes از نوع `Promise<>`
- Capacitor 8 — Node 22+
- idb 8 — IndexedDB wrapper

## Anti-patterns

- اضافه کردن API route یا server action
- fetch poems از remote در runtime
- تغییر theme colors بدون هماهنگی با splash/android
- استفاده از `next/image` بدون unoptimized
- commit خودکار بدون درخواست کاربر

## Maintainer

- GitHub: amin3d / panateam
- License: MIT
