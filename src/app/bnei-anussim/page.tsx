import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LessonGrid } from "@/components/lessons/lesson-card";
import { PageHead } from "@/components/ui/page-head";
import photo from "@/assets/rabino-bnei-anussim.jpg";
import { ANUSSIM } from "@/content/daily";
import { lessonService } from "@/server/container";

export const metadata: Metadata = { title: "Bnei Anussim" };

export default async function Anussim() {
  const lessons = (await lessonService.search({ category: "bnei-anussim", sort: "populares" })).items.slice(0, 8);
  return (
    <>
      <PageHead title="Bnei Anussim" hebrew="בני אנוסים">Os descendentes de judeus forçados à conversão, e a memória que atravessou séculos no Brasil.</PageHead>
      <section className="section light"><div className="wrap split">
        <div className="stack">{ANUSSIM.map((a) => <div key={a.title}><h3>{a.title}</h3><p className="muted" style={{ marginTop: 6 }}>{a.text}</p></div>)}</div>
        <Image src={photo} alt="Rabino Ventura, com chapéu de couro nordestino, falando em encontro da Sinagoga Sem Fronteiras" sizes="(max-width: 800px) 100vw, 560px" />
      </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>Aulas e relatos</h2><Link className="link" href="/aulas?tema=bnei-anussim">Ver todas</Link></div><LessonGrid lessons={lessons} /></div></section>
    </>
  );
}
