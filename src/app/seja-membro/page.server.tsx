import type { Metadata } from "next";
import Link from "next/link";
import { SacredGate } from "@/components/forms/sacred-gate";
import { SignupForm } from "@/components/membership/signup-form";
import { SignupSteps } from "@/components/membership/signup-steps";
import { PageHead } from "@/components/ui/page-head";
import { MembershipNotice } from "./notice";

export const metadata: Metadata = { title: "Seja membro" };

export default function Join() {
  return (
    <>
      <PageHead title="Seja membro">Cadastre-se em poucos passos. Enviaremos um código para confirmar o seu e-mail.</PageHead>
      <div className="wrap narrow stack" style={{ paddingBottom: 96 }}>
        <SignupSteps current={1} />
        <SacredGate><SignupForm /></SacredGate>
        <p className="muted">Já tem acesso? <Link className="link" href="/entrar">Entrar</Link>.</p>
        <MembershipNotice />
      </div>
    </>
  );
}
