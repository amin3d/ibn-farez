"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBookmarkedPoems, savePoems } from "@/lib/db";
import { poems } from "@/lib/poems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark } from "lucide-react";

export default function BookmarksPage() {
  const [bookmarkedPoems, setBookmarkedPoems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    savePoems(poems).then(() => {
      getBookmarkedPoems().then((result) => {
        setBookmarkedPoems(result);
        setLoading(false);
      });
    });
  }, []);

  if (loading) {
    return <div className="text-center p-8 text-muted-foreground">در حال بارگذاری...</div>;
  }

  return (
    <>
      {/* هدر */}
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="w-5 h-5 text-secondary" />
        <h1 className="text-xl font-bold text-foreground">نشانک‌های من</h1>
      </div>

      {/* لیست نشانک‌ها */}
      {bookmarkedPoems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Bookmark className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-lg">هنوز شعری نشانک نکرده‌اید.</p>
          <p className="text-sm mt-1">با کلیک روی آیکن نشانک در صفحهٔ هر شعر، آن را ذخیره کنید.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarkedPoems.map((poem) => (
            <Link key={poem.id} href={`/poems/${poem.id}`}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-r-4 border-r-secondary hover:border-r-secondary-dark hover:scale-[1.01]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground">{poem.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{poem.poet}</p>
                  <span className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium border border-secondary/30">
                    {poem.verses.length} بیت
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
          {/* نمایش تعداد کل نشانک‌ها */}
          <div className="mt-4 text-sm text-muted-foreground text-center">
            {bookmarkedPoems.length} شعر نشانک شده
          </div>
        </div>
      )}
    </>
  );
}