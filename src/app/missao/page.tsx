import type { Metadata } from "next";
import { PageHead } from "@/components/ui/page-head";

export const metadata: Metadata = { title: "Missão e pilares" };

const MISSION = [
  "Acolher com justiça e dignidade quem busca o povo judeu, encaminhando cada caso segundo a Halachá e a autoridade rabínica competente.",
  "Combater todo preconceito sociocultural e racial.",
  "Dar ao povo brasileiro acesso à cultura, à história e às tradições do povo judeu, como resposta ao antissemitismo.",
  "Preservar e fortalecer a comunidade judaica.",
];
const PILLARS = [
  ["Monoteísmo", "A unicidade do Criador."], ["Torá", "A norma religiosa fundamental, Escrita e Oral."],
  ["Sionismo", "O vínculo com a Terra de Israel."], ["Interesse coletivo", "O bem da comunidade acima do interesse individual."], ["Ética", "Conduta íntegra com todas as pessoas."],
] as const;

export default function Mission() {
  return (
    <>
      <PageHead title="Missão e pilares" hebrew="תורה ומצוות" />
      <section className="section light"><div className="wrap cols">
        <div><h2>Nossa missão</h2><ul className="rows" style={{ marginTop: 20 }}>{MISSION.map((m) => <li key={m}>{m}</li>)}</ul></div>
        <div><h2>Pilares</h2><dl className="terms" style={{ gridTemplateColumns: "1fr" }}>{PILLARS.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl></div>
      </div></section>
    </>
  );
}
