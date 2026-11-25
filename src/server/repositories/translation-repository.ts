import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const schema = z.object({
  translator: z.string().min(1),
  /** Licença ou autorização escrita do titular dos direitos. */
  license: z.string().min(1),
  /** Autoridade rabínica que aprovou a edição. */
  approvedBy: z.string().min(1),
  chapters: z.record(z.string(), z.array(z.string().min(1))),
});

export interface Translation { verses: string[]; translator: string; license: string; approvedBy: string }

/** Traduções em português, em data/traducoes/<livro>.json. */
export class TranslationRepository {
  constructor(private readonly dir = path.join(process.cwd(), "data", "traducoes")) {}

  async find(slug: string, chapter: number): Promise<Translation | null> {
    const raw = await readFile(path.join(this.dir, `${slug}.json`), "utf8").catch(() => null);
    if (!raw) return null;
    const { chapters, ...credits } = schema.parse(JSON.parse(raw));
    const verses = chapters[chapter];
    return verses ? { ...credits, verses } : null;
  }
}
