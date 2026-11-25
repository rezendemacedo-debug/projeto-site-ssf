import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/ui/page-head";
import { DAILY } from "@/content/daily";

export const metadata: Metadata = { title: "Judaísmo diário" };

export default function Daily() {
  return (
    <>
      <PageHead title="Judaísmo diário" hebrew="דרך חיים">Noções essenciais da prática judaica, com suas fontes.</PageHead>
      <section className="section"><div className="wrap bento">
        {DAILY.map((a) => <Link key={a.slug} className="tile" href={`/judaismo-diario/${a.slug}`}><h3>{a.title}</h3><p>{a.summary}</p><span className="link">Ler</span><span className="glyph" lang="he" aria-hidden="true">{a.hebrew[0]}</span></Link>)}
      </div></section>
    </>
  );
}
