import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/lessons/lesson-view";
import { thumbnailUrl } from "@/domain/lesson";
import { lessonService } from "@/server/container";
import { CatalogRepository } from "@/server/repositories/catalog-repository";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await new CatalogRepository().load()).lessons.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const found = await lessonService.find(id);
  return found ? { title: found.lesson.title, openGraph: { images: [thumbnailUrl(id)] } } : {};
}

export default async function LessonPage({ params }: Props) {
  const found = await lessonService.find((await params).id);
  if (!found) notFound();
  return <LessonView found={found} />;
}
