import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { authService } from "../container";

const COOKIE = "ssf_session";
const SIGNUP_COOKIE = "ssf_cadastro";

/** Token que acompanha as etapas do cadastro de membro (2 horas). */
export async function setSignupCookie(token: string) {
  (await cookies()).set(SIGNUP_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 2 * 3600 });
}

export async function signupToken() {
  return (await cookies()).get(SIGNUP_COOKIE)?.value ?? "";
}

export async function setSessionCookie(token: string, expires: Date) {
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await authService.logout(token);
  jar.delete(COOKIE);
}

export const currentUser = cache(async () => {
  const token = (await cookies()).get(COOKIE)?.value;
  return token ? authService.authenticate(token) : null;
});

export async function requireUser() {
  return (await currentUser()) ?? redirect("/entrar");
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/membros");
  return user;
}

/**
 * IP do visitante para o limite de tentativas. Usa o último item de X-Forwarded-For, que é o
 * que o nosso proxy acrescentou: os primeiros podem ser inventados por quem faz a requisição.
 * Na Vercel o cabeçalho tem um só valor, definido pela própria plataforma.
 */
export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",").at(-1)?.trim() || h.get("x-real-ip") || "local";
}
