"use server";

import { redirect } from "next/navigation";
import { EDITORIAL_POLICY } from "@/content/editorial-policy";
import { DEFAULT_CITY } from "@/domain/cities";
import { calendarService, memberSignupService, rateLimiter } from "../container";
import { echo, type FormState, TOO_MANY, validate } from "./form";
import { codeSchema, profileSchema, signupSchema } from "./schemas";
import { clientIp, setSignupCookie, signupToken } from "./session";

const PAUSED: FormState = { message: "O cadastro está suspenso durante Shabat e Yom Tov e volta após a havdalá." };
const MAIL_FAILED: FormState = { message: "Não conseguimos enviar o e-mail agora. Tente mais tarde ou fale conosco pelo WhatsApp." };
const RESTART: FormState = { message: "Este cadastro expirou. Comece de novo." };

/** A pausa vale também no servidor, não só na tela. */
function paused() {
  return EDITORIAL_POLICY.pauseOnSacredTime && calendarService.isSacredTime(DEFAULT_CITY);
}

/** Etapa 1: dados mínimos; envia o código e segue para a confirmação. */
export async function startSignup(_: FormState, form: FormData): Promise<FormState> {
  if (paused()) return PAUSED;
  const { data, errors } = validate(signupSchema, form);
  if (!data) return { errors, values: echo(form) };
  const ipOk = await rateLimiter.allow(`signup:${await clientIp()}`, 5, 3600);
  const emailOk = await rateLimiter.allow(`signup-email:${data.email}`, 3, 3600);
  if (!ipOk || !emailOk) return { ...TOO_MANY, values: echo(form) };
  try {
    const { consent: _consent, ...signup } = data;
    await setSignupCookie(await memberSignupService.start(signup));
  } catch (error) {
    console.error("cadastro: falha ao iniciar", error);
    return { ...MAIL_FAILED, values: echo(form) };
  }
  redirect("/seja-membro/confirmar");
}

/** Etapa 2: confere o código de 6 dígitos. */
export async function confirmSignup(_: FormState, form: FormData): Promise<FormState> {
  const { data, errors } = validate(codeSchema, form);
  if (!data) return { errors };
  const token = await signupToken();
  if (!token) return RESTART;
  const result = await memberSignupService.confirm(token, data.code);
  if (result === "ok") redirect("/seja-membro/perfil");
  const text = {
    invalid: "Código incorreto. Confira o e-mail e tente de novo.",
    expired: "O código passou de 15 minutos. Peça um novo código.",
    locked: "Muitas tentativas com este código. Peça um novo código.",
  };
  return { errors: { code: text[result] } };
}

export async function resendSignupCode(_: FormState): Promise<FormState> {
  if (paused()) return PAUSED;
  const token = await signupToken();
  if (!token) return RESTART;
  if (!(await rateLimiter.allow(`signup-resend:${await clientIp()}`, 5, 3600))) return TOO_MANY;
  try {
    const result = await memberSignupService.resend(token);
    return result === "wait" ? { message: "Aguarde um minuto para pedir outro código." } : { ok: true, message: "Enviamos um novo código. Ele vale por 15 minutos." };
  } catch (error) {
    console.error("cadastro: falha ao reenviar", error);
    return MAIL_FAILED;
  }
}

/** Etapa 3: perfil opcional; depois segue para o WhatsApp. */
export async function saveSignupProfile(_: FormState, form: FormData): Promise<FormState> {
  if (paused()) return PAUSED;
  const { data, errors } = validate(profileSchema, form);
  if (!data) return { errors, values: echo(form) };
  if (!(await memberSignupService.saveProfile(await signupToken(), data))) return RESTART;
  redirect("/seja-membro/concluido");
}
