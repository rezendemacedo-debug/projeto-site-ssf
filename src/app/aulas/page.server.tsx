import type { Metadata } from "next";
import { type ArchiveParams, LessonArchive } from "@/components/lessons/lesson-archive";
import { lessonService } from "@/server/container";
import { parseLessonParams } from "@/server/http/schemas";

export const metadata: Metadata = { title: "Aulas", description: "Acervo de aulas de Torá do Rabino Ventura, organizado por tema." };

export default async function Lessons({ searchParams }: { searchParams: Promise<ArchiveParams> }) {
  const raw = await searchParams;
  const query = parseLessonParams(raw);
  const [result, overview] = await Promise.all([lessonService.search(query), lessonService.overview()]);
  return <LessonArchive raw={raw} query={query} result={result} overview={overview} />;
}
