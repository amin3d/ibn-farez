# دیوان ابن الفارض — راهنمای Agent

اپلیکیشن مطالعهٔ اشعار عرفانی ابن‌الفارض؛ Next.js static export + Capacitor Android.

## Stack

| لایه | تکنولوژی |
|------|----------|
| Framework | Next.js 16 (App Router), `output: 'export'` |
| UI | React 19, shadcn/ui (radix-maia), Tailwind CSS v4 |
| Mobile | Capacitor 8, webDir: `out/` |
| Storage | IndexedDB via `idb` (`lib/db.ts`) |
| Icons | lucide-react (کامپوننت‌ها), hugeicons (shadcn config) |
| Font | Vazirmatn (`app/fonts.ts`) |

## محدودیت‌های معماری

- **بدون SSR/API Routes** — فقط static export؛ از `getServerSideProps`، Route Handlers و Image Optimization سرور پرهیز کنید
- **`images.unoptimized: true`** — برای سازگاری با Capacitor
- **دادهٔ اشعار** — `public/data/poems.json`، import در `lib/poems.ts`
- **Client state** — bookmarks، settings و جستجوی پیشرفته در IndexedDB
- **Dynamic routes** — `generateStaticParams` برای `app/poems/[id]`

## ساختار

```
app/          → صفحات (App Router)
components/   → UI اختصاصی + components/ui/ (shadcn)
lib/          → poems.ts, db.ts, settings.ts, utils.ts
public/data/  → poems.json
android/      → پروژه Capacitor (دست‌کاری با احتیاط)
```

## جریان توسعه

```bash
npm run dev          # وب
npm run build        # خروجی static → out/
npx cap sync android # همگام‌سازی با اندروید
```

## قراردادهای UI

- زبان UI: **فارسی**، `lang="fa"` و `dir="rtl"` در root layout
- تم: سبز (`primary`)، طلایی (`secondary`)، کرم (`background`) — متغیرها در `globals.css`
- Layout: `max-w-2xl mx-auto`, `pb-20` برای BottomNav ثابت
- Import alias: `@/*` → root

## تایپ‌های داده

```typescript
interface Poem { id: string; title: string; poet: string; verses: Verse[] }
interface Verse { first: string; second: string; translations: Translation[] }
interface Translation { lang: string; text: string }
```

## چک‌لیست قبل از PR

- [ ] `npm run build` بدون خطا
- [ ] بدون breaking change در schema IndexedDB (یا bump version در `openDB`)
- [ ] متون UI فارسی و RTL-safe
- [ ] کامپوننت‌های تعاملی با `"use client"`
