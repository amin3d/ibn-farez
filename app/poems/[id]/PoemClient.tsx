"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import PoemNavigation from "@/components/PoemNavigation";
import BookmarkButton from "@/components/BookmarkButton";
import { ArrowRight } from "lucide-react";
import { Poem } from "@/lib/poems";

interface PoemClientProps {
  poem: Poem;
  prev: Poem | null;
  next: Poem | null;
}

export default function PoemClient({ poem, prev, next }: PoemClientProps) {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  return (
    <>
      {/* هدر با دکمه بازگشت و نشانک */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="text-secondary hover:text-secondary-dark flex items-center gap-1 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت
        </Link>
        <BookmarkButton poemId={poem.id} />
      </div>

      {/* عنوان و نام شاعر */}
      <h1 className="text-2xl font-bold mb-1 text-center text-foreground">
        {poem.title}
      </h1>
      <p className="text-muted-foreground text-center mb-6">سراینده: {poem.poet}</p>

      {/* ابیات */}
      <div className="space-y-4">
        {poem.verses.map((verse, index) => (
          <Card
            key={index}
            className={`p-4 cursor-pointer hover:shadow-md transition-all ${
              selectedVerse === index
                ? "border-secondary border-2 shadow-md"
                : "border-border hover:border-secondary/50"
            }`}
            onClick={() => setSelectedVerse(selectedVerse === index ? null : index)}
          >
            <CardContent className="p-0 space-y-1">
              <p className="text-lg text-center font-medium text-foreground">
                {verse.first}
              </p>
              <p className="text-lg text-center font-medium text-foreground">
                {verse.second}
              </p>

              {/* نمایش ترجمه در صورت کلیک */}
              {selectedVerse === index && (
                <div className="mt-3 pt-3 border-t border-muted space-y-1">
                  {verse.translations && verse.translations.length > 0 ? (
                    verse.translations.map((t, i) => (
                      <p key={i} className="text-sm text-muted-foreground text-center">
                        {t.text}
                      </p>
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
        ))}
      </div>

      {/* ناوبری بین اشعار */}
      <PoemNavigation prev={prev} next={next} />
    </>
  );
}