"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { poems } from "@/lib/poems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Search, X } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  // فیلتر کردن اشعار بر اساس عنوان یا نام شاعر
  const filteredPoems = useMemo(() => {
    if (!searchQuery.trim()) return poems;
    const query = searchQuery.trim().toLowerCase();
    return poems.filter(
      (poem) =>
        poem.title.toLowerCase().includes(query) ||
        poem.poet.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // پاک کردن جستجو
  const clearSearch = () => setSearchQuery("");

  return (
    <>
      {/* هدر با جعبه جستجو */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground shrink-0">
          دیوان ابن الفارض
        </h1>

        {/* جعبه جستجو */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="جستجو در اشعار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-8 py-2 text-sm rounded-full border border-border bg-background/80 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="پاک کردن جستجو"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* لیست اشعار */}
      <div className="space-y-4">
        {filteredPoems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">نتیجه‌ای برای "<span className="text-foreground font-medium">{searchQuery}</span>" یافت نشد</p>
            <p className="text-sm mt-1">عبارت دیگری را جستجو کنید</p>
          </div>
        ) : (
          filteredPoems.map((poem) => (
            <Link key={poem.id} href={`/poems/${poem.id}`}>
              <Card className="hover:shadow-lg transition-all duration-200 border-r-4 border-r-secondary hover:scale-[1.01] group mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-secondary shrink-0" />
                    <span className="truncate">{poem.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{poem.poet}</p>
                  <span className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium border border-secondary/30">
                    {poem.verses.length} بیت
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* نمایش تعداد نتایج */}
      {searchQuery && filteredPoems.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground text-center">
          {filteredPoems.length} شعر یافت شد
        </div>
      )}
    </>
  );
}