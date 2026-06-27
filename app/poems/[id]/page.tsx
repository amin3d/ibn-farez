"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPoem, getAdjacentPoems } from "@/lib/poems";
import { Card, CardContent } from "@/components/ui/card";
import PoemNavigation from "@/components/PoemNavigation";
import BookmarkButton from "@/components/BookmarkButton";
import { ArrowRight } from "lucide-react";

export default function PoemPage() {
  const { id } = useParams();
  const poem = getPoem(id as string);
  const { prev, next } = getAdjacentPoems(id as string);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  if (!poem) {
    return <div className="text-center p-8">شعر یافت نشد</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="text-blue-600 hover:underline flex items-center gap-1">
          <ArrowRight className="w-4 h-4" />
          بازگشت
        </Link>
        <BookmarkButton poemId={poem.id} />
      </div>

      <h1 className="text-2xl font-bold mb-1 text-center">{poem.title}</h1>
      <p className="text-muted-foreground text-center mb-6">سراینده: {poem.poet}</p>

      <div className="space-y-4">
        {poem.verses.map((verse, index) => (
          <Card
            key={index}
            className={`p-4 cursor-pointer hover:shadow-md transition-all ${
              selectedVerse === index ? "border-blue-400 border-2" : ""
            }`}
            onClick={() => setSelectedVerse(selectedVerse === index ? null : index)}
          >
            <CardContent className="p-0 space-y-1">
              <p className="text-lg text-center font-medium">{verse.first}</p>
              <p className="text-lg text-center font-medium">{verse.second}</p>

              {selectedVerse === index && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
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

      <PoemNavigation prev={prev} next={next} />
    </>
  );
}