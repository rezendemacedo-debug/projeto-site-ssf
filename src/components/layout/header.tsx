"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MemberLink } from "@/components/forms/member-link";
import { IS_STATIC, NAV, SITE } from "@/content/site";
import { Logo } from "./logo";

/** Menu sempre visível: no celular, as seções ficam em uma faixa que desliza. */
export function Header() {
  const path = usePathname();
  return (
    <header className="site-header">
      <div className="wrap header-top">
        <Link href="/" className="brand"><Logo />Sinagoga Sem Fronteiras</Link>
        <div className="header-actions">
          <a className="header-phone" href={SITE.whatsapp.url} target="_blank" rel="noopener">WhatsApp {SITE.whatsapp.label}</a>
          {!IS_STATIC && <Link href="/membros">Entrar</Link>}
          <MemberLink className="btn gold small">Seja membro</MemberLink>
        </div>
      </div>
      <nav className="nav" aria-label="Principal">
        <div className="wrap">
          {NAV.map((n) => <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}>{n.label}</Link>)}
        </div>
      </nav>
    </header>
  );
}
