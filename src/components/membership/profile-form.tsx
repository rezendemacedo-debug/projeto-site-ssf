"use client";

import { useActionState } from "react";
import type { FormState } from "@/server/http/form";
import { saveSignupProfile } from "@/server/http/signup-actions";
import { ProfileFields } from "./profile-fields";

/** Etapa 3: perfil, todo opcional. */
export function ProfileForm() {
  const [state, run, pending] = useActionState<FormState, FormData>(saveSignupProfile, {});
  return (
    <form action={run} className="form" key={JSON.stringify(state.values ?? {})}>
      <ProfileFields state={state} />
      {state.message && <p className="notice" role="alert">{state.message}</p>}
      <div><button className="btn gold" disabled={pending}>{pending ? "Salvando" : "Salvar e continuar"}</button></div>
    </form>
  );
}
