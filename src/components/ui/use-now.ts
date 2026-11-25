"use client";

import { useEffect, useState } from "react";

/** Hora atual, atualizada a cada minuto. Na primeira renderização usa o valor do build. */
export function useNow(initial: number) {
  const [now, setNow] = useState(initial);
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);
  return new Date(now);
}
