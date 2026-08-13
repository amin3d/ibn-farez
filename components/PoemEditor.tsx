"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  poems,
  getPoemTitle,
  getPoemSubtitle,
  type Poem,
  type Translation,
  type Verse,
} from "@/lib/poems";
import { DEV_POEM_API_BASE } from "@/lib/dev";
import { normalizeForSearch } from "@/lib/utils";

interface PoemEditorProps {
  poem: Poem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (poem: Poem) => void;
  initialVerseIndex?: number | null;
}

function clonePoem(poem: Poem): Poem {
  return structuredClone(poem);
}

function emptyTranslation(): Translation {
  return { lang: "fa", text: "", translator: "" };
}

function emptyVerse(): Verse {
  return { first: "", second: "", translations: [] };
}

export default function PoemEditor({
  poem,
  open,
  onOpenChange,
  onSaved,
  initialVerseIndex = null,
}: PoemEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<Poem>(() => clonePoem(poem));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [poemSearch, setPoemSearch] = useState("");
  const [verseSearch, setVerseSearch] = useState("");
  const [showPoemResults, setShowPoemResults] = useState(false);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
  };

  useEffect(() => {
    if (!open) return;

    setDraft(clonePoem(poem));
    setPoemSearch(getPoemTitle(poem));
    setVerseSearch("");
    setShowPoemResults(false);
    setError(null);

    if (initialVerseIndex === null) return;

    const timer = window.setTimeout(() => {
      const el = document.getElementById(`editor-verse-${initialVerseIndex}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [open, poem, initialVerseIndex]);

  const matchingPoems = useMemo(() => {
    const q = normalizeForSearch(poemSearch.trim());
    if (!q) return [];
    return poems
      .filter(
        (p) =>
          normalizeForSearch(getPoemTitle(p)).includes(q) ||
          normalizeForSearch(p.title).includes(q) ||
          normalizeForSearch(p.alias).includes(q) ||
          normalizeForSearch(p.id).includes(q)
      )
      .slice(0, 12);
  }, [poemSearch]);

  const visibleVerseIndices = useMemo(() => {
    const q = normalizeForSearch(verseSearch.trim());
    return draft.verses
      .map((verse, index) => ({ verse, index }))
      .filter(({ verse }) => {
        if (!q) return true;
        return (
          normalizeForSearch(verse.first).includes(q) ||
          normalizeForSearch(verse.second).includes(q) ||
          verse.translations.some(
            (t) =>
              normalizeForSearch(t.text).includes(q) ||
              normalizeForSearch(t.translator ?? "").includes(q)
          )
        );
      })
      .map(({ index }) => index);
  }, [draft.verses, verseSearch]);

  const selectPoem = useCallback((selected: Poem) => {
    setDraft(clonePoem(selected));
    setPoemSearch(getPoemTitle(selected));
    setVerseSearch("");
    setShowPoemResults(false);
    setError(null);
  }, []);

  const updateVerse = useCallback(
    (index: number, field: "first" | "second", value: string) => {
      setDraft((prev) => {
        const verses = [...prev.verses];
        verses[index] = { ...verses[index], [field]: value };
        return { ...prev, verses };
      });
    },
    []
  );

  const updateTranslation = useCallback(
    (
      verseIndex: number,
      transIndex: number,
      field: keyof Translation,
      value: string
    ) => {
      setDraft((prev) => {
        const verses = [...prev.verses];
        const verse = { ...verses[verseIndex] };
        const translations = [...verse.translations];
        translations[transIndex] = { ...translations[transIndex], [field]: value };
        verse.translations = translations;
        verses[verseIndex] = verse;
        return { ...prev, verses };
      });
    },
    []
  );

  const addTranslation = useCallback((verseIndex: number) => {
    setDraft((prev) => {
      const verses = [...prev.verses];
      const verse = { ...verses[verseIndex] };
      verse.translations = [...verse.translations, emptyTranslation()];
      verses[verseIndex] = verse;
      return { ...prev, verses };
    });
  }, []);

  const removeTranslation = useCallback(
    (verseIndex: number, transIndex: number) => {
      setDraft((prev) => {
        const verses = [...prev.verses];
        const verse = { ...verses[verseIndex] };
        verse.translations = verse.translations.filter((_, i) => i !== transIndex);
        verses[verseIndex] = verse;
        return { ...prev, verses };
      });
    },
    []
  );

  const addVerse = useCallback(() => {
    setDraft((prev) => ({ ...prev, verses: [...prev.verses, emptyVerse()] }));
  }, []);

  const removeVerse = useCallback((index: number) => {
    setDraft((prev) => ({
      ...prev,
      verses: prev.verses.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(
        `${DEV_POEM_API_BASE}/api/dev/poems/${encodeURIComponent(draft.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }
      );

      const data = (await res.json()) as { ok?: boolean; error?: string; poem?: Poem };

      if (!res.ok) {
        setError(data.error ?? "خطا در ذخیره");
        return;
      }

      if (data.poem) {
        onSaved(data.poem);
      }
      router.refresh();
      onOpenChange(false);
    } catch (err) {
      console.error("Poem save failed:", err);
      setError(
        "سرور ذخیره در دسترس نیست. dev server را متوقف و دوباره با npm run dev اجرا کنید."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        dir="rtl"
        closeButtonSide="left"
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto text-right"
        showCloseButton
      >
        <DialogHeader className="text-right items-start pr-10">
          <DialogTitle>ویرایش شعر</DialogTitle>
          <DialogDescription className="text-right">
            تغییرات مستقیماً در{" "}
            <code className="text-xs bg-muted px-1 rounded">poems.json</code>{" "}
            ذخیره می‌شود (فقط حالت dev)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* جستجوی شعر */}
          <div className="relative space-y-1">
            <span className="text-xs text-muted-foreground">انتخاب شعر</span>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                value={poemSearch}
                onChange={(e) => {
                  setPoemSearch(e.target.value);
                  setShowPoemResults(true);
                }}
                onFocus={() => setShowPoemResults(true)}
                onBlur={() => window.setTimeout(() => setShowPoemResults(false), 150)}
                placeholder="جستجو با نام، alias یا id…"
                className="pr-9 pl-9"
                dir="auto"
              />
              {poemSearch && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setPoemSearch(getPoemTitle(draft));
                    setShowPoemResults(false);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="پاک کردن جستجو"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {showPoemResults && matchingPoems.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-2xl border border-border bg-popover shadow-lg">
                {matchingPoems.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className={`w-full text-right px-3 py-2 text-sm hover:bg-muted transition-colors ${
                        p.id === draft.id ? "bg-secondary/10 text-secondary" : ""
                      }`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectPoem(p)}
                    >
                      <span className="font-medium">{getPoemTitle(p)}</span>
                      {getPoemSubtitle(p) && (
                        <span className="block text-xs text-muted-foreground truncate">
                          {getPoemSubtitle(p)}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* فیلتر ابیات */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">فیلتر ابیات</span>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                value={verseSearch}
                onChange={(e) => setVerseSearch(e.target.value)}
                placeholder="جستجو در مصرع‌ها و ترجمه‌ها…"
                className="pr-9 pl-9"
                dir="auto"
              />
              {verseSearch && (
                <button
                  type="button"
                  onClick={() => setVerseSearch("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="پاک کردن فیلتر"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {verseSearch && (
              <p className="text-xs text-muted-foreground">
                {visibleVerseIndices.length} بیت از {draft.verses.length}
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">نام / alias</span>
              <Input
                value={draft.alias}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, alias: e.target.value }))
                }
                placeholder="مثلاً ذالیه"
                dir="auto"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">عنوان عربی</span>
              <Input
                value={draft.title}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, title: e.target.value }))
                }
                dir="rtl"
              />
            </label>
          </div>

          {visibleVerseIndices.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-6">
              بیتی با این عبارت یافت نشد
            </p>
          ) : (
            <div className="space-y-4">
              {visibleVerseIndices.map((vi) => {
                const verse = draft.verses[vi];
                return (
                  <div
                    key={vi}
                    id={`editor-verse-${vi}`}
                    className={`rounded-2xl border p-4 space-y-3 ${
                      vi === initialVerseIndex
                        ? "border-secondary border-2 shadow-md"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        بیت {vi + 1}
                      </span>
                      {draft.verses.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeVerse(vi)}
                          aria-label={`حذف بیت ${vi + 1}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>

                    <label className="block space-y-1">
                      <span className="text-xs text-muted-foreground">مصرع اول</span>
                      <textarea
                        value={verse.first}
                        onChange={(e) => updateVerse(vi, "first", e.target.value)}
                        rows={2}
                        dir="rtl"
                        className="w-full rounded-2xl border border-input bg-input/30 px-3 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="text-xs text-muted-foreground">مصرع دوم</span>
                      <textarea
                        value={verse.second}
                        onChange={(e) => updateVerse(vi, "second", e.target.value)}
                        rows={2}
                        dir="rtl"
                        className="w-full rounded-2xl border border-input bg-input/30 px-3 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                      />
                    </label>

                    <div className="space-y-2 pt-1">
                      <span className="text-xs text-muted-foreground">ترجمه‌ها</span>
                      {verse.translations.map((t, ti) => (
                        <div
                          key={ti}
                          className="rounded-xl border border-dashed border-border p-3 space-y-2"
                        >
                          <div className="flex gap-2">
                            <Input
                              value={t.lang}
                              onChange={(e) =>
                                updateTranslation(vi, ti, "lang", e.target.value)
                              }
                              placeholder="زبان"
                              className="w-20 shrink-0"
                            />
                            <Input
                              value={t.translator ?? ""}
                              onChange={(e) =>
                                updateTranslation(vi, ti, "translator", e.target.value)
                              }
                              placeholder="نام مترجم"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => removeTranslation(vi, ti)}
                              aria-label="حذف ترجمه"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                          <textarea
                            value={t.text}
                            onChange={(e) =>
                              updateTranslation(vi, ti, "text", e.target.value)
                            }
                            rows={3}
                            placeholder="متن ترجمه"
                            dir="rtl"
                            className="w-full rounded-2xl border border-input bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTranslation(vi)}
                        className="gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        افزودن ترجمه
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Button type="button" variant="outline" onClick={addVerse} className="gap-1">
            <Plus className="w-4 h-4" />
            افزودن بیت
          </Button>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>

        <DialogFooter className="sm:flex-row-reverse sm:justify-start">
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "در حال ذخیره…" : "ذخیره در JSON"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={saving}
          >
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
