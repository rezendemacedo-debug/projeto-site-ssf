import type { Metadata } from "next";
import Link from "next/link";
import { ActionForm } from "@/components/forms/action-form";
import { PageHead } from "@/components/ui/page-head";
import { SITE } from "@/content/site";
import { login } from "@/server/http/actions";

export const metadata: Metadata = { title: "Entrar" };

export default function SignIn() {
  return (
    <>
      <PageHead title="Entrar" />
      <div className="wrap narrow stack" style={{ paddingBottom: 96 }}>
        <ActionForm action={login} submit="Entrar" fields={[
          { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
          { name: "password", label: "Senha", type: "password", autoComplete: "current-password" },
        ]} />
        <p className="muted">Ainda não é membro? <Link className="link" href="/seja-membro">Pedir acesso</Link>. Esqueceu a senha? <a className="link" href={SITE.whatsapp.url} target="_blank" rel="noopener">Fale com a SSF</a>.</p>
      </div>
    </>
  );
}
