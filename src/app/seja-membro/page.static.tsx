import type { Metadata } from "next";
import { SacredGate } from "@/components/forms/sacred-gate";
import { PageHead } from "@/components/ui/page-head";
import { SITE } from "@/content/site";

export const metadata: Metadata = { title: "Seja membro" };

export default function Join() {
  return (
    <>
      <PageHead title="Seja membro">Fale com a equipe da sinagoga para participar da comunidade.</PageHead>
      <div className="wrap narrow stack" style={{ paddingBottom: 96 }}>
        <p className="notice">Ser membro desta plataforma não constitui conversão nem define status judaico. Essas questões pertencem exclusivamente a um Beit Din ortodoxo competente.</p>
        <SacredGate><a className="btn" href={`${SITE.whatsapp.url}?text=${encodeURIComponent("Shalom! Quero ser membro da Sinagoga Sem Fronteiras.")}`} target="_blank" rel="noopener">Pedir por WhatsApp</a></SacredGate>
      </div>
    </>
  );
}
