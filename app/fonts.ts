// app/fonts.ts
import { Vazirmatn } from "next/font/google";

// اگر می‌خواهید از نسخه وزیرمتن استفاده کنید (پشتیبانی بهتر از فارسی)
export const vazir = Vazirmatn({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazir",
  display: "swap",
});

// در صورت تمایل به استفاده از نسخه قدیمی وزیر (با پکیج @fontsource/vazir)
// می‌توانید از روش زیر استفاده کنید:
// import "@fontsource/vazir"; // در layout.tsx
// export const vazir = { className: "font-vazir" };