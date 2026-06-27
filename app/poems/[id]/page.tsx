// app/poems/[id]/page.tsx
import { getPoem, getAdjacentPoems, poems } from "@/lib/poems";
import PoemClient from "./PoemClient";

export async function generateStaticParams() {
  return poems.map(p => ({ id: p.id.toString() }));
}

// دقت کنید که تابع async شده است و تایپ params تغییر کرده
export default async function PoemPage({ params }: { params: Promise<{ id: string }> }) {
  // منتظر می‌مانیم تا params آماده شود
  const resolvedParams = await params;
  
  // آیدی را پاس می‌دهیم (اگر lib شما استرینگ می‌گیرد همان resolvedParams.id را پاس دهید)
  const idToSearch = resolvedParams.id; // یا Number(resolvedParams.id)
  
  const poem = getPoem(idToSearch);
  const { prev, next } = getAdjacentPoems(idToSearch);

  if (!poem) {
    return <div className="text-center p-8">شعر یافت نشد</div>;
  }

  return <PoemClient poem={poem} prev={prev} next={next} />;
}