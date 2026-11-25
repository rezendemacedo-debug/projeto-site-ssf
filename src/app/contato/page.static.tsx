import type { Metadata } from "next";
import { PageHead } from "@/components/ui/page-head";
import { SITE, SOCIAL } from "@/content/site";

export const metadata: Metadata = { title: "Contato" };

export default function Contact() {
  return (
    <>
      <PageHead title="Fale conosco" />
      <div className="wrap narrow" style={{ paddingBottom: 96 }}>
        <ul className="rows"><li><span>WhatsApp</span><a className="link" href={SITE.whatsapp.url} target="_blank" rel="noopener">{SITE.whatsapp.label}</a></li>{SOCIAL.map((s) => <li key={s.url}><span>{s.name}</span><a className="link" href={s.url} target="_blank" rel="noopener">{s.handle}</a></li>)}</ul>
      </div>
    </>
  );
}
