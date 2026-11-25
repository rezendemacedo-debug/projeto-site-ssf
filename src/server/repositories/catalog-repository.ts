import snapshot from "../../../data/catalog.json";
import { EDITORIAL_POLICY } from "@/content/editorial-policy";
import type { Catalog, Lesson } from "@/domain/lesson";
import { classify, hasMeaningfulTitle } from "@/domain/lesson-classifier";

const FEED = "https://www.youtube.com/feeds/videos.xml?channel_id=UCWyourBdWBAZEbu3ncf7y3Q";

/** Acervo = instantâneo versionado (data/catalog.json) + novidades do RSS do canal. */
export class CatalogRepository {
  async load(): Promise<Catalog> {
    const base = snapshot as Catalog;
    const feed = await this.fetchFeed();
    const dates = new Map(feed.map((l) => [l.id, l.publishedAt]));
    const known = new Set(base.lessons.map((l) => l.id));
    return {
      ...base,
      lessons: [
        ...feed.filter((l) => !known.has(l.id)),
        ...base.lessons.map((l) => (dates.has(l.id) ? { ...l, publishedAt: dates.get(l.id) } : l)),
      ].filter(isPublishable),
    };
  }

  private async fetchFeed(): Promise<Lesson[]> {
    try {
      const res = await fetch(FEED, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(4000) });
      return res.ok ? parseFeed(await res.text()) : [];
    } catch {
      return []; // Sem rede, o instantâneo continua servindo o acervo.
    }
  }
}

function isPublishable(lesson: Lesson) {
  return !EDITORIAL_POLICY.hiddenCategories.includes(lesson.category) && !EDITORIAL_POLICY.hiddenLessonIds.includes(lesson.id);
}

export function parseFeed(xml: string): Lesson[] {
  return xml
    .split("<entry>")
    .slice(1)
    .flatMap((entry) => {
      const id = /<yt:videoId>([\w-]{11})</.exec(entry)?.[1];
      const title = decode(/<title>([^<]*)</.exec(entry)?.[1] ?? "").trim();
      const publishedAt = /<published>([^<]*)</.exec(entry)?.[1];
      const isShort = /rel="alternate" href="[^"]*\/shorts\//.test(entry);
      if (!id || isShort || !hasMeaningfulTitle(title)) return [];
      return [{ id, title, seconds: null, views: null, kind: "aula" as const, category: classify(title), publishedAt }];
    });
}

function decode(text: string) {
  return text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
