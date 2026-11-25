"use client";

import { useEffect } from "react";
import { BASE_PATH, IS_STATIC } from "@/content/site";

/** Só na versão estática: a versão com login não deve guardar páginas no aparelho. */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (IS_STATIC && "serviceWorker" in navigator) {
      navigator.serviceWorker.register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` }).catch(() => {
        // Sem service worker o site funciona normalmente, apenas sem modo offline.
      });
    }
  }, []);
  return null;
}
