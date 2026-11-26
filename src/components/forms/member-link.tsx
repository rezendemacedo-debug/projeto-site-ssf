import Link from "next/link";

/** Leva ao cadastro de membro: com servidor, em etapas com código por e-mail; no GitHub Pages, formulário enviado pelo WhatsApp. */
export function MemberLink({ className, children }: { className: string; children: string }) {
  return <Link className={className} href="/seja-membro">{children}</Link>;
}
