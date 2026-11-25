import { LIBRARY } from "@/content/library";

/** Obra da seção Tanakh do Sefaria além dos 39 livros (Targumim e comentaristas). */
export interface TanakhWork {
  title: string;
  hebrew: string;
  /** Categorias do Sefaria abaixo de Tanakh, da mais geral à mais específica. */
  path: string[];
}

const GROUPS: Record<string, { name: string; hebrew: string }> = {
  Targum: { name: "Targumim", hebrew: "תרגומים" },
  "Rishonim on Tanakh": { name: "Rishonim", hebrew: "ראשונים" },
  "Acharonim on Tanakh": { name: "Acharonim", hebrew: "אחרונים" },
  "Modern Commentary on Tanakh": { name: "Comentários modernos", hebrew: "פירושים מודרניים" },
};

export function groupInfo(key: string) {
  return GROUPS[key] ?? { name: key, hebrew: "" };
}

// Nomes longos primeiro: "I Samuel" antes de qualquer sufixo menor.
const BOOKS = LIBRARY.filter((b) => ["Torá", "Neviim", "Ketuvim"].includes(b.section)).sort((a, b) => b.ref.length - a.ref.length);

function baseBook(title: string) {
  return BOOKS.find((b) => title.endsWith(` ${b.ref}`));
}

/** "Rashi on Genesis" vira "Rashi sobre Bereshit". */
export function workName(title: string) {
  const book = baseBook(title);
  if (!book) return title.replace(/ on (the )?Torah$/, " sobre a Torá").replace(/ on (the )?Tanakh$/, " sobre o Tanach");
  const prefix = title.slice(0, -book.ref.length).trim();
  return / on$/.test(prefix) ? `${prefix.slice(0, -3)} sobre ${book.name}` : `${prefix} ${book.name}`;
}

export function worksFor(bookRef: string, works: TanakhWork[]) {
  return works.filter((w) => baseBook(w.title)?.ref === bookRef);
}

export function workUrl(title: string, chapter?: number) {
  const params = new URLSearchParams({ t: title });
  if (chapter) params.set("c", String(chapter));
  return `/biblioteca/obra?${params}`;
}
