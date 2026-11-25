"use client";

import { useEffect, useState } from "react";
import { type City, DEFAULT_CITY } from "@/domain/cities";

/** Shabat ou Yom Tov agora; null até o navegador calcular. */
export function useSacredTime(city: City = DEFAULT_CITY) {
  const [sacred, setSacred] = useState<boolean | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    let active = true;
    // Carregado sob demanda para não pesar em todas as páginas.
    import("@/server/services/hebrew-calendar-service").then(({ calendarService }) => {
      if (!active) return;
      const update = () => setSacred(calendarService.isSacredTime(city));
      update();
      timer = setInterval(update, 60_000);
    });
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [city]);
  return sacred;
}
