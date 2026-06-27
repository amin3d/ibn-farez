"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, Settings } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "خانه", icon: Home },
    { href: "/search", label: "جستجو", icon: Search },
    { href: "/bookmarks", label: "نشانک‌ها", icon: Bookmark },
    { href: "/settings", label: "تنظیمات", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border text-foreground flex justify-around items-center h-16 px-2 z-50">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center w-full h-full text-xs transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" strokeWidth={isActive ? 2.5 : 2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}