"use client";

import { useRouter } from "next/navigation";
import { LIBRARY } from "@/content/library";

/** Troca de livro e capítulo sem voltar à biblioteca. */
export function ChapterSelect({ slug, chapter, chapters }: { slug: string; chapter: number; chapters: number }) {
  const router = useRouter();
  return (
    <div className="inline" style={{ marginBottom: 24 }}>
      <label className="inline">Livro<select value={slug} onChange={(e) => router.push(`/biblioteca/${e.target.value}/1`)}>{LIBRARY.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}</select></label>
      <label className="inline">Capítulo<select value={chapter} onChange={(e) => router.push(`/biblioteca/${slug}/${e.target.value}`)}>{Array.from({ length: chapters }, (_, i) => <option key={i}>{i + 1}</option>)}</select></label>
    </div>
  );
}
