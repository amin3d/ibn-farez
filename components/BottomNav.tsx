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
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 px-2 z-50
        bg-background/70 backdrop-blur-xl border-t border-white/10 shadow-lg
        dark:bg-background/60 dark:border-white/5"
    >
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center w-full h-full text-xs transition-all duration-200
              ${
                isActive
                  ? "text-secondary font-medium"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
          >
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-secondary/10 text-secondary shadow-sm"
                    : "hover:bg-secondary/5"
                }`}
            >
              <Icon
                className="w-5 h-5 transition-transform duration-200"
                strokeWidth={isActive ? 2.5 : 2}
              />
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary" />
              )}
            </div>
            <span className="mt-0.5 text-[10px] leading-none tracking-tight">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}