/**
 * Gera data/catalog.json a partir do canal público do YouTube (requer yt-dlp).
 * Uso: npm run catalog:sync
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import type { Catalog, Lesson, LessonKind, Series } from "../../src/domain/lesson";
import { classify, hasMeaningfulTitle } from "../../src/domain/lesson-classifier";

const CHANNEL = "https://www.youtube.com/@sinagogasemfronteiras";
const CHANNEL_ID = "UCWyourBdWBAZEbu3ncf7y3Q";
const MIN_SECONDS = 60;

interface Entry { id: string; title: string; duration?: number; view_count?: number; channel_id?: string }

function list(url: string): { title: string; entries: Entry[] } {
  const out = execFileSync("yt-dlp", ["--flat-playlist", "--no-warnings", "-J", "--extractor-args", "youtube:lang=pt", url], {
    maxBuffer: 256 * 1024 * 1024,
    encoding: "utf8",
  });
  return JSON.parse(out);
}

const series: Series[] = [];
for (const p of list(`${CHANNEL}/playlists`).entries) {
  if (p.id.startsWith("FL")) continue;
  try {
    const own = list(`https://www.youtube.com/playlist?list=${p.id}`).entries.filter((e) => e.channel_id === CHANNEL_ID);
    if (own.length > 0) series.push({ id: p.id, title: p.title.replace(/ - Rabino Ventura.*$/, "").trim(), lessonIds: own.map((e) => e.id) });
  } catch {
    console.warn(`playlist ignorada: ${p.title}`);
  }
}

const lessons = new Map<string, Lesson>();
const tabs: [string, LessonKind][] = [["videos", "aula"], ["streams", "live"]];
for (const [tab, kind] of tabs) {
  for (const e of list(`${CHANNEL}/${tab}`).entries) {
    if (lessons.has(e.id) || !hasMeaningfulTitle(e.title) || (e.duration ?? MIN_SECONDS) < MIN_SECONDS) continue;
    const inSeries = series.filter((s) => s.lessonIds.includes(e.id)).map((s) => s.title);
    lessons.set(e.id, {
      id: e.id,
      title: e.title.trim(),
      seconds: e.duration ?? null,
      views: e.view_count ?? null,
      kind,
      category: classify(e.title, inSeries),
    });
  }
}

const catalog: Catalog = {
  syncedAt: new Date().toISOString(),
  lessons: [...lessons.values()],
  series: series
    .map((s) => ({ ...s, lessonIds: s.lessonIds.filter((id) => lessons.has(id)) }))
    .filter((s) => s.lessonIds.length > 1),
};
writeFileSync("data/catalog.json", JSON.stringify(catalog, null, 1) + "\n");
const counts = Map.groupBy(catalog.lessons, (l) => l.category);
console.log(catalog.lessons.length, "aulas;", catalog.series.length, "séries");
for (const [c, l] of counts) console.log(c, l.length, "|", l.slice(0, 4).map((x) => x.title).join(" / "));
