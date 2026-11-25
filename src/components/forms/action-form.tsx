"use client";

import { useActionState } from "react";
import type { FormState } from "@/server/http/actions";

export interface Field {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "textarea" | "checkbox";
  autoComplete?: string;
  optional?: boolean;
}

interface Props {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  fields: Field[];
  submit: string;
}

export function ActionForm({ action, fields, submit }: Props) {
  const [state, run, pending] = useActionState(action, {});
  if (state.ok) return <p className="notice" role="status">{state.message}</p>;
  return (
    <form action={run} className="form">
      {fields.map((f) => <FieldInput key={f.name} field={f} error={state.errors?.[f.name]} />)}
      {state.message && <p className="notice" role="alert">{state.message}</p>}
      <div><button className="btn" disabled={pending}>{pending ? "Enviando" : submit}</button></div>
    </form>
  );
}

function FieldInput({ field, error }: { field: Field; error?: string }) {
  const { name, label, type = "text", autoComplete, optional } = field;
  const props = { name, required: !optional, "aria-invalid": !!error };
  const message = error && <span className="error" role="alert">{error}</span>;
  if (type === "checkbox") return <label className="check"><input type="checkbox" {...props} /><span>{label} {message}</span></label>;
  return (
    <label>
      {label}{optional && " (opcional)"}
      {type === "textarea" ? <textarea {...props} /> : <input type={type} autoComplete={autoComplete} {...props} />}
      {message}
    </label>
  );
}
