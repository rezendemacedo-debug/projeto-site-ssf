import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterLoader } from "@/components/library/chapter-loader";
import { ChapterPage } from "@/components/library/chapter-page";
import { findBook, LIBRARY } from "@/content/library";
import { TranslationRepository } from "@/server/repositories/translation-repository";

type Props = { params: Promise<{ slug: string; capitulo: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LIBRARY.flatMap((b) => Array.from({ length: b.chapters }, (_, i) => ({ slug: b.slug, capitulo: String(i + 1) })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, capitulo } = await params;
  return { title: `${findBook(slug)?.name} ${capitulo}` };
}

export default async function Chapter({ params }: Props) {
  const { slug, capitulo } = await params;
  const book = findBook(slug);
  if (!book) notFound();
  const chapter = Number(capitulo);
  const translation = await new TranslationRepository().find(slug, chapter);
  return <ChapterPage book={book} chapter={chapter}><ChapterLoader textRef={`${book.ref} ${chapter}`} translation={translation} /></ChapterPage>;
}
