import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // این گزینه برای تولید فایل‌های استاتیک الزامی است
    images: {
      unoptimized: true, // Capacitor از بهینه‌سازی عکس سرور Next پشتیبانی نمی‌کند
    },
};

export default nextConfig;
