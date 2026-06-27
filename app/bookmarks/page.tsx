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
    return <div className="text-center p-8">در حال بارگذاری...</div>;
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="w-5 h-5 text-yellow-500" />
        <h1 className="text-xl font-bold">نشانک‌های من</h1>
      </div>
      {bookmarkedPoems.length === 0 ? (
        <p className="text-center text-muted-foreground mt-8">
          هنوز شعری نشانک نکرده‌اید.
        </p>
      ) : (
        <div className="space-y-3">
          {bookmarkedPoems.map((poem) => (
            <Link key={poem.id} href={`/poems/${poem.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-r-4 border-r-yellow-400">
                <CardHeader>
                  <CardTitle>{poem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{poem.verses.length} بیت</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}