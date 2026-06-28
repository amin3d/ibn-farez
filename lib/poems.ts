import poemsData from "@/public/data/poems.json";
export interface Translation {
  lang: string;   // مثلاً "fa"
  text: string;   // متن ترجمه
}
export interface Verse {
  first: string;
  second: string;
  translations:Translation[];
}

export interface Poem {
  id: string;
  title: string;
  poet: string;
  verses: Verse[];
}

export const poems: Poem[] = poemsData;

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