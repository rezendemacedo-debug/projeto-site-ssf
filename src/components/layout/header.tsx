"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { IS_STATIC, NAV } from "@/content/site";
import { Logo } from "./logo";

/** Menu sempre visível: no celular, as seções ficam em uma faixa que desliza. */
export function Header() {
  const path = usePathname();
  const strip = useRef<HTMLDivElement>(null);

  // Na faixa que desliza, mantém à vista a seção atual.
  useEffect(() => {
    const active = strip.current?.querySelector<HTMLElement>("[aria-current]");
    if (strip.current && active) strip.current.scrollLeft = active.offsetLeft - (strip.current.clientWidth - active.offsetWidth) / 2;
  }, [path]);

  return (
    <header className="site-header">
      <div className="wrap header-top">
        <Link href="/" className="brand"><Logo />Sinagoga Sem Fronteiras</Link>
        <div className="header-actions">
          {!IS_STATIC && <Link href="/membros">Entrar</Link>}
          <div className="header-donate">
            <Link href="/doar" className="btn gold small">Doação/Tzedaká</Link>
            <em>Não efetuar doação no Shabat e Yom Tov</em>
          </div>
        </div>
      </div>
      <nav className="nav" aria-label="Principal">
        <div className="wrap" ref={strip}>
          {NAV.map((n) => <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}>{n.label}</Link>)}
        </div>
      </nav>
    </header>
  );
}
