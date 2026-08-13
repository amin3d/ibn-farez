import { getPoem, poems } from "@/lib/poems";
import MemorizationSessionClient from "./MemorizationSessionClient";

export async function generateStaticParams() {
  return poems.map((p) => ({ id: p.id.toString() }));
}

export default async function MemorizationPoemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const poem = getPoem(id);

  if (!poem) {
    return <div className="text-center p-8">شعر یافت نشد</div>;
  }

  return <MemorizationSessionClient poem={poem} />;
}
