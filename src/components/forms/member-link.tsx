"use client";

import Link from "next/link";
import { useSacredTime } from "@/components/ui/use-sacred-time";
import { IS_STATIC, SITE } from "@/content/site";

export const MEMBER_URL = `${SITE.whatsapp.url}?text=${encodeURIComponent("Shalom! Quero ser membro da Sinagoga Sem Fronteiras.")}`;

/** Sem formulário (versão estática), vai direto ao WhatsApp; em Shabat, à página informativa. */
export function MemberLink({ className, children }: { className: string; children: string }) {
  const sacred = useSacredTime();
  if (IS_STATIC && sacred === false) return <a className={className} href={MEMBER_URL} target="_blank" rel="noopener">{children}</a>;
  return <Link className={className} href="/seja-membro">{children}</Link>;
}
