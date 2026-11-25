import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { SacredGate } from "@/components/forms/sacred-gate";
import { CopyButton } from "@/components/ui/copy-button";
import { PageHead } from "@/components/ui/page-head";
import { PIX, SITE } from "@/content/site";

export const metadata: Metadata = { title: "Doar" };

const AMOUNTS = [18, 36, 100, 180, 360];

export default async function Donate({ searchParams }: { searchParams: Promise<{ valor?: string }> }) {
  const value = Number((await searchParams).valor);
  const amount = AMOUNTS.includes(value) ? value : undefined;
  const payload = PIX.build(amount);
  const qr = await QRCode.toDataURL(payload, { width: 520, margin: 1 });
  return (
    <>
      <PageHead title="Tsedaká" hebrew="צדקה">A SSF é uma organização sem fins lucrativos, com projeto de amparo a pessoas carentes.</PageHead>
      <div className="wrap" style={{ paddingBottom: 96 }}>
        <SacredGate>
          <nav className="inline" aria-label="Valor" style={{ marginBottom: 36 }}>
            <Link scroll={false} className={`btn${amount ? " ghost" : ""}`} href="/doar">Valor livre</Link>
            {AMOUNTS.map((a) => <Link scroll={false} key={a} className={`btn${a === amount ? "" : " ghost"}`} href={`/doar?valor=${a}`}>R$ {a}</Link>)}
          </nav>
          <div className="pix">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="QR Code do PIX da Sinagoga Sem Fronteiras" width={260} height={260} />
            <div><h2>PIX</h2><p>Chave: <strong>{SITE.pixKey}</strong></p><code>{payload}</code><CopyButton key={payload} text={payload} label="Copiar código PIX" /><p className="muted" style={{ marginTop: 14 }}>Confira o nome do recebedor no seu banco antes de confirmar.</p></div>
          </div>
        </SacredGate>
        <p className="sources">Empresas podem ter abatimento fiscal. Informações por <a className="link" href={SITE.whatsapp.url} target="_blank" rel="noopener">WhatsApp {SITE.whatsapp.label}</a>.</p>
      </div>
    </>
  );
}
