"use client";

import { useSacredTime } from "@/components/ui/use-sacred-time";

export function SacredBanner() {
  if (!useSacredTime()) return null;
  return <p className="sacred">Shabat e Yom Tov: doações e formulários ficam suspensos até a havdalá em São Paulo.</p>;
}
