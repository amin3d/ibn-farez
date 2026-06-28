# 📖 دیوان ابن الفارض - اپلیکیشن اشعار عرفانی

<div dir="rtl">

**دیوان ابن الفارض** یک اپلیکیشن موبایل و وب برای مطالعهٔ اشعار عرفانی ابن‌الفارض، شاعر بزرگ صوفی عرب است. این پروژه با استفاده از **Next.js 15**، **Capacitor**، **Tailwind CSS v4** و **IndexedDB** ساخته شده و تجربه‌ای روان، آفلاین و زیبا را برای علاقه‌مندان به ادبیات عرفانی فراهم می‌کند.

</div>

---

## ✨ ویژگی‌ها

- 📜 **نمایش اشعار** با تفکیک دو مصراع و قابلیت نمایش ترجمهٔ فارسی
- 🔍 **جستجوی سریع و زنده** در عناوین، مصراع‌ها و ترجمه‌ها
- 🔖 **نشانک‌گذاری اشعار** با ذخیره‌سازی در IndexedDB
- 🌓 **حالت روشن/تاریک/سیستم** با تنظیمات قابل ذخیره
- 📱 **منوی پایین شیشه‌ای** با ناوبری روان بین صفحات
- 🖼️ **Splash Screen** تمام‌صفحه با لوگو و نوار بارگذاری
- 📲 **خروجی اندروید** (APK و App Bundle) با Capacitor
- 🎨 **تم رنگی اختصاصی** (سبز، طلایی، کرم) با حس و حال معنوی
- 🏷️ **فونت وزیر** (Vazirmatn) برای نمایش زیبای متون فارسی و عربی

---

## 🛠️ تکنولوژی‌های استفاده‌شده

- **Next.js 15** (App Router, `output: export`)
- **React 18** (با Hooks و کامپوننت‌های سمت کلاینت)
- **Tailwind CSS v4** (با `@theme` و `oklch`)
- **shadcn/ui** (کامپوننت‌های کارت، دکمه و ...)
- **Capacitor 6** (برای خروجی اندروید)
- **IndexedDB** (با کتابخانه `idb`)
- **TypeScript** (برای تایپ‌سیفتی)
- **Lucide React** (آیکون‌ها)
- **Vazirmatn** (فونت فارسی/عربی از Google Fonts)

---

## 📁 ساختار پروژه

```
ibn-alfard-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (خانه)
│   ├── fonts.ts
│   ├── globals.css
│   ├── poems/[id]/
│   │   ├── page.tsx
│   │   └── PoemClient.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── bookmarks/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── components/
│   ├── BottomNav.tsx
│   ├── SplashScreen.tsx
│   ├── BookmarkButton.tsx
│   ├── PoemNavigation.tsx
│   └── ui/ (shadcn)
├── lib/
│   ├── db.ts (IndexedDB)
│   ├── poems.ts (داده‌ها و توابع)
│   └── settings.ts (مدیریت تنظیمات)
├── public/
│   ├── data/
│   │   └── poems.json (داده‌های اشعار)
│   ├── logo.png
│   └── splash-bg.jpg
├── assets/ (فایل‌های منبع برای اندروید)
│   ├── icon.png
│   └── splash.png
├── android/ (پروژه اندروید تولید شده توسط Capacitor)
├── capacitor.config.ts
├── next.config.js
├── package.json
└── README.md
```

---

## 🚀 راه‌اندازی پروژه از صفر تا صد

### ۱. پیش‌نیازها

- **Node.js** نسخه ۲۲ یا بالاتر (برای Capacitor 6)
- **npm** یا **yarn** یا **pnpm**
- **Java JDK** نسخه ۱۷ یا ۲۱ (برای اندروید)
- **Android SDK** (برای ساخت اندروید)
- **Git** (برای کلون کردن مخزن)

---

### ۲. کلون کردن مخزن

```bash
git clone https://github.com/amin3d/ibn-farez.git
cd ibn-farez
```

---

### ۳. نصب وابستگی‌ها

```bash
npm install
```

---

### ۴. اضافه کردن داده‌های اشعار

داده‌های اشعار را به‌صورت یک فایل JSON در مسیر `public/data/poems.json` قرار دهید. فرمت هر شعر به این صورت است:

