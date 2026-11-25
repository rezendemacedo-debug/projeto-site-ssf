"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { authService, lessonService, messageRepository, rateLimiter, savedLessonRepository, userRepository } from "../container";
import { contactSchema, loginSchema, registerSchema } from "./schemas";
import { clientIp, endSession, requireAdmin, requireUser, setSessionCookie } from "./session";

export interface FormState {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
}

const TOO_MANY: FormState = { message: "Muitas tentativas. Aguarde alguns minutos e tente de novo." };

function validate<S extends z.ZodType>(schema: S, form: FormData) {
  const result = schema.safeParse(Object.fromEntries(form));
  if (result.success) return { data: result.data };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) errors[String(issue.path[0])] ??= issue.message;
  return { errors };
}

export async function sendMessage(_: FormState, form: FormData): Promise<FormState> {
  const { data, errors } = validate(contactSchema, form);
  if (!data) return { errors };
  if (!(await rateLimiter.allow(`contact:${await clientIp()}`, 5, 3600))) return TOO_MANY;
  await messageRepository.create(data);
  return { ok: true, message: "Mensagem recebida. Responderemos por e-mail." };
}

export async function register(_: FormState, form: FormData): Promise<FormState> {
  const { data, errors } = validate(registerSchema, form);
  if (!data) return { errors };
  if (!(await rateLimiter.allow(`register:${await clientIp()}`, 5, 3600))) return TOO_MANY;
  const { consent: _consent, ...account } = data;
  await authService.register(account);
  // Mesma resposta para e-mail novo ou já cadastrado, para não revelar contas.
  return { ok: true, message: "Pedido recebido. A equipe da SSF vai analisar e liberar seu acesso." };
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const { data, errors } = validate(loginSchema, form);
  if (!data) return { errors };
  const ipOk = await rateLimiter.allow(`login-ip:${await clientIp()}`, 30, 900);
  const emailOk = await rateLimiter.allow(`login:${data.email}`, 8, 900);
  if (!ipOk || !emailOk) return TOO_MANY;

  const result = await authService.login(data.email, data.password);
  if (!result.ok) {
    const text = { invalid: "E-mail ou senha incorretos.", pending: "Seu cadastro ainda aguarda aprovação.", blocked: "Este acesso está suspenso. Fale com a SSF." };
    return { message: text[result.reason] };
  }
  await setSessionCookie(result.token, result.expiresAt);
  redirect("/membros");
}

export async function logout() {
  await endSession();
  redirect("/");
}

export async function toggleSaved(form: FormData) {
  const user = await requireUser();
  const lessonId = String(form.get("lessonId"));
  const kind = form.get("kind") === "watched" ? "watched" : "favorite";
  if (!(await lessonService.find(lessonId))) return;
  await savedLessonRepository.toggle(user.id, lessonId, kind);
  revalidatePath("/membros");
  revalidatePath(`/aulas/${lessonId}`);
}

export async function setMemberStatus(form: FormData) {
  const admin = await requireAdmin();
  const id = String(form.get("id"));
  if (id === admin.id) return;
  await userRepository.setStatus(id, form.get("status") === "active" ? "active" : "blocked");
  revalidatePath("/admin");
}

export async function markMessageRead(form: FormData) {
  await requireAdmin();
  await messageRepository.markRead(String(form.get("id")));
  revalidatePath("/admin");
}
