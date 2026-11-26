"use client";

import Link from "next/link";
import { useActionState } from "react";
import { TITLES } from "@/domain/membership";
import type { FormState } from "@/server/http/form";
import { startSignup } from "@/server/http/signup-actions";
import { FieldError, NameFields } from "./profile-fields";

/** Etapa 1: título, nome, sobrenome, e-mail e senha. */
export function SignupForm() {
  const [state, run, pending] = useActionState<FormState, FormData>(startSignup, {});
  return (
    <form action={run} className="form" key={JSON.stringify(state.values ?? {})}>
      <NameFields titles={TITLES} state={state} />
      <label>E-mail<input name="email" type="email" required autoComplete="email" defaultValue={state.values?.email} aria-invalid={!!state.errors?.email} /><FieldError state={state} name="email" /></label>
      <label>Senha (mínimo de 10 caracteres)<input name="password" type="password" required minLength={10} autoComplete="new-password" aria-invalid={!!state.errors?.password} /><FieldError state={state} name="password" /></label>
      <label className="check">
        <input type="checkbox" name="consent" required defaultChecked={state.values?.consent === "on"} />
        <span>Li e aceito a <Link className="link" href="/privacidade">política de privacidade</Link>. <FieldError state={state} name="consent" /></span>
      </label>
      {state.message && <p className="notice" role="alert">{state.message}</p>}
      <div><button className="btn gold" disabled={pending}>{pending ? "Enviando o código" : "Cadastrar e receber o código"}</button></div>
    </form>
  );
}
