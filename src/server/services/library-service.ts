import { findBook } from "@/content/library";
import type { SefariaClient } from "../repositories/sefaria-client";
import type { TranslationRepository } from "../repositories/translation-repository";

const STUDIES: Record<string, string> = {
  Haftarah: "Haftará", "Daf Yomi": "Daf Yomi", "Daily Mishnah": "Mishná diária", "Daily Rambam": "Rambam diário",
  "Halakhah Yomit": "Halachá diária", "Arukh HaShulchan Yomi": "Aruch Hashulchan diário",
};

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

  async dailyStudy(timezone: string) {
    return (await this.sefaria.dailyStudy(timezone)).flatMap((i) => {
      const title = STUDIES[i.title];
      return title ? [{ ...i, title }] : [];
    });
  }
}
