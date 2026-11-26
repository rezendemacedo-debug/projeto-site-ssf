import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CodeForm } from "@/components/membership/code-form";
import { SignupSteps } from "@/components/membership/signup-steps";
import { PageHead } from "@/components/ui/page-head";
import { signupToken } from "@/server/http/session";
import { CODE_TTL_MINUTES } from "@/server/services/member-signup-service";

export const metadata: Metadata = { title: "Confirme seu e-mail", robots: { index: false } };

export default async function Confirm() {
  if (!(await signupToken())) redirect("/seja-membro");
  return (
    <>
      <PageHead title="Confirme seu e-mail">Enviamos um código de 6 números para o e-mail cadastrado. Ele vale por {CODE_TTL_MINUTES} minutos.</PageHead>
      <div className="wrap narrow stack" style={{ paddingBottom: 96 }}>
        <SignupSteps current={2} />
        <CodeForm />
        <p className="muted">E-mail errado? <Link className="link" href="/seja-membro">Comece de novo</Link>.</p>
      </div>
    </>
  );
}
