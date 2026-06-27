"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { searchPoems, savePoems } from "@/lib/db";
import { poems } from "@/lib/poems";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search as SearchIcon } from "lucide-react";

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

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <SearchIcon className="w-5 h-5 text-gray-400" />
        <h1 className="text-xl font-bold">جستجو در اشعار</h1>
      </div>
      <Input
        placeholder="متن یا عنوان مورد نظر را وارد کنید..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4"
      />
      <div className="space-y-3">
        {results.map((poem) => (
          <Link key={poem.id} href={`/poems/${poem.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-r-4 border-r-blue-400">
              <CardHeader>
                <CardTitle>{poem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{poem.verses.length} بیت</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {query.length > 1 && results.length === 0 && (
          <p className="text-center text-muted-foreground">نتیجه‌ای یافت نشد</p>
        )}
      </div>
    </>
  );
}