import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { authService } from "../container";

const COOKIE = "ssf_session";

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

export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
