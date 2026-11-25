"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_CITY, findCity } from "@/domain/cities";

const STORAGE_KEY = "ssf-cidade";
const listeners = new Set<() => void>();
let current: string | undefined;

function read() {
  if (current === undefined) {
    try {
      current = findCity(localStorage.getItem(STORAGE_KEY) ?? undefined).slug;
    } catch {
      current = DEFAULT_CITY.slug; // Sem armazenamento, vale a cidade padrão.
    }
  }
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setCity(slug: string) {
  current = findCity(slug).slug;
  try {
    localStorage.setItem(STORAGE_KEY, current);
  } catch {
    // A escolha vale só para esta visita.
  }
  for (const listener of listeners) listener();
}

/** Cidade escolhida, compartilhada por todos os horários da tela. */
export function useCity() {
  return findCity(useSyncExternalStore(subscribe, read, () => DEFAULT_CITY.slug));
}
