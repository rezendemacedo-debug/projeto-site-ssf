import type { Metadata } from "next";
import { ActionForm } from "@/components/forms/action-form";
import { SacredGate } from "@/components/forms/sacred-gate";
import { PageHead } from "@/components/ui/page-head";
import { SITE, SOCIAL } from "@/content/site";
import { sendMessage } from "@/server/http/actions";

export const metadata: Metadata = { title: "Contato" };

export default function Contact() {
  return (
    <>
      <PageHead title="Fale conosco" />
      <div className="wrap cols" style={{ paddingBottom: 96 }}>
        <SacredGate>
          <ActionForm action={sendMessage} submit="Enviar mensagem" fields={[
            { name: "name", label: "Nome", autoComplete: "name" }, { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
            { name: "subject", label: "Assunto" }, { name: "body", label: "Mensagem", type: "textarea" },
          ]} />
        </SacredGate>
        <ul className="rows"><li><span>WhatsApp</span><a className="link" href={SITE.whatsapp.url} target="_blank" rel="noopener">{SITE.whatsapp.label}</a></li>{SOCIAL.map((s) => <li key={s.url}><span>{s.name}</span><a className="link" href={s.url} target="_blank" rel="noopener">{s.handle}</a></li>)}</ul>
      </div>
    </>
  );
}
