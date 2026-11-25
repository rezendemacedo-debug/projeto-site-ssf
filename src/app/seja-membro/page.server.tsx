import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm } from "@/components/forms/action-form";
import { SacredGate } from "@/components/forms/sacred-gate";
import { PageHead } from "@/components/ui/page-head";
import { register } from "@/server/http/actions";

export const metadata: Metadata = { title: "Seja membro" };

export default function Join() {
  return (
    <>
      <PageHead title="Seja membro">Salve aulas, acompanhe seu estudo e participe da comunidade. Cada pedido é analisado pela equipe.</PageHead>
      <div className="wrap narrow stack" style={{ paddingBottom: 96 }}>
        <p className="notice">Ser membro desta plataforma não constitui conversão nem define status judaico. Essas questões pertencem exclusivamente a um Beit Din ortodoxo competente.</p>
        <SacredGate>
          <ActionForm action={register} submit="Enviar pedido" fields={[
            { name: "name", label: "Nome completo", autoComplete: "name" },
            { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
            { name: "password", label: "Senha (mínimo de 10 caracteres)", type: "password", autoComplete: "new-password" },
            { name: "city", label: "Cidade e país", optional: true },
            { name: "motivation", label: "Por que deseja participar?", type: "textarea", optional: true },
            { name: "consent", label: "Li e aceito a política de privacidade.", type: "checkbox" },
          ]} />
        </SacredGate>
        <p className="muted">Já tem acesso? <Link className="link" href="/entrar">Entrar</Link>. Leia a <Link className="link" href="/privacidade">política de privacidade</Link>.</p>
      </div>
    </>
  );
}
