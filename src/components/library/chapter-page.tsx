import Link from "next/link";
import type { ReactNode } from "react";
import { PageHead } from "@/components/ui/page-head";
import type { Book } from "@/content/library";
import { isReadable, works } from "@/content/tanakh-works";
import { workName, worksFor, workUrl } from "@/domain/tanakh-work";

export function ChapterPage({ book, chapter, children }: { book: Book; chapter: number; children: ReactNode }) {
  const slug = book.slug;
  const commentaries = worksFor(book.ref, works).filter(isReadable);
  return (
    <>
      <PageHead title={`${book.name} ${chapter}`} hebrew={book.hebrew} />
      <div className="wrap reading" style={{ paddingBottom: 96 }}>
        {children}
        <nav className="pager" aria-label="Capítulos">
          {chapter > 1 && <Link className="btn ghost" href={`/biblioteca/${slug}/${chapter - 1}`}>Anterior</Link>}
          <span>{book.unit} {chapter} de {book.chapters}</span>
          {chapter < book.chapters && <Link className="btn ghost" href={`/biblioteca/${slug}/${chapter + 1}`}>Próximo</Link>}
        </nav>
        {commentaries.length > 0 && (
          <details className="group" style={{ marginTop: 56 }}>
            <summary>Targum e comentários ({commentaries.length})</summary>
            <ul className="works">{commentaries.map((w) => <li key={w.title}><Link href={workUrl(w.title, chapter)}>{workName(w.title)}</Link><span lang="he" dir="rtl">{w.hebrew}</span></li>)}</ul>
          </details>
        )}
      </div>
    </>
  );
}
