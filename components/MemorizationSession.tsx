"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Poem, getPoemTitle, getPoemSubtitle } from "@/lib/poems";
import { getStoredSettings, SettingsState, defaultSettings } from "@/lib/settings";
import { updateMemorizationProgress } from "@/lib/db";
import { getRevealPhase, getVerseHint } from "@/lib/memorization";
import { cn } from "@/lib/utils";

interface MemorizationSessionProps {
  poem: Poem;
  initialVerseIndex?: number;
}

export default function MemorizationSession({
  poem,
  initialVerseIndex = 0,
}: MemorizationSessionProps) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const clampedInitial = Math.min(
    Math.max(0, initialVerseIndex),
    Math.max(0, poem.verses.length - 1)
  );
  const [verseIndex, setVerseIndex] = useState(clampedInitial);
  const [elapsed, setElapsed] = useState(0);
  const [manualReveal, setManualReveal] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const autoAdvanceTimer = useRef<number | null>(null);

  const totalVerses = poem.verses.length;
  const verse = poem.verses[verseIndex];
  const subtitle = getPoemSubtitle(poem);

  useEffect(() => {
    getStoredSettings().then(setSettings);
  }, []);

  const resetVerseTimer = useCallback(() => {
    setElapsed(0);
    setManualReveal(false);
    setSessionKey((k) => k + 1);
    if (autoAdvanceTimer.current !== null) {
      window.clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }, []);

  const goToVerse = useCallback(
    (index: number) => {
      const next = Math.min(Math.max(0, index), totalVerses - 1);
      setVerseIndex(next);
      resetVerseTimer();
      void updateMemorizationProgress(poem.id, next);
    },
    [poem.id, resetVerseTimer, totalVerses]
  );

  const phase = useMemo(() => {
    if (manualReveal) return "revealed" as const;
    return getRevealPhase(
      elapsed,
      settings.memorizationHintDelay,
      settings.memorizationRevealDelay
    );
  }, [
    elapsed,
    manualReveal,
    settings.memorizationHintDelay,
    settings.memorizationRevealDelay,
  ]);

  const hint = verse ? getVerseHint(verse.first) : "";
  const progressPercent = Math.min(
    100,
    (elapsed / settings.memorizationRevealDelay) * 100
  );
  const hintPercent = Math.min(
    100,
    (settings.memorizationHintDelay / settings.memorizationRevealDelay) * 100
  );

  useEffect(() => {
    if (phase === "revealed") return;
    const interval = window.setInterval(() => {
      setElapsed((current) => current + 0.1);
    }, 100);
    return () => window.clearInterval(interval);
  }, [phase, sessionKey]);

  useEffect(() => {
    if (phase !== "revealed" || !settings.memorizationAutoAdvance) return;
    if (verseIndex >= totalVerses - 1) return;

    autoAdvanceTimer.current = window.setTimeout(() => {
      goToVerse(verseIndex + 1);
    }, settings.memorizationAutoAdvanceDelay * 1000);

    return () => {
      if (autoAdvanceTimer.current !== null) {
        window.clearTimeout(autoAdvanceTimer.current);
        autoAdvanceTimer.current = null;
      }
    };
  }, [
    phase,
    verseIndex,
    totalVerses,
    settings.memorizationAutoAdvance,
    settings.memorizationAutoAdvanceDelay,
    goToVerse,
  ]);

  if (!verse) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        این شعر بیت ندارد.
      </div>
    );
  }

  const remainingSeconds = Math.max(
    0,
    Math.ceil(settings.memorizationRevealDelay - elapsed)
  );

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/memorization"
          className="text-secondary hover:text-secondary-dark flex items-center gap-1 transition-colors text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          لیست حفظ
        </Link>
        <Link
          href={`/poems/${poem.id}`}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          مشاهدهٔ شعر
        </Link>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-foreground">{getPoemTitle(poem)}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        <p className="text-xs text-muted-foreground">
          بیت {verseIndex + 1} از {totalVerses}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {phase === "revealed"
              ? "بیت نمایش داده شد"
              : phase === "hint"
                ? "راهنما فعال است"
                : "تلاش برای یادآوری…"}
          </span>
          {phase !== "revealed" && (
            <span dir="ltr">{remainingSeconds} ث</span>
          )}
        </div>
        <div className="relative h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="absolute inset-y-0 right-0 bg-secondary/30 transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-secondary/60"
            style={{ right: `${100 - hintPercent}%` }}
            title="زمان راهنما"
          />
        </div>
      </div>

      <Card className="border-primary/20 shadow-md overflow-hidden">
        <CardContent className="p-6 space-y-4 min-h-[220px] flex flex-col justify-center">
          {phase === "hidden" && (
            <div className="space-y-4 text-center">
              <div
                className="space-y-3 select-none pointer-events-none"
                aria-hidden
              >
                <p className="text-lg font-medium text-foreground blur-md">
                  {verse.first}
                </p>
                <p className="text-lg font-medium text-foreground blur-md">
                  {verse.second}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                بیت را در ذهن مرور کنید…
              </p>
            </div>
          )}

          {phase === "hint" && (
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs text-secondary">
                <Lightbulb className="w-3.5 h-3.5" />
                راهنما
              </div>
              <p className="text-lg font-medium text-foreground">{hint}</p>
              <div
                className="space-y-2 select-none pointer-events-none opacity-40"
                aria-hidden
              >
                <p className="text-base blur-sm">{verse.first}</p>
                <p className="text-base blur-sm">{verse.second}</p>
              </div>
            </div>
          )}

          {phase === "revealed" && (
            <div className="space-y-3 text-center animate-in fade-in duration-300">
              <p className="text-lg font-medium text-foreground">{verse.first}</p>
              <p className="text-lg font-medium text-foreground">{verse.second}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {phase !== "revealed" && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setManualReveal(true)}
            className="gap-1.5"
          >
            <Eye className="w-4 h-4" />
            نمایش بیت
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={resetVerseTimer}
          className="gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          از نو
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToVerse(verseIndex - 1)}
          disabled={verseIndex === 0}
          aria-label="بیت قبلی"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        <div className="flex-1 flex justify-center gap-1 overflow-x-auto px-2 py-1">
          {poem.verses.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToVerse(i)}
              aria-label={`بیت ${i + 1}`}
              aria-current={i === verseIndex ? "step" : undefined}
              className={cn(
                "shrink-0 w-2 h-2 rounded-full transition-all",
                i === verseIndex
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToVerse(verseIndex + 1)}
          disabled={verseIndex >= totalVerses - 1}
          aria-label="بیت بعدی"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      {phase === "revealed" &&
        settings.memorizationAutoAdvance &&
        verseIndex < totalVerses - 1 && (
          <p className="text-center text-xs text-muted-foreground">
            {settings.memorizationAutoAdvanceDelay} ثانیه دیگر بیت بعدی نمایش داده
            می‌شود
          </p>
        )}
    </div>
  );
}
