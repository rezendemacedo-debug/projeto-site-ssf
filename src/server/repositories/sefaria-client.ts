import { type OutlineSection, toOutline } from "@/domain/work-outline";

const API = "https://www.sefaria.org/api";
const DAY = 86_400;
const OPEN_LICENSES = new Set(["Public Domain", "PD", "CC0", "CC-BY", "CC-BY-SA", "CC-BY-NC"]);

export interface SefariaSection {
  /** Um bloco por versículo (ou parágrafo), cada um com seus trechos ou comentários. */
  blocks: string[][];
  edition: string;
  license: string;
  source: string;
  url: string;
}

export interface SefariaText extends SefariaSection {
  verses: string[];
}

interface VersionDto { versionTitle: string; versionSource: string; license: string; actualLanguage: string; text: unknown }

/** Cliente da API pública do Sefaria (developers.sefaria.org). Não raspa HTML. */
export class SefariaClient {
  /** Texto hebraico, somente se houver edição com licença que permita republicar. */
  async hebrewText(ref: string): Promise<SefariaText | null> {
    const section = await this.section(ref);
    return section && { ...section, verses: section.blocks.map((b) => b.join(" ")) };
  }

  /** Como hebrewText, preservando a divisão em versículos e comentários. */
  async section(ref: string): Promise<SefariaSection | null> {
    const slug = encodeURIComponent(ref.replace(/ /g, "_"));
    // "all" devolve as edições hebraicas disponíveis, para escolhermos pela licença.
    const data = await this.get<{ versions?: VersionDto[] }>(`/v3/texts/${slug}?version=hebrew%7Call`, 7 * DAY);
    const open = (data?.versions ?? [])
      .filter((v) => v.actualLanguage === "he" && isOpenLicense(v.license))
      .map((v) => ({ ...v, blocks: toBlocks(v.text) }))
      .filter((v) => v.blocks.some((b) => b.length > 0))
      .sort((x, y) => rank(x.versionTitle) - rank(y.versionTitle) || y.blocks.length - x.blocks.length);
    const version = open[0];
    if (!version) return null;
    return {
      blocks: version.blocks,
      edition: version.versionTitle,
      license: version.license,
      source: version.versionSource,
      url: `https://www.sefaria.org/${slug}`,
    };
  }

  /** Sumário de uma obra; null se a API não responder. */
  async outline(title: string): Promise<OutlineSection[] | null> {
    const shapes = await this.get<Parameters<typeof toOutline>[0]>(`/shape/${encodeURIComponent(title.replace(/ /g, "_"))}`, 7 * DAY);
    return Array.isArray(shapes) ? toOutline(shapes) : null;
  }

  private async get<T>(path: string, revalidate: number): Promise<T | null> {
    try {
      const res = await fetch(API + path, { next: { revalidate }, signal: AbortSignal.timeout(8000) });
      return res.ok ? ((await res.json()) as T) : null;
    } catch {
      return null;
    }
  }
}

function toBlocks(text: unknown): string[][] {
  const list = Array.isArray(text) ? text : [text ?? ""];
  return list.map((block) => [block].flat(4).map((t) => plainText(String(t ?? ""))).filter(Boolean));
}

/** Ordem de preferência das edições. */
function rank(title: string) {
  if (title === "Miqra according to the Masorah") return 0;
  return /Torat Emet/.test(title) ? 1 : 2;
}

export function isOpenLicense(license: string) {
  return OPEN_LICENSES.has(license);
}

/** Remove notas e marcação HTML; o resultado é sempre texto puro. */
export function plainText(html: string) {
  return html
    .replace(/<sup[^>]*class="footnote-marker"[^>]*>.*?<\/sup>/g, "")
    .replace(/<i class="footnote">[\s\S]*?<\/i>(?![^<]*<\/i>)/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;|&thinsp;/g, " ")
    .replace(/&[a-z]+;|\{[פס]\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
