"use client";

import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import { toggleMemorization, isInMemorizationList } from "@/lib/db";
import { Button } from "@/components/ui/button";

interface MemorizeButtonProps {
  poemId: string;
}

export default function MemorizeButton({ poemId }: MemorizeButtonProps) {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isInMemorizationList(poemId).then((result) => {
      setActive(result);
      setLoading(false);
    });
  }, [poemId]);

  const handleToggle = async () => {
    setLoading(true);
    const newState = await toggleMemorization(poemId);
    setActive(newState);
    setLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={loading}
      aria-label={active ? "حذف از لیست حفظ" : "افزودن به لیست حفظ"}
      title={active ? "حذف از لیست حفظ" : "افزودن به لیست حفظ"}
      className="text-2xl"
    >
      <Brain
        className={`w-6 h-6 transition-colors ${
          active ? "text-primary fill-primary/20" : "text-gray-400"
        }`}
      />
    </Button>
  );
}
