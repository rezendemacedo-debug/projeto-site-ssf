const API = "https://www.sefaria.org/api";
const DAY = 86_400;
const OPEN_LICENSES = new Set(["Public Domain", "PD", "CC0", "CC-BY", "CC-BY-SA", "CC-BY-NC"]);

export interface SefariaText {
  verses: string[];
  edition: string;
  license: string;
  source: string;
  url: string;
}

interface VersionDto { versionTitle: string; versionSource: string; license: string; text: unknown }

/** Cliente da API pública do Sefaria (developers.sefaria.org). Não raspa HTML. */
export class SefariaClient {
  /** Texto hebraico, somente se houver edição com licença que permita republicar. */
  async hebrewText(ref: string): Promise<SefariaText | null> {
    const slug = encodeURIComponent(ref.replace(/ /g, "_"));
    // "all" devolve as edições hebraicas disponíveis, para escolhermos pela licença.
    const data = await this.get<{ versions?: VersionDto[] }>(`/v3/texts/${slug}?version=hebrew%7Call`, 7 * DAY);
    const open = (data?.versions ?? []).filter((v) => isOpenLicense(v.license) && Array.isArray(v.text) && v.text.length > 0);
    const version =
      open.find((v) => v.versionTitle === "Miqra according to the Masorah") ??
      open.find((v) => /Torat Emet/.test(v.versionTitle) && !/Text Only/.test(v.versionTitle)) ??
      open[0];
    if (!version) return null;
    return {
      verses: (version.text as unknown[]).flat(3).map((t) => plainText(String(t))),
      edition: version.versionTitle,
      license: version.license,
      source: version.versionSource,
      url: `https://www.sefaria.org/${slug}`,
    };
  }

  /** Estudos do dia (Daf Yomi, Mishná Yomit etc.). */
  async dailyStudy(timezone: string) {
    const data = await this.get<{ calendar_items: { title: { en: string }; displayValue: { en: string; he: string }; url: string }[] }>(
      `/calendars?timezone=${encodeURIComponent(timezone)}`,
      3600,
    );
    return (data?.calendar_items ?? []).map((i) => ({ title: i.title.en, hebrew: i.displayValue.he, url: `https://www.sefaria.org/${i.url}` }));
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
