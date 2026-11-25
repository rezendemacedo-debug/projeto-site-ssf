"use client";

import { useState } from "react";
import { KOTEL_CAMERAS } from "@/content/kotel";

export function KotelPlayer() {
  const [camera, setCamera] = useState<(typeof KOTEL_CAMERAS)[number]>(KOTEL_CAMERAS[1]);
  return (
    <>
      <iframe key={camera.id} className="player" src={camera.player} title={`Kotel ao vivo: ${camera.name}`} allow="autoplay; fullscreen" referrerPolicy="strict-origin-when-cross-origin" />
      <div className="segmented" role="group" aria-label="Câmera">
        {KOTEL_CAMERAS.map((c) => <button key={c.id} type="button" aria-pressed={c.id === camera.id} onClick={() => setCamera(c)}>{c.name}</button>)}
      </div>
      <p className="muted">Imagens da <a className="link" href={camera.page} target="_blank" rel="noopener">Western Wall Heritage Foundation</a>. Se o vídeo não abrir, assista na página oficial.</p>
    </>
  );
}
