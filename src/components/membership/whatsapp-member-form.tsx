"use client";

import { useState } from "react";
import { SITE } from "@/content/site";
import { type MemberProfile, memberWhatsAppUrl, TITLES } from "@/domain/membership";
import { type FieldState, FieldError, NameFields, ProfileFields } from "./profile-fields";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Versão sem servidor (GitHub Pages): o mesmo formulário, sem senha nem código por e-mail.
 * Nada é guardado no site; os dados vão na mensagem que a própria pessoa envia pelo WhatsApp.
 */
export function WhatsAppMemberForm() {
  const [state, setState] = useState<FieldState>({});

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const errors: Record<string, string> = {};
    if ((values.givenName ?? "").trim().length < 2) errors.givenName = "Informe seu nome.";
    if ((values.familyName ?? "").trim().length < 2) errors.familyName = "Informe seu sobrenome.";
    if (!EMAIL.test((values.email ?? "").trim())) errors.email = "Informe um e-mail válido.";
    if (Object.keys(errors).length > 0) return setState({ errors, values });
    setState({ values });
    const profile = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()])) as unknown as MemberProfile;
    window.open(memberWhatsAppUrl(SITE.whatsapp.url, profile), "_blank", "noopener");
  }

  return (
    <form onSubmit={submit} className="form" noValidate key={JSON.stringify(state.errors ?? {})}>
      <NameFields titles={TITLES} state={state} />
      <label>E-mail<input name="email" type="email" required autoComplete="email" defaultValue={state.values?.email} aria-invalid={!!state.errors?.email} /><FieldError state={state} name="email" /></label>
      <ProfileFields state={state} />
      <div><button className="btn gold">Enviar pelo WhatsApp</button></div>
    </form>
  );
}
