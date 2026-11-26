import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SacredGate } from "@/components/forms/sacred-gate";
import { SignupSteps } from "@/components/membership/signup-steps";
import { PageHead } from "@/components/ui/page-head";
import { SITE } from "@/content/site";
import { memberWhatsAppUrl } from "@/domain/membership";
import { memberSignupService } from "@/server/container";
import { signupToken } from "@/server/http/session";
import { MembershipNotice } from "../notice";

export const metadata: Metadata = { title: "Cadastro concluído", robots: { index: false } };

export default async function Done() {
  const member = await memberSignupService.verifiedMember(await signupToken());
  if (!member) redirect("/seja-membro");
  return (
    <>
      <PageHead title="Cadastro recebido">Falta só um passo: envie seu cadastro à Sinagoga Sem Fronteiras pelo WhatsApp.</PageHead>
      <div className="wrap narrow stack" style={{ paddingBottom: 96 }}>
        <SignupSteps current={4} />
        <SacredGate>
          <a className="btn gold whatsapp-cta" href={memberWhatsAppUrl(SITE.whatsapp.url, member)} target="_blank" rel="noopener">Enviar pelo WhatsApp</a>
        </SacredGate>
        <p>O WhatsApp abre com a mensagem pronta e os dados do seu cadastro; é só tocar em enviar. A equipe da SSF analisa o pedido e libera o seu acesso à área de membros.</p>
        <MembershipNotice />
      </div>
    </>
  );
}
