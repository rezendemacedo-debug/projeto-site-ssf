import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterPage } from "@/components/library/chapter-page";
import { ChapterText } from "@/components/library/chapter-text";
import { findBook } from "@/content/library";
import { libraryService } from "@/server/container";

type Props = { params: Promise<{ slug: string; capitulo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, capitulo } = await params;
  const book = findBook(slug);
  return book ? { title: `${book.name} ${capitulo}` } : {};
}

export default async function Chapter({ params }: Props) {
  const { slug, capitulo } = await params;
  const page = await libraryService.chapter(slug, Number(capitulo));
  if (!page) notFound();
  return <ChapterPage book={page.book} chapter={page.chapter}><ChapterText text={page.text} translation={page.translation} /></ChapterPage>;
}
