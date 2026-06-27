"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Monitor, Moon, Sparkles, Sun, Type } from "lucide-react";
import { getStoredSettings, saveStoredSettings, defaultSettings } from "@/lib/settings";

const fontOptions = [
  { label: "کوچک", value: "90%", description: "برای خواندن سریع" },
  { label: "متوسط", value: "100%", description: "تعادل خوب" },
  { label: "بزرگ", value: "110%", description: "برای راحتی بیشتر" },
  { label: "خیلی بزرگ", value: "120%", description: "برای دید بهتر" },
];

const themeOptions = [
  { label: "روشن", value: "light", icon: Sun, description: "تم روشن و روشن‌تر" },
  { label: "تاریک", value: "dark", icon: Moon, description: "تم تاریک و کنتراست بالا" },
  { label: "سیستم", value: "system", icon: Monitor, description: "پیروی از تنظیمات دستگاه" },
];

function readStoredSettings(): SettingsState {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultSettings;
    }

    const parsed = JSON.parse(stored) as Partial<SettingsState>;
    return {
      fontSize: parsed.fontSize ?? defaultSettings.fontSize,
      theme: parsed.theme ?? defaultSettings.theme,
    };
  } catch {
    return defaultSettings;
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await getStoredSettings();
      if (!mounted) return;
      setSettings(stored);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const isDark = settings.theme === "dark" || (settings.theme === "system" && mediaQuery.matches);

    root.style.setProperty("--app-font-size", settings.fontSize);
    root.style.colorScheme = isDark ? "dark" : "light";
    root.classList.toggle("dark", isDark);
  }, [settings]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (settings.theme === "system") {
        document.documentElement.classList.toggle("dark", mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [settings.theme]);

  const updateSettings = (patch: Partial<typeof defaultSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      void saveStoredSettings(next);
      return next;
    });
  };

  return (
    <div className="space-y-5 pb-24">
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              تنظیمات دسترسی و خوانایی
            </div>
            <h1 className="text-2xl font-bold text-foreground">تنظیمات</h1>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              اندازه فونت و حالت نمایش را به سبک دلخواه خود تنظیم کنید تا مطالعه شعر برایتان راحت‌تر شود.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">بازگشت به خانه</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Type className="h-4 w-4 text-primary" />
              اندازه فونت
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              برای خوانایی بهتر، اندازه متن را بر اساس سلیقه خود انتخاب کنید.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {fontOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateSettings({ fontSize: option.value })}
                  aria-pressed={settings.fontSize === option.value}
                  className={`rounded-2xl border px-4 py-3 text-right text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                    settings.fontSize === option.value
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background/70 text-foreground hover:border-primary/40 hover:bg-accent"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{option.label}</span>
                    {settings.fontSize === option.value ? <Check className="h-4 w-4" /> : null}
                  </div>
                  <p className="mt-1 text-xs opacity-80">{option.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sun className="h-4 w-4 text-primary" />
              حالت نمایش
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              تم مورد علاقه خود را انتخاب کنید و در هر بازدید دوباره اعمال شود.
            </p>
            <div className="grid gap-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateSettings({ theme: option.value })}
                    aria-pressed={settings.theme === option.value}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-right text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                      settings.theme === option.value
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background/70 text-foreground hover:border-primary/40 hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                    <span className="text-xs opacity-80">{option.description}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle>پیش‌نمایش</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="leading-8 text-foreground" style={{ fontSize: settings.fontSize }}>
              «أحبُّكِ حُبًّا يَجعلُ الليلَ في العينِ مِصباحًا، ويفتحُ في القلبِ بابَ الرَّوْحِ.»
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-full bg-accent px-2.5 py-1">حجم فعلی: {settings.fontSize}</span>
            <span className="rounded-full bg-accent px-2.5 py-1">
              حالت فعلی: {themeOptions.find((option) => option.value === settings.theme)?.label ?? "سیستم"}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          این تنظیمات روی این دستگاه ذخیره می‌شود و در بازدیدهای بعدی دوباره استفاده می‌شود.
        </p>
        <Button asChild>
          <Link href="/">بازگشت به صفحه اصلی</Link>
        </Button>
      </div>
    </div>
  );
}
