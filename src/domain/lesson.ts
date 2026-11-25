export const CATEGORIES = [
  { slug: "parasha", name: "Porção Semanal da Torá", description: "A parashá de cada semana, estudada em profundidade." },
  { slug: "fundamentos", name: "Fundamentos do judaísmo", description: "Fé, mitsvot e os primeiros passos na vida judaica." },
  { slug: "shabat-e-halacha", name: "Shabat e Halachá", description: "A prática diária: Shabat, kashrut, luto e ciclo da vida." },
  { slug: "festas", name: "Festas judaicas", description: "O calendário sagrado, de Rosh Hashaná a Shavuot." },
  { slug: "tefila", name: "Tefilá", description: "Sidur, orações e selichot." },
  { slug: "tanach", name: "Tanach", description: "Torá, Profetas e Escritos." },
  { slug: "talmud-e-sabios", name: "Talmud e Sábios", description: "Talmud, Pirkei Avot e os grandes mestres." },
  { slug: "cabala", name: "Cabalá e mistérios", description: "A dimensão interior da Torá." },
  { slug: "hebraico", name: "Hebraico", description: "Alfabetização e a língua sagrada." },
  { slug: "bnei-anussim", name: "Bnei Anussim", description: "Memória, retorno e o Brasil judaico." },
  { slug: "conversao", name: "Conversão", description: "O caminho de entrada no povo judeu." },
  { slug: "judaismo-e-cristianismo", name: "Judaísmo e cristianismo", description: "Diferenças de fé à luz das fontes judaicas." },
  { slug: "musica", name: "Música judaica", description: "Cantos, louvores e melodias." },
  { slug: "israel", name: "Israel e atualidade", description: "Israel, antissemitismo e o mundo de hoje." },
  { slug: "geral", name: "Outros temas", description: "Conversas, entrevistas e temas diversos." },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
export type LessonKind = "aula" | "live";

export interface Lesson {
  id: string;
  title: string;
  seconds: number | null;
  views: number | null;
  kind: LessonKind;
  category: CategorySlug;
  publishedAt?: string;
}

export interface Series {
  id: string;
  title: string;
  lessonIds: string[];
}

export interface Catalog {
  syncedAt: string;
  lessons: Lesson[];
  series: Series[];
}

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function thumbnailUrl(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function formatDuration(seconds: number | null) {
  if (seconds === null) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(Math.floor(seconds % 60)).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

/** Minúsculas e sem acentos, para busca e classificação. */
export function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}
