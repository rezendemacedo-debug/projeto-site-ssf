export interface OutlineSection {
  title: string;
  hebrew: string;
  /** Capítulos com conteúdo; null quando a seção é um texto único (ex.: introdução). */
  chapters: number[] | null;
}

interface Shape { title: string; heTitle: string; isComplex?: boolean; chapters: number | (Shape | number | unknown[])[] }

/** Converte a resposta de /api/shape em sumário, achatando obras com partes aninhadas. */
export function toOutline(shapes: Shape[]): OutlineSection[] {
  return shapes.flatMap((s) => {
    if (typeof s.chapters === "number") return s.chapters > 0 ? [{ title: s.title, hebrew: s.heTitle, chapters: null }] : [];
    const nested = s.chapters.filter((c): c is Shape => typeof c === "object" && c !== null && !Array.isArray(c));
    if (nested.length > 0) return toOutline(nested);
    const chapters = s.chapters.flatMap((c, i) => (hasContent(c) ? [i + 1] : []));
    return chapters.length > 0 ? [{ title: s.title, hebrew: s.heTitle, chapters }] : [];
  });
}

function hasContent(c: unknown): boolean {
  return Array.isArray(c) ? c.some(hasContent) : typeof c === "number" && c > 0;
}
