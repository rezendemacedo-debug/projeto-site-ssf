"use client";

import { useEffect, useState } from "react";

interface InstallEvent extends Event {
  prompt(): Promise<void>;
}

type Platform = "ios" | "outro" | "instalado" | null;

function detect(): Platform {
  if (matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone) return "instalado";
  // iPads recentes se identificam como Mac, mas têm tela de toque.
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  return ios ? "ios" : "outro";
}

/** Convite para pôr o site na tela inicial. */
export function InstallApp() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [event, setEvent] = useState<InstallEvent | null>(null);

  useEffect(() => {
    setPlatform(detect());
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallEvent);
    };
    const onInstalled = () => setPlatform("instalado");
    addEventListener("beforeinstallprompt", onPrompt);
    addEventListener("appinstalled", onInstalled);
    return () => {
      removeEventListener("beforeinstallprompt", onPrompt);
      removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (platform === "ios") return <p>No iPhone ou iPad: toque em Compartilhar e depois em “Adicionar à Tela de Início”.</p>;
  if (platform === "outro" && event) {
    return <button type="button" className="btn gold small" onClick={() => event.prompt().finally(() => setEvent(null))}>Instalar no aparelho</button>;
  }
  if (platform === "outro") return <p>No Android: abra o menu do navegador e toque em “Adicionar à tela inicial”.</p>;
  return null;
}
