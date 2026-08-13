"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brain } from "lucide-react";
import MemorizationSession from "@/components/MemorizationSession";
import { Button } from "@/components/ui/button";
import { isInMemorizationList, getMemorizationEntries } from "@/lib/db";
import { Poem } from "@/lib/poems";

interface MemorizationSessionClientProps {
  poem: Poem;
}

export default function MemorizationSessionClient({
  poem,
}: MemorizationSessionClientProps) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [initialVerse, setInitialVerse] = useState(0);

  useEffect(() => {
    void (async () => {
      const inList = await isInMemorizationList(poem.id);
      setAllowed(inList);
      if (inList) {
        const entries = await getMemorizationEntries();
        const entry = entries.find((e) => e.poemId === poem.id);
        if (entry?.lastVerseIndex !== undefined) {
          setInitialVerse(entry.lastVerseIndex);
        }
      }
    })();
  }, [poem.id]);

  if (allowed === null) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        در حال بارگذاری...
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="text-center py-16 space-y-4">
        <Brain className="w-12 h-12 mx-auto text-muted-foreground/40" />
        <p className="text-lg text-muted-foreground">
          این شعر در لیست حفظ شما نیست.
        </p>
        <p className="text-sm text-muted-foreground">
          ابتدا از صفحهٔ شعر آن را به لیست حفظ اضافه کنید.
        </p>
        <Button asChild>
          <Link href={`/poems/${poem.id}`}>رفتن به صفحهٔ شعر</Link>
        </Button>
      </div>
    );
  }

  return <MemorizationSession poem={poem} initialVerseIndex={initialVerse} />;
}
