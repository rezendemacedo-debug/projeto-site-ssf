import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/ui/page-head";
import { Sources } from "@/components/ui/sources";
import { KABBALAH } from "@/content/daily";

export const metadata: Metadata = { title: "Cabalá" };

export default function Kabbalah() {
  return (
    <>
      <PageHead title="Cabalá" hebrew="קבלה">Noções introdutórias da tradição interior da Torá.</PageHead>
      <article className="wrap narrow stack" style={{ paddingBottom: 96, fontSize: "1.15rem" }}>
        <h2>O que é Cabalá</h2>{KABBALAH.intro.map((p) => <p key={p}>{p}</p>)}
        <h2 style={{ marginTop: 48 }}>A contagem do Ômer</h2>{KABBALAH.omer.map((p) => <p key={p}>{p}</p>)}
        <Sources items={KABBALAH.sources} />
        <p><Link className="link" href="/aulas?tema=cabala">Aulas sobre o tema</Link></p>
      </article>
    </>
  );
}
