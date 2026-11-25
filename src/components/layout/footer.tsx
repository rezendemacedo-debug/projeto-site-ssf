import Link from "next/link";
import { InstallApp } from "@/components/pwa/install-app";
import { FOOTER, SITE, SOCIAL } from "@/content/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="stack">
            <p><strong>{SITE.name}</strong></p>
            <p><a className="link" href={SITE.whatsapp.url} target="_blank" rel="noopener">WhatsApp {SITE.whatsapp.label}</a></p>
            <InstallApp />
            <ul>{SOCIAL.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.name} <span className="muted">{s.handle}</span></a></li>)}</ul>
          </div>
          {FOOTER.map((g) => (
            <div key={g.title}>
              <h2>{g.title}</h2>
              <ul>{g.links.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-note">
          <p>Este site contém textos sagrados. Se imprimir alguma página, trate-a com respeito e encaminhe-a à guenizá.</p>
          <p>Ser membro desta plataforma não constitui conversão nem define status judaico, que cabem exclusivamente a um Beit Din ortodoxo competente.</p>
          <p>Pedimos que não seja usado em Shabat e Yom Tov.</p>
        </div>
      </div>
    </footer>
  );
}
