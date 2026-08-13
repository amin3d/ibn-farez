"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  searchPoems,
  savePoems,
  saveSearchSession,
  getSearchSession,
  clearSearchSession,
  type SearchResult,
} from "@/lib/db";
import { poems } from "@/lib/poems";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search as SearchIcon, X } from "lucide-react";

function poemHref(result: SearchResult) {
  const params = new URLSearchParams({ from: "search" });
  if (result.verseIndex !== null) {
    params.set("verse", String(result.verseIndex));
  }
  return `/poems/${result.poemId}?${params.toString()}`;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [ready, setReady] = useState(false);
  const skipPersist = useRef(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await savePoems(poems);
      const session = await getSearchSession();
      if (cancelled) return;
      if (session?.query) {
        setQuery(session.query);
        setResults(session.results ?? []);
      }
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    if (query.length <= 1) {
      setResults([]);
      if (!skipPersist.current) {
        void clearSearchSession();
      }
      skipPersist.current = false;
      return;
    }

    let cancelled = false;

    searchPoems(query).then((found) => {
      if (cancelled) return;
      setResults(found);
      void saveSearchSession({ query, results: found });
    });

    skipPersist.current = false;

    return () => {
      cancelled = true;
    };
  }, [query, ready]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    void clearSearchSession();
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
          placeholder="متن بیت، عنوان یا نام شعر را وارد کنید..."
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

      {/* نتایج جستجو — بیت‌ها */}
      <div className="space-y-3">
        {results.map((result) => {
          const key =
            result.verseIndex === null
              ? `${result.poemId}-title`
              : `${result.poemId}-${result.verseIndex}`;

          return (
            <Link key={key} href={poemHref(result)}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-r-4 border-r-secondary hover:border-r-secondary-dark hover:scale-[1.01]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-foreground flex items-center justify-between gap-2">
                    <span>{result.poemTitle}</span>
                    {result.verseIndex !== null && (
                      <span className="shrink-0 bg-secondary/20 text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs font-medium border border-secondary/30">
                        بیت {result.verseIndex + 1}
                      </span>
                    )}
                  </CardTitle>
                  {result.poemSubtitle && (
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {result.poemSubtitle}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-1">
                  {result.verseIndex !== null ? (
                    <>
                      <p className="text-sm text-center text-foreground leading-relaxed">
                        {result.first}
                      </p>
                      <p className="text-sm text-center text-foreground leading-relaxed">
                        {result.second}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      مطابقت در عنوان شعر
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground pt-2">{result.poet}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {query.length > 1 && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">
              نتیجه‌ای برای &quot;
              <span className="text-foreground font-medium">{query}</span>
              &quot; یافت نشد
            </p>
            <p className="text-sm mt-1">عبارت دیگری را جستجو کنید</p>
          </div>
        )}
        {query.length > 1 && results.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            {results.length} نتیجه یافت شد
          </div>
        )}
      </div>
    </>
  );
}
