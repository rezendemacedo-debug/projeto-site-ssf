import type { z } from "zod";

export interface FormState {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
  /** Valores enviados, para o formulário voltar preenchido quando há erro. Nunca inclui senhas. */
  values?: Record<string, string>;
}

const SECRET_FIELDS = new Set(["password", "code"]);

export function echo(form: FormData) {
  const values: Record<string, string> = {};
  for (const [key, value] of form) if (typeof value === "string" && !SECRET_FIELDS.has(key) && !key.startsWith("$")) values[key] = value;
  return values;
}

export const TOO_MANY: FormState = { message: "Muitas tentativas. Aguarde alguns minutos e tente de novo." };

/** Valida o formulário e devolve a primeira mensagem de erro de cada campo. */
export function validate<S extends z.ZodType>(schema: S, form: FormData) {
  const result = schema.safeParse(Object.fromEntries(form));
  if (result.success) return { data: result.data as z.infer<S> };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) errors[String(issue.path[0])] ??= issue.message;
  return { errors };
}
