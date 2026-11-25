import { findBook } from "@/content/library";
import type { SefariaClient } from "../repositories/sefaria-client";
import type { TranslationRepository } from "../repositories/translation-repository";

export class LibraryService {
  constructor(
    private readonly sefaria: SefariaClient,
    private readonly translations: TranslationRepository,
  ) {}

  async chapter(slug: string, chapter: number) {
    const book = findBook(slug);
    if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) return null;
    const text = await this.sefaria.hebrewText(`${book.ref} ${chapter}`);
    const translation = await this.translations.find(slug, chapter);
    return { book, chapter, text, translation };
  }
}
