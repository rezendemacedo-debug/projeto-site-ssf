import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/ui/page-head";
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
  const { book, chapter, text, translation } = page;
  return (
    <>
      <PageHead title={`${book.name} ${chapter}`} hebrew={book.hebrew} />
      <div className="wrap narrow" style={{ paddingBottom: 96 }}>
        {text ? (
          <>
            <ol className="page-text" lang="he">{text.verses.map((v, i) => (
              <li key={i}><span className="n">{i + 1}</span>{translation ? <div className="verse-pair"><span>{v}</span><span className="pt" lang="pt-PT">{translation.verses[i]}</span></div> : <span>{v}</span>}</li>
            ))}</ol>
            {translation && <p className="sources">Tradução: {translation.translator}. {translation.license}. Aprovação: {translation.approvedBy}.</p>}
            <p className="sources">Edição: {text.edition} ({text.license}). Texto fornecido pelo <a className="link" href={`${text.url}`} target="_blank" rel="noopener">Sefaria</a>, com comentários e traduções na página original.</p>
          </>
        ) : <p className="notice">Não foi possível carregar este texto agora. Tente novamente em alguns minutos.</p>}
        <nav className="pager" aria-label="Capítulos">
          {chapter > 1 && <Link className="btn ghost" href={`/biblioteca/${slug}/${chapter - 1}`}>Anterior</Link>}
          <span>{book.unit} {chapter} de {book.chapters}</span>
          {chapter < book.chapters && <Link className="btn ghost" href={`/biblioteca/${slug}/${chapter + 1}`}>Próximo</Link>}
        </nav>
      </div>
    </>
  );
}
