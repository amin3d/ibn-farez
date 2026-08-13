"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brain } from "lucide-react";
import MemorizationSession from "@/components/MemorizationSession";
import { Button } from "@/components/ui/button";
import { getMemorizationEntry, isInMemorizationList } from "@/lib/db";
import { Poem } from "@/lib/poems";

interface MemorizationSessionClientProps {
  poem: Poem;
}

export default function MemorizationSessionClient({
  poem,
}: MemorizationSessionClientProps) {
  const [status, setStatus] = useState<"loading" | "denied" | "ready">("loading");
  const [initialVerse, setInitialVerse] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const inList = await isInMemorizationList(poem.id);
      if (cancelled) return;

      if (!inList) {
        setStatus("denied");
        return;
      }

      const entry = await getMemorizationEntry(poem.id);
      if (cancelled) return;

      if (entry?.lastVerseIndex !== undefined) {
        setInitialVerse(entry.lastVerseIndex);
      }
      setStatus("ready");
    })();

    return () => {
      cancelled = true;
    };
  }, [poem.id]);

  if (status === "loading") {
    return (
      <div className="text-center p-8 text-muted-foreground">
        در حال بارگذاری...
      </div>
    );
  }

  if (status === "denied") {
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

  return (
    <MemorizationSession
      key={`${poem.id}-${initialVerse}`}
      poem={poem}
      initialVerseIndex={initialVerse}
    />
  );
}
