import Link from "next/link";
import { poems } from "@/lib/poems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">دیوان ابن الفارض</h1>
        <Link
          href="/settings"
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
        >
          باز کردن تنظیمات
        </Link>
      </div>
      <div className="space-y-4">
        {poems.map((poem) => (
          <Link key={poem.id} href={`/poems/${poem.id}`}>
            <Card className="hover:shadow-lg transition-all duration-200 border-r-4 border-r-blue-500 hover:scale-[1.01]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="truncate">{poem.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {poem.verses.length} بیت | {poem.poet}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}