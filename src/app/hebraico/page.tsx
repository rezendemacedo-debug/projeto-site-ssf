import type { Metadata } from "next";
import Link from "next/link";
import { LetterQuiz } from "@/components/hebrew/letter-quiz";
import { LessonGrid } from "@/components/lessons/lesson-card";
import { PageHead } from "@/components/ui/page-head";
import { LETTERS, VOWELS, WORDS } from "@/content/hebrew";
import { lessonService } from "@/server/container";

export const metadata: Metadata = { title: "Aprender hebraico" };

export default async function Hebrew() {
  const lessons = (await lessonService.search({ category: "hebraico", sort: "populares" })).items.slice(0, 8);
  return (
    <>
      <PageHead title="Do alef ao tav" hebrew="לשון הקודש">Aprenda as letras, depois as vogais, depois as palavras. E então abra um texto.</PageHead>
      <section className="section"><div className="wrap"><h2 style={{ marginBottom: 28 }}>As 22 letras</h2>
        <ul className="letters">{LETTERS.map((l) => <li key={l.name}><span className="g" lang="he">{l.glyph}{l.final && ` ${l.final}`}</span><strong>{l.name}</strong><small>{l.sound}</small><small>valor {l.value}</small></li>)}</ul></div></section>
      <section className="section deep"><div className="wrap narrow"><h2 style={{ marginBottom: 28 }}>Reconheça a letra</h2><LetterQuiz /></div></section>
      <section className="section"><div className="wrap"><h2 style={{ marginBottom: 28 }}>As vogais</h2>
        <ul className="letters">{VOWELS.map((v) => <li key={v.name}><span className="g" lang="he">{v.glyph}</span><strong>{v.name}</strong><small>{v.sound}</small></li>)}</ul></div></section>
      <section className="section light"><div className="wrap"><div className="section-head"><h2>Primeiras palavras</h2><Link className="link" href="/dicionario">Dicionário judaico</Link></div>
        <ul className="letters">{WORDS.map((w) => <li key={w.latin}><span className="g" lang="he" style={{ fontSize: "2.2rem" }}>{w.hebrew}</span><strong>{w.latin}</strong><small>{w.meaning}</small></li>)}</ul></div></section>
      <section className="section"><div className="wrap stack"><h2>Leia um texto</h2><p className="lead">Tehilim e Pirkei Avot estão vocalizados, bons para praticar a leitura.</p><div className="actions"><Link className="btn" href="/biblioteca/tehilim/23">Tehilim 23</Link><Link className="btn ghost" href="/biblioteca/pirkei-avot/1">Pirkei Avot 1</Link><a className="btn ghost" href="https://www.sefaria.org/texts" target="_blank" rel="noopener">Biblioteca do Sefaria</a></div></div></section>
      <section className="section deep"><div className="wrap"><div className="section-head"><h2>Aulas de hebraico</h2><Link className="link" href="/aulas?tema=hebraico">Ver todas</Link></div><LessonGrid lessons={lessons} /></div></section>
    </>
  );
}
