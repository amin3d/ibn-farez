import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Poem } from "@/lib/poems";

interface Props {
  prev: Poem | null;
  next: Poem | null;
}

export default function PoemNavigation({ prev, next }: Props) {
  return (
    <div className="flex justify-between mt-8 gap-4">
      {prev ? (
        <Button asChild variant="outline">
          <Link href={`/poems/${prev.id}`}>→ {prev.title}</Link>
        </Button>
      ) : (
        <div />
      )}
      {next ? (
        <Button asChild variant="outline">
          <Link href={`/poems/${next.id}`}>{next.title} ←</Link>
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
}