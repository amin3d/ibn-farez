"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Brain, Play } from "lucide-react";
import { getMemorizationPoems, savePoems } from "@/lib/db";
import { poems, getPoemTitle, getPoemSubtitle } from "@/lib/poems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MemorizationItem = Awaited<ReturnType<typeof getMemorizationPoems>>[number];

export default function MemorizationPage() {
  const [items, setItems] = useState<MemorizationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    savePoems(poems).then(() => {
      getMemorizationPoems().then((result) => {
        setItems(result);
        setLoading(false);
      });
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <>
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-5 shadow-sm mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">حفظ اشعار</h1>
        </div>
        <p className="text-sm text-muted-foreground leading-6">
          اشعار دلخواه را به این لیست اضافه کنید و بیت‌به‌بیت با راهنمای
          زمان‌دار تمرین حفظ کنید.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Brain className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-lg">هنوز شعری برای حفظ اضافه نکرده‌اید.</p>
          <p className="text-sm mt-1 max-w-sm mx-auto">
            در صفحهٔ هر شعر روی آیکن مغز کلیک کنید تا به لیست حفظ اضافه شود.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/">رفتن به فهرست اشعار</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(({ poem, entry }) => {
            const resumeIndex = entry.lastVerseIndex ?? 0;
            const progress =
              poem.verses.length > 0
                ? Math.round(((resumeIndex + 1) / poem.verses.length) * 100)
                : 0;

            return (
              <Card
                key={poem.id}
                className="border-r-4 border-r-primary/60 shadow-sm"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground text-lg">
                    {getPoemTitle(poem)}
                  </CardTitle>
                  {getPoemSubtitle(poem) && (
                    <p className="text-sm text-muted-foreground truncate">
                      {getPoemSubtitle(poem)}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{poem.poet}</span>
                    <span>{poem.verses.length} بیت</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>آخرین موقعیت</span>
                      <span>
                        بیت {Math.min(resumeIndex + 1, poem.verses.length)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary/70 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <Button asChild className="w-full gap-2">
                    <Link href={`/memorization/${poem.id}`}>
                      <Play className="w-4 h-4" />
                      {entry.lastVerseIndex ? "ادامهٔ حفظ" : "شروع حفظ"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          <p className="text-sm text-muted-foreground text-center pt-2">
            {items.length} شعر در لیست حفظ
          </p>
        </div>
      )}
    </>
  );
}
