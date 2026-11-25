"use client";

import type { ReactNode } from "react";
import { useSacredTime } from "@/components/ui/use-sacred-time";
import { EDITORIAL_POLICY } from "@/content/editorial-policy";

/** Suspende doações e formulários durante Shabat e Yom Tov. */
export function SacredGate({ children }: { children: ReactNode }) {
  const sacred = useSacredTime();
  if (!EDITORIAL_POLICY.pauseOnSacredTime) return children;
  if (sacred === null) return <p className="notice" aria-busy="true">Carregando</p>;
  if (sacred) return <p className="notice">Este serviço está suspenso durante Shabat e Yom Tov e volta após a havdalá.</p>;
  return children;
}
