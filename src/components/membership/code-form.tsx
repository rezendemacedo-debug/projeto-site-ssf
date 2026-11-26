"use client";

import { useActionState } from "react";
import type { FormState } from "@/server/http/form";
import { confirmSignup, resendSignupCode } from "@/server/http/signup-actions";
import { FieldError } from "./profile-fields";

/** Etapa 2: código de 6 dígitos e pedido de novo código. */
export function CodeForm() {
  const [state, run, pending] = useActionState<FormState, FormData>(confirmSignup, {});
  const [resent, resend, resending] = useActionState<FormState>(resendSignupCode, {});
  return (
    <div className="stack">
      <form action={run} className="form">
        <label>
          Código de 6 números
          <input name="code" className="code-input" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required aria-invalid={!!state.errors?.code} />
          <FieldError state={state} name="code" />
        </label>
        {state.message && <p className="notice" role="alert">{state.message}</p>}
        <div><button className="btn gold" disabled={pending}>{pending ? "Conferindo" : "Confirmar"}</button></div>
      </form>
      <form action={resend} className="inline">
        <span className="muted">Não chegou? Veja também a caixa de spam.</span>
        <button className="btn ghost small" disabled={resending}>{resending ? "Enviando" : "Enviar novo código"}</button>
      </form>
      {resent.message && <p className="notice" role="status">{resent.message}</p>}
    </div>
  );
}
