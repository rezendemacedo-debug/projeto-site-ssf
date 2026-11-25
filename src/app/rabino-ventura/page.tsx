import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHead } from "@/components/ui/page-head";
import { SOCIAL } from "@/content/site";

export const metadata: Metadata = { title: "Rabino Ventura" };

export default function Rabbi() {
  return (
    <>
      <PageHead title="Rabino Ventura" hebrew="הרב">Rabino-chefe e fundador da Sinagoga Sem Fronteiras.</PageHead>
      <section className="section"><div className="wrap split">
        <Image src="/images/rabino-ventura.jpg" alt="Retrato do Rabino Ventura" width={385} height={460} priority />
        <div className="stack">
          <p className="lead">Pioneiro no Brasil em divulgar a história e acolher os descendentes de judeus forçados à conversão pela Inquisição, os Bnei Anussim.</p>
          <p>Com mais de 30 anos de experiência no ensino de adultos, jovens e crianças, dedica-se a levar o judaísmo ao maior número possível de pessoas.</p>
          <p>É autor de livros como <cite>Descobrindo a Face Oculta da Torá</cite> e <cite>O Resgate</cite>.</p>
          <ul className="rows">{SOCIAL.map((s) => <li key={s.url}><span>{s.name}</span><a className="link" href={s.url} target="_blank" rel="noopener">{s.handle}</a></li>)}</ul>
          <div className="actions"><Link className="btn" href="/aulas">Assistir às aulas</Link></div>
        </div>
      </div></section>
    </>
  );
}
