import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SacredGate } from "@/components/forms/sacred-gate";
import { ProfileForm } from "@/components/membership/profile-form";
import { SignupSteps } from "@/components/membership/signup-steps";
import { PageHead } from "@/components/ui/page-head";
import { memberSignupService } from "@/server/container";
import { signupToken } from "@/server/http/session";

export const metadata: Metadata = { title: "Complete seu perfil", robots: { index: false } };

export default async function Profile() {
  const member = await memberSignupService.verifiedMember(await signupToken());
  if (!member) redirect("/seja-membro");
  return (
    <>
      <PageHead title={`Shalom, ${member.givenName}!`}>E-mail confirmado. Complete seu perfil; todos os campos são opcionais.</PageHead>
      <div className="wrap narrow stack" style={{ paddingBottom: 96 }}>
        <SignupSteps current={3} />
        <SacredGate><ProfileForm /></SacredGate>
      </div>
    </>
  );
}
