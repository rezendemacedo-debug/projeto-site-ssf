"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/copy-button";

export interface DonateOption { label: string; payload: string; qr: string }

export function DonateOptions({ options, pixKey }: { options: DonateOption[]; pixKey: string }) {
  const [index, setIndex] = useState(0);
  const { payload, qr } = options[index]!;
  return (
    <>
      <div className="inline" role="group" aria-label="Valor" style={{ marginBottom: 36 }}>
        {options.map((o, i) => <button key={o.label} type="button" aria-pressed={i === index} className={`btn${i === index ? "" : " ghost"}`} onClick={() => setIndex(i)}>{o.label}</button>)}
      </div>
      <div className="pix">
        {/* QR Code gerado no navegador como data URL: o otimizador de imagens do Next não se aplica. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="QR Code do PIX da Sinagoga Sem Fronteiras" width={260} height={260} />
        <div><h2>PIX</h2><p>Chave: <strong>{pixKey}</strong></p><code>{payload}</code><CopyButton key={payload} text={payload} label="Copiar código PIX" /><p className="muted" style={{ marginTop: 14 }}>Confira o nome do recebedor no seu banco antes de confirmar.</p></div>
      </div>
    </>
  );
}
