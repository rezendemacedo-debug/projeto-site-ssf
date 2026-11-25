import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/ui/page-head";

export const metadata: Metadata = { title: "Sobre nós" };

export default function About() {
  return (
    <>
      <PageHead title="A sinagoga" hebrew="בית הכנסת">O Movimento Sinagoga Sem Fronteiras foi idealizado e fundado pelo Rabino Ventura.</PageHead>
      <section className="section light"><div className="wrap cols">
        <div className="stack"><h2>O movimento</h2><p>Somos uma organização religiosa não governamental, com um programa de acolhimento, formação judaica, orientação, estudo e amparo religioso voltado aos Bnei Anussim.</p><p>Muitos brasileiros descobrem em sua família a memória de antepassados judeus. Alguns desejam conhecer o povo judeu, sua fé e suas tradições. Outros buscam o caminho de retorno. A sinagoga nasceu para receber essas pessoas com seriedade.</p></div>
        <div className="stack"><h2>Nosso objetivo</h2><p>Acolher, orientar, instruir e encaminhar, oferecendo as ferramentas para quem deseja se reconectar ao povo judeu.</p><p>Aproximar o povo brasileiro do povo judeu por meio do conhecimento, reduzindo o estranhamento e o preconceito.</p><p>Fortalecer a comunidade judaica. Hoje temos membros em mais de 30 países.</p></div>
      </div></section>
      <section className="section"><div className="wrap cols">
        <div className="stack"><h2>Rabino Ventura</h2><p className="muted">Rabino-chefe, fundador da Sinagoga Sem Fronteiras, com mais de 30 anos de ensino.</p><Link className="link" href="/rabino-ventura">Conhecer o Rabino Ventura</Link></div>
        <div className="stack"><h2>Lady Law</h2><p className="muted">Formada em direito pelo Mackenzie, professora de oratória e comentarista política, reconhecida por sua atuação em defesa de Israel e contra o antissemitismo.</p></div>
      </div></section>
    </>
  );
}
