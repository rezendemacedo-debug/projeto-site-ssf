"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IS_STATIC, NAV } from "@/content/site";
import { Logo } from "./logo";

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" onClick={close}><Logo />Sinagoga Sem Fronteiras</Link>
        <nav id="nav" className="nav" data-open={open} aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={close} aria-current={path.startsWith(n.href) ? "page" : undefined}>{n.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          {!IS_STATIC && <Link href="/membros" onClick={close}>Entrar</Link>}
          <Link href="/seja-membro" className="btn gold small" onClick={close}>Seja membro</Link>
        </div>
        <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>
          <span className="sr">{open ? "Fechar menu" : "Abrir menu"}</span>
          <svg viewBox="0 0 22 22" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={open ? "M4 4l14 14M18 4 4 18" : "M2 7h18M2 15h18"} /></svg>
        </button>
      </div>
    </header>
  );
}
