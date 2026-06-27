"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { toggleBookmark, isBookmarked } from "@/lib/db";
import { Button } from "@/components/ui/button";

interface BookmarkButtonProps {
  poemId: string;
}

export default function BookmarkButton({ poemId }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isBookmarked(poemId).then((result) => {
      setBookmarked(result);
      setLoading(false);
    });
  }, [poemId]);

  const handleToggle = async () => {
    setLoading(true);
    const newState = await toggleBookmark(poemId);
    setBookmarked(newState);
    setLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={loading}
      className="text-2xl"
    >
      <Bookmark
        className={`w-6 h-6 transition-colors ${
          bookmarked ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
        }`}
      />
    </Button>
  );
}