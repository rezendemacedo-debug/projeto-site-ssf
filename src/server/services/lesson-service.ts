import { CATEGORIES, type CategorySlug, type Lesson, type LessonKind, normalize } from "@/domain/lesson";
import type { ParashaInfo } from "@/domain/parasha";
import type { CatalogRepository } from "../repositories/catalog-repository";

export type LessonSort = "recentes" | "antigas" | "populares";

export interface LessonQuery {
  search?: string;
  category?: CategorySlug;
  kind?: LessonKind;
  series?: string;
  sort?: LessonSort;
  page?: number;
}

export const PAGE_SIZE = 24;

export class LessonService {
  constructor(private readonly repo: Pick<CatalogRepository, "load">) {}

  async search(query: LessonQuery) {
    const { lessons, series } = await this.repo.load();
    const terms = normalize(query.search ?? "").split(/\s+/).filter(Boolean);
    const ids = query.series ? new Set(series.find((s) => s.id === query.series)?.lessonIds) : null;

    const matches = lessons.filter((l) => {
      if (query.category && l.category !== query.category) return false;
      if (query.kind && l.kind !== query.kind) return false;
      if (ids && !ids.has(l.id)) return false;
      const title = normalize(l.title);
      return terms.every((t) => title.includes(t));
    });
    // O catálogo já vem do canal na ordem do mais novo para o mais antigo.
    if (query.sort === "antigas") matches.reverse();
    if (query.sort === "populares") matches.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));

    const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
    const page = Math.min(Math.max(1, query.page ?? 1), pages);
    return { items: matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total: matches.length, page, pages };
  }

  async find(id: string) {
    const { lessons, series } = await this.repo.load();
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson) return null;
    const own = series.find((s) => s.lessonIds.includes(id));
    const related = own
      ? pick(lessons, own.lessonIds)
      : lessons.filter((l) => l.category === lesson.category);
    return { lesson, series: own, related: related.filter((l) => l.id !== id).slice(0, 8) };
  }

  async byIds(ids: string[]) {
    return pick((await this.repo.load()).lessons, ids);
  }

  async latest(category: CategorySlug, limit: number) {
    return (await this.search({ category })).items.slice(0, limit);
  }

  async forParasha(parashiot: ParashaInfo[], limit: number) {
    const { lessons } = await this.repo.load();
    const names = parashiot.flatMap((p) => p.aliases);
    return lessons
      .filter((l) => normalize(l.title).split(/[^a-z]+/).some((w) => names.includes(w)))
      .slice(0, limit);
  }

  async overview() {
    const { lessons, series } = await this.repo.load();
    return {
      total: lessons.length,
      categories: CATEGORIES.filter((c) => lessons.some((l) => l.category === c.slug)).map((c) => {
        const own = lessons.filter((l) => l.category === c.slug);
        return { ...c, count: own.length, cover: own[0] };
      }),
      series: series
        .map((s) => ({ ...s, lessonIds: pick(lessons, s.lessonIds).map((l) => l.id) }))
        .filter((s) => s.lessonIds.length > 1)
        .map((s) => ({ ...s, cover: s.lessonIds[0] })),
    };
  }
}

function pick(lessons: Lesson[], ids: string[]) {
  const byId = new Map(lessons.map((l) => [l.id, l]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}
