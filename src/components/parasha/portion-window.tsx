"use client";

import { useEffect, useRef, useState } from "react";
import { day as formatDay } from "@/components/ui/format";
import type { City } from "@/domain/cities";
import { sefariaUrl, translatedSefariaUrl } from "@/domain/sefaria-link";

export interface Reading {
  date: Date;
  title: string;
  hebrew: string;
  ref: string;
}

/** Janela flutuante com a porção da semana aberta no Sefaria, no trecho exato. */
export function PortionWindow({ reading, city, onClose }: { reading: Reading | null; city: City; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (reading && !d.open) d.showModal();
    if (!reading && d.open) d.close();
  }, [reading]);

  return (
    <dialog ref={dialog} className="portion-window" onClose={onClose} aria-labelledby="portion-window-title">
      {/* A chave recria o conteúdo a cada abertura: a pergunta da tradução volta sempre. */}
      {reading && <PortionContent key={`${reading.ref}-${+reading.date}`} reading={reading} city={city} onClose={onClose} />}
    </dialog>
  );
}

function PortionContent({ reading, city, onClose }: { reading: Reading; city: City; onClose: () => void }) {
  const [answered, setAnswered] = useState(false);
  const place = reading.ref.replace(/_/g, " ").replace(".", " ").replace(/\./g, ":");

  // O Google Tradutor não aceita ser embutido em outro site: a versão em português abre numa janela própria.
  function translate() {
    const w = Math.min(1100, screen.availWidth - 40);
    const h = Math.min(860, screen.availHeight - 60);
    const opened = window.open(translatedSefariaUrl(reading.ref), "ssf-traducao", `popup,width=${w},height=${h},left=${(screen.availWidth - w) / 2},top=${(screen.availHeight - h) / 2}`);
    opened?.focus();
    setAnswered(true);
  }

  return (
    <>
      <header>
        <div>
          <p className="muted">Porção da semana · Shabat, {formatDay(reading.date).replace(/^sábado, /, "")} · {city.name}</p>
          <h2 id="portion-window-title">{reading.title} <span lang="he" dir="rtl">{reading.hebrew}</span></h2>
        </div>
        <button type="button" className="btn ghost small" onClick={onClose}>Fechar ✕</button>
      </header>
      <div className="portion-translate" role="group" aria-label="Tradução">
        {answered ? (
          <button type="button" className="btn ghost small" onClick={translate}>Ver em português (Google Tradutor)</button>
        ) : (
          <>
            <span>Traduzir a parte em inglês para português com o Google Tradutor?</span>
            <button type="button" className="btn gold small" onClick={translate}>Sim, traduzir</button>
            <button type="button" className="btn ghost small" onClick={() => setAnswered(true)}>Não, obrigado</button>
          </>
        )}
      </div>
      <iframe src={sefariaUrl(reading.ref)} title={`${reading.title} no Sefaria`} />
      <p className="muted portion-note">
        Sefaria, {place}. A tradução automática do Google não tem revisão rabínica.{" "}
        <a href={sefariaUrl(reading.ref)} target="_blank" rel="noopener">Abrir no Sefaria</a>
      </p>
    </>
  );
}
