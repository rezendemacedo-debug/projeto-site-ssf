import type { Metadata } from "next";
import { PageHead } from "@/components/ui/page-head";
import { DAILY } from "@/content/daily";

export const metadata: Metadata = { title: "Judaísmo diário" };

export default function Daily() {
  return (
    <>
      <PageHead title="Judaísmo diário" hebrew="דרך חיים">Noções essenciais da prática judaica, com suas fontes. Para decisões práticas, consulte um rabino ortodoxo competente.</PageHead>
      <div className="wrap narrow" style={{ paddingBottom: 72 }}>
        <nav className="inline" aria-label="Temas">{DAILY.map((a) => <a key={a.slug} className="btn ghost small" href={`#${a.slug}`}>{a.title}</a>)}</nav>
        {DAILY.map((a) => (
          <article key={a.slug} id={a.slug} className="article stack">
            <h2>{a.title} <span lang="he" dir="rtl" className="muted">{a.hebrew}</span></h2>
            {a.body.map((p) => <p key={p}>{p}</p>)}
            <p className="muted">Fontes: {a.sources.join("; ")}.</p>
          </article>
        ))}
      </div>
    </>
  );
}
