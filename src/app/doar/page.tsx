import type { Metadata } from "next";
import QRCode from "qrcode";
import { DonateOptions } from "@/components/forms/donate-options";
import { SacredGate } from "@/components/forms/sacred-gate";
import { PageHead } from "@/components/ui/page-head";
import { PIX, SITE } from "@/content/site";

export const metadata: Metadata = { title: "Doar" };

const AMOUNTS = [undefined, 18, 36, 100, 180, 360];

export default async function Donate() {
  const options = await Promise.all(
    AMOUNTS.map(async (amount) => {
      const payload = PIX.build(amount);
      return { label: amount ? `R$ ${amount}` : "Valor livre", payload, qr: await QRCode.toDataURL(payload, { width: 520, margin: 1 }) };
    }),
  );
  return (
    <>
      <PageHead title="Tsedaká" hebrew="צדקה">A SSF é uma organização sem fins lucrativos, com projeto de amparo a pessoas carentes.</PageHead>
      <div className="wrap" style={{ paddingBottom: 96 }}>
        <SacredGate><DonateOptions options={options} pixKey={SITE.pixKey} /></SacredGate>
        <p className="sources">Empresas podem ter abatimento fiscal. Informações por <a className="link" href={SITE.whatsapp.url} target="_blank" rel="noopener">WhatsApp {SITE.whatsapp.label}</a>.</p>
      </div>
    </>
  );
}
