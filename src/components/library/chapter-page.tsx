import Link from "next/link";
import type { ReactNode } from "react";
import { PageHead } from "@/components/ui/page-head";
import type { Book } from "@/content/library";

export function ChapterPage({ book, chapter, children }: { book: Book; chapter: number; children: ReactNode }) {
  const slug = book.slug;
  return (
    <>
      <PageHead title={`${book.name} ${chapter}`} hebrew={book.hebrew} />
      <div className="wrap narrow" style={{ paddingBottom: 96 }}>
        {children}
        <nav className="pager" aria-label="Capítulos">
          {chapter > 1 && <Link className="btn ghost" href={`/biblioteca/${slug}/${chapter - 1}`}>Anterior</Link>}
          <span>{book.unit} {chapter} de {book.chapters}</span>
          {chapter < book.chapters && <Link className="btn ghost" href={`/biblioteca/${slug}/${chapter + 1}`}>Próximo</Link>}
        </nav>
      </div>
    </>
  );
}
