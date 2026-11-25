import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/ui/page-head";
import { LIBRARY } from "@/content/library";

export const metadata: Metadata = { title: "Biblioteca" };

export default function Library() {
  const sections = [...Map.groupBy(LIBRARY, (b) => b.section)];
  return (
    <>
      <PageHead title="Tanach" hebrew="תנ״ך">Torá, Neviim e Ketuvim no original hebraico, com português ao lado nos capítulos já traduzidos.</PageHead>
      <div className="wrap" style={{ paddingBottom: 96 }}>
        <div className="actions" style={{ marginTop: 0 }}><Link className="btn" href="/biblioteca/tanach">Targumim e comentaristas do Tanach</Link></div>
        {sections.map(([name, books]) => (
          <section key={name} style={{ marginTop: 48 }}>
            <h2 style={{ marginBottom: 20 }}>{name}</h2>
            <div className="books">{books.map((b) => <Link key={b.slug} href={`/biblioteca/${b.slug}/1`}><span lang="he">{b.hebrew}</span><span>{b.name}</span></Link>)}</div>
          </section>
        ))}
        <p className="sources">A API e os textos são do <a className="link" href="https://www.sefaria.org/texts/Tanakh" target="_blank" rel="noopener">Sefaria</a>. Este site não é afiliado ao Sefaria.</p>
      </div>
    </>
  );
}
