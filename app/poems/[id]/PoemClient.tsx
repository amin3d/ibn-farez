"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import PoemNavigation from "@/components/PoemNavigation";
import BookmarkButton from "@/components/BookmarkButton";
import MemorizeButton from "@/components/MemorizeButton";
import PoemEditor from "@/components/PoemEditor";
import { Button } from "@/components/ui/button";
import { ArrowRight, Languages, Pencil, Search, X } from "lucide-react";
import {
  Poem,
  getPoemTitle,
  getPoemSubtitle,
  verseHasTranslation,
} from "@/lib/poems";
import { getSearchSession } from "@/lib/db";
import { isDevEditorEnabled } from "@/lib/dev";

interface PoemClientProps {
  poem: Poem;
  prev: Poem | null;
  next: Poem | null;
}

export default function PoemClient({ poem, prev, next }: PoemClientProps) {
  const devEditor = isDevEditorEnabled();
  const [savedOverride, setSavedOverride] = useState<Poem | null>(null);
  const poemData =
    savedOverride && savedOverride.id === poem.id ? savedOverride : poem;
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [showTranslatedOnly, setShowTranslatedOnly] = useState(false);
  const [fromSearch, setFromSearch] = useState(false);
  const [focusVerse, setFocusVerse] = useState<number | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorVerseIndex, setEditorVerseIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from") === "search";
    const verseParam = params.get("verse");
    const verseIndex =
      verseParam !== null && verseParam !== ""
        ? Number.parseInt(verseParam, 10)
        : NaN;

    if (from) {
      setFromSearch(true);
      void getSearchSession().then((session) => {
        if (!session?.query) setFromSearch(false);
      });
    }

    if (Number.isInteger(verseIndex) && verseIndex >= 0 && verseIndex < poemData.verses.length) {
      setFocusVerse(verseIndex);
      setSelectedVerse(verseIndex);
    }
  }, [poemData.verses.length]);

  useEffect(() => {
    if (focusVerse === null) return;
    const el = document.getElementById(`verse-${focusVerse}`);
    if (!el) return;
    const timer = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [focusVerse, showTranslatedOnly]);

  const visibleVerses = useMemo(() => {
    const indexed = poemData.verses.map((verse, index) => ({ verse, index }));
    if (!showTranslatedOnly) return indexed;
    return indexed.filter(({ verse }) => verseHasTranslation(verse));
  }, [poemData.verses, showTranslatedOnly]);

  const subtitle = getPoemSubtitle(poemData);

  const openEditor = (verseIndex: number | null = null) => {
    setEditorVerseIndex(verseIndex);
    setEditorOpen(true);
  };

  const handleVerseClick = (index: number, isSelected: boolean) => {
    if (devEditor && editMode) {
      openEditor(index);
      return;
    }
    setSelectedVerse(isSelected ? null : index);
  };

  return (
    <>
      {/* هدر با دکمه بازگشت، فیلتر ترجمه و نشانک */}
      <div className="flex items-center justify-between mb-4">
        {fromSearch ? (
          <Link
            href="/search"
            className="text-secondary hover:text-secondary-dark flex items-center gap-1 transition-colors"
          >
            <Search className="w-4 h-4" />
            بازگشت به نتایج جستجو
          </Link>
        ) : (
          <Link
            href="/"
            className="text-secondary hover:text-secondary-dark flex items-center gap-1 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت
          </Link>
        )}
        <div className="flex items-center gap-1">
          {devEditor && (
            <Button
              variant={editMode ? "secondary" : "ghost"}
              size="icon"
              onClick={() => {
                setEditMode((current) => {
                  if (current) {
                    setEditorOpen(false);
                    setEditorVerseIndex(null);
                  }
                  return !current;
                });
              }}
              aria-label={editMode ? "خروج از حالت ویرایش" : "ورود به حالت ویرایش"}
              aria-pressed={editMode}
              title={editMode ? "خروج از حالت ویرایش" : "ویرایش شعر (dev)"}
              className={editMode ? "" : "text-secondary"}
            >
              <Pencil className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowTranslatedOnly((current) => !current);
              setSelectedVerse(null);
            }}
            aria-pressed={showTranslatedOnly}
            aria-label={
              showTranslatedOnly
                ? "نمایش همهٔ ابیات"
                : "فقط ابیات ترجمه‌شده"
            }
            title={
              showTranslatedOnly
                ? "نمایش همهٔ ابیات"
                : "فقط ابیات ترجمه‌شده"
            }
            className="text-2xl"
          >
            <Languages
              className={`w-6 h-6 transition-colors ${
                showTranslatedOnly ? "text-secondary" : "text-gray-400"
              }`}
            />
          </Button>
          <MemorizeButton poemId={poemData.id} />
          <BookmarkButton poemId={poemData.id} />
        </div>
      </div>

      {/* عنوان و نام شاعر */}
      <h1
        className={`text-2xl font-bold mb-1 text-center text-foreground ${
          devEditor && editMode
            ? "cursor-pointer hover:text-secondary transition-colors"
            : ""
        }`}
        onClick={devEditor && editMode ? () => openEditor(null) : undefined}
        title={devEditor && editMode ? "کلیک برای ویرایش" : undefined}
      >
        {getPoemTitle(poemData)}
      </h1>
      {subtitle && (
        <p className="text-muted-foreground text-center mb-1">{subtitle}</p>
      )}
      <p className="text-muted-foreground text-center mb-6">سراینده: {poemData.poet}</p>

      {devEditor && editMode && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <p className="text-xs text-secondary/90">
            حالت ویرایش — روی هر بیت کلیک کنید
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditMode(false);
              setEditorOpen(false);
              setEditorVerseIndex(null);
            }}
            className="h-7 gap-1 text-xs"
          >
            <X className="w-3 h-3" />
            خروج
          </Button>
        </div>
      )}

      {/* ابیات */}
      {visibleVerses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Languages className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-lg">این شعر بیت ترجمه‌شده‌ای ندارد</p>
          <p className="text-sm mt-1">برای دیدن همهٔ ابیات، فیلتر ترجمه را خاموش کنید</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleVerses.map(({ verse, index }) => {
            const isSelected = selectedVerse === index;
            const isFocused = focusVerse === index;
            const showTranslation =
              showTranslatedOnly || (!editMode && isSelected);

            return (
              <Card
                key={index}
                id={`verse-${index}`}
                className={`p-4 transition-all ${
                  devEditor && editMode
                    ? "cursor-pointer hover:shadow-md hover:border-secondary/50 border-dashed"
                    : "cursor-pointer hover:shadow-md"
                } ${
                  isSelected || isFocused
                    ? "border-secondary border-2 shadow-md"
                    : "border-border hover:border-secondary/50"
                }`}
                onClick={() => handleVerseClick(index, isSelected)}
              >
                <CardContent className="p-0 space-y-1">
                  <p className="text-lg text-center font-medium text-foreground">
                    {verse.first}
                  </p>
                  <p className="text-lg text-center font-medium text-foreground">
                    {verse.second}
                  </p>

                  {showTranslation && (
                    <div className="mt-3 pt-3 border-t border-muted space-y-2">
                      {verseHasTranslation(verse) ? (
                        verse.translations.map((t, i) => (
                          <div key={i} className="text-center space-y-0.5">
                            {t.translator?.trim() && (
                              <p className="text-xs text-secondary/80">
                                {t.translator.trim()}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">{t.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center">
                          ترجمه‌ای برای این بیت موجود نیست
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ناوبری بین اشعار */}
      <PoemNavigation prev={prev} next={next} />

      {devEditor && (
        <PoemEditor
          poem={poemData}
          open={editorOpen}
          onOpenChange={(next) => {
            setEditorOpen(next);
            if (!next) setEditorVerseIndex(null);
          }}
          onSaved={setSavedOverride}
          initialVerseIndex={editorVerseIndex}
        />
      )}
    </>
  );
}
