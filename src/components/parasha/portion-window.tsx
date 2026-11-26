"use client";

import { useEffect, useRef } from "react";
import { day as formatDay } from "@/components/ui/format";
import type { City } from "@/domain/cities";
import { sefariaUrl, translatedSefariaUrl } from "@/domain/sefaria-link";

export interface Reading {
  date: Date;
  title: string;
  hebrew: string;
  ref: string;
}

/**
 * Pergunta se a pessoa quer a tradução e abre a porção da semana no Sefaria, no trecho exato,
 * numa janela nova do próprio navegador (o site não pode escolher outro navegador do aparelho).
 */
export function PortionWindow({ reading, city, onClose }: { reading: Reading | null; city: City; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (reading && !d.open) d.showModal();
    if (!reading && d.open) d.close();
  }, [reading]);

  function open(url: string) {
    const w = Math.min(1200, screen.availWidth - 40);
    const h = Math.min(900, screen.availHeight - 60);
    const win = window.open(url, "ssf-sefaria", `popup,width=${w},height=${h},left=${(screen.availWidth - w) / 2},top=${(screen.availHeight - h) / 2}`);
    // Se o bloqueador de janelas impedir, abre na mesma aba.
    if (!win) location.href = url;
    else win.focus();
    onClose();
  }

  return (
    <dialog ref={dialog} className="portion-window" onClose={onClose} aria-labelledby="portion-window-title">
      {reading && (
        <>
          <p className="muted">Porção da semana · Shabat, {formatDay(reading.date).replace(/^sábado, /, "")} · {city.name}</p>
          <h2 id="portion-window-title">{reading.title} <span lang="he" dir="rtl">{reading.hebrew}</span></h2>
          <p className="muted">Sefaria, {reading.ref.replace(/_/g, " ").replace(".", " ").replace(/\./g, ":")}</p>
          <p className="portion-ask">Traduzir a parte em inglês para português com o Google Tradutor?</p>
          <div className="actions">
            <button type="button" className="btn gold" onClick={() => open(translatedSefariaUrl(reading.ref))}>Sim, em português</button>
            <button type="button" className="btn ghost" onClick={() => open(sefariaUrl(reading.ref))}>Não, original</button>
          </div>
          <p className="muted portion-note">Abre numa janela nova do navegador. A tradução automática do Google não tem revisão rabínica.</p>
          <button type="button" className="portion-close" onClick={onClose} aria-label="Fechar">✕</button>
        </>
      )}
    </dialog>
  );
}
