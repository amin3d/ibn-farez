import type { Metadata } from "next";
import "./globals.css";
import { vazir } from "./fonts"; // ایمپورت فونت
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: "دیوان ابن الفارض",
  description: "اپلیکیشن اشعار ابن الفارض",
  icons: {
    icon: "/logo.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazir.className}>
      <body>
        <SplashScreen />
        <main className="pb-20 pt-4 max-w-2xl mx-auto px-4">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}