import poemsData from "@/public/data/poems.json";
export interface Translation {
  lang: string;   // مثلاً "fa"
  text: string;   // متن ترجمه
  translator?: string; // نام مترجم
}
export interface Verse {
  first: string;
  second: string;
  translations:Translation[];
}

export interface Poem {
  id: string;
  title: string;
  alias: string;
  poet: string;
  verses: Verse[];
}

export const poems: Poem[] = poemsData as Poem[];

export const getPoemTitle = (poem: Poem): string => {
  const alias = poem.alias?.trim();
  if (alias) return alias;
  const firstLine = poem.verses[0]?.first?.trim();
  if (firstLine) return firstLine;
  return poem.title;
};

/** زیرعنوان (عنوان عربی) — فقط وقتی alias دارد */
export const getPoemSubtitle = (poem: Poem): string | undefined => {
  const alias = poem.alias?.trim();
  return alias ? poem.title : undefined;
};

export const verseHasTranslation = (verse: Verse): boolean =>
  verse.translations?.some((t) => t.text.trim().length > 0) ?? false;

export const getPoem = (id: string): Poem | undefined => {
  return poems.find((p) => p.id === id);
};

export const getAdjacentPoems = (id: string) => {
  const index = poems.findIndex((p) => p.id === id);
  return {
    prev: index > 0 ? poems[index - 1] : null,
    next: index < poems.length - 1 ? poems[index + 1] : null,
  };
};