import type { Metadata } from "next";
import { SacredGate } from "@/components/forms/sacred-gate";
import { WhatsAppMemberForm } from "@/components/membership/whatsapp-member-form";
import { PageHead } from "@/components/ui/page-head";
import { MembershipNotice } from "./notice";

export const metadata: Metadata = { title: "Seja membro" };

export default function Join() {
  return (
    <>
      <PageHead title="Seja membro">Preencha seus dados e envie à Sinagoga Sem Fronteiras pelo WhatsApp.</PageHead>
      <div className="wrap narrow stack" style={{ paddingBottom: 96 }}>
        <p className="muted">Só nome, sobrenome e e-mail são obrigatórios. Este site não guarda os seus dados: eles seguem apenas na mensagem que você envia.</p>
        <SacredGate><WhatsAppMemberForm /></SacredGate>
        <MembershipNotice />
      </div>
    </>
  );
}
