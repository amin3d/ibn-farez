"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000); // ۳ ثانیه نمایش

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[999] transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* تصویر پس‌زمینه تمام‌صفحه */}
      <div className="relative w-full h-full">
        <Image
          src="/splash.png"
          alt="Splash Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />

        {/* لایهٔ شفاف برای خوانایی متن */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />

        {/* محتوای اسپلش (در پایین صفحه) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-16 flex flex-col items-center justify-end h-full">
          {/* لوگو یا عنوان */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <span className="text-4xl md:text-5xl text-white/90">🌙</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              دیوان ابن الفارض
            </h1>
            <p className="text-sm text-white/80 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              گنجینه‌ی اشعار عرفانی
            </p>
          </div>

          {/* نوار بارگذاری در پایین */}
          <div className="mt-8 w-64 max-w-[80%]">
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full animate-pulse"
                style={{ width: "70%" }}
              />
            </div>
            <p className="mt-2 text-xs text-white/60 text-center">
              در حال بارگذاری...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}