```json
{
  "id": "poem_1519.html",
  "title": "هو الحُبّ فاسلم بالحشا ما الهَوى سهلَ",
  "poet": "ابن الفارض",
  "verses": [
    {
      "first": "هو الحُبّ فاسلم بالحشا ما الهَوى سهلَ",
      "second": "فما اختارَهُ مُضْنى به وله عقْلُ",
      "translations": [
        { "lang": "fa", "text": "ناز کن که تو شایستهٔ این نازی..." }
      ]
    }
  ]
}
```

> برای استخراج خودکار اشعار از [الدیوان](https://www.aldiwan.net)، می‌توانید از اسکریپت [aldiwan_arabic_poems_scrapper](https://github.com/moussaKam/aldiwan_arabic_poems_scrapper) استفاده کنید.

---

### ۵. اجرای در حالت توسعه (وب)

```bash
npm run dev
```

سپس در مرورگر باز کنید: [http://localhost:3000](http://localhost:3000)

---

### ۶. ساخت خروجی استاتیک

```bash
npm run build
```

خروجی در پوشه `out/` قرار می‌گیرد.

---

## 📱 ساخت اپلیکیشن اندروید

### ۱. اضافه کردن Capacitor

اگر قبلاً اضافه نشده است:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "دیوان ابن الفارض" "com.yourapp.ibnalfard" --web-dir=out
npx cap add android
```

### ۲. همگام‌سازی و ساخت

```bash
npm run build
npx cap sync android
npx cap open android  # باز کردن در Android Studio
```

### ۳. ساخت APK با خط فرمان

```bash
cd android
./gradlew assembleDebug   # برای Debug
./gradlew assembleRelease  # برای Release
```

فایل‌های خروجی در مسیر زیر قرار می‌گیرند:
```
android/app/build/outputs/apk/debug/app-debug.apk
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔐 تنظیمات محیطی برای Release (امضای دیجیتال)

برای ساخت نسخه Release، باید یک Keystore ایجاد کرده و آن را در GitHub Secrets ذخیره کنید.

### ۱. ساخت Keystore

```bash
keytool -genkey -v -keystore ibn-alfard-release.keystore -alias ibn-alfard -keyalg RSA -keysize 2048 -validity 10000
```

### ۲. تبدیل به Base64

```bash
base64 -w 0 ibn-alfard-release.keystore > keystore.b64
```

محتوای `keystore.b64` را در GitHub Secret با نام `KEYSTORE_BASE64` ذخیره کنید.

### ۳. سایر Secrets

در مخزن GitHub، Secrets زیر را اضافه کنید:

| نام Secret | مقدار |
|------------|--------|
| `KEYSTORE_PASSWORD` | رمز `storepass` |
| `KEY_ALIAS` | `ibn-alfard` (همان alias) |
| `KEY_PASSWORD` | رمز `keypass` (معمولاً مثل storepass) |

---

## 🧪 تست و دیباگ

- برای تست وب: `npm run dev`
- برای تست اندروید: `npx cap open android` و سپس اجرا روی شبیه‌ساز
- کنسول مرورگر و Android Logcat برای رفع خطاها

---

## 🎨 سفارشی‌سازی ظاهر

- **رنگ‌ها**: در فایل `app/globals.css` در بخش `:root` و `.dark` تغییر دهید.
- **فونت**: فونت Vazirmatn در `app/fonts.ts` تنظیم شده است.
- **Splash Screen وب**: در `components/SplashScreen.tsx` تصویر و متن را تغییر دهید.
- **منوی پایین**: در `components/BottomNav.tsx` آیتم‌ها و رنگ‌ها را ویرایش کنید.

---

## 📦 بیلد خودکار با GitHub Actions

این مخزن دارای workflow برای ساخت خودکار APK در هر بار push تگ با فرمت `v*` است:

- `.github/workflows/build-release.yml`
- پس از اجرا، APK در بخش **Actions** → **Artifacts** قابل دانلود است.

برای اجرا:

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 📄 مجوز

این پروژه تحت مجوز **MIT** منتشر شده است.

---

## 🤝 مشارکت

اگر پیشنهادی، خطایی یا ایده‌ای دارید، خوشحال می‌شویم Issues و Pull Requests شما را ببینیم.

---

## 📞 ارتباط با توسعه‌دهنده

- **ایجاد‌کننده**: [پاناتیم](https://github.com/amin3d)
- **ایمیل**: (در صورت نیاز)

---

**با عشق به ادبیات عرفانی** 🌹

---

<div align="center" dir="ltr">

**دیوان ابن الفارض** – *A spiritual poetry app for Ibn Al-Farid's works*

</div>