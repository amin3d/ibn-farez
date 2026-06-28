"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { searchPoems, savePoems } from "@/lib/db";
import { poems } from "@/lib/poems";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search as SearchIcon, X } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    savePoems(poems);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      searchPoems(query).then(setResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <>
      {/* هدر جستجو */}
      <div className="flex items-center gap-2 mb-4">
        <SearchIcon className="w-5 h-5 text-secondary" />
        <h1 className="text-xl font-bold text-foreground">جستجو در اشعار</h1>
      </div>

      {/* جعبه جستجوی بزرگ‌تر با دکمه پاک‌کن */}
      <div className="relative mb-6">
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="متن یا عنوان مورد نظر را وارد کنید..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pr-10 pl-10 py-6 text-base rounded-2xl border-border bg-background/80 focus:border-secondary focus:ring-2 focus:ring-secondary/50 transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="پاک کردن جستجو"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* نتایج جستجو */}
      <div className="space-y-3">
        {results.map((poem) => (
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
        {query.length > 1 && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">
              نتیجه‌ای برای "<span className="text-foreground font-medium">{query}</span>" یافت نشد
            </p>
            <p className="text-sm mt-1">عبارت دیگری را جستجو کنید</p>
          </div>
        )}
        {query.length > 1 && results.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            {results.length} شعر یافت شد
          </div>
        )}
      </div>
    </>
  );
}