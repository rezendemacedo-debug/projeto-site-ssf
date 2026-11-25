"use client";

import Link from "next/link";
import { useNow } from "@/components/ui/use-now";
import { DEFAULT_CITY } from "@/domain/cities";
import { calendarService } from "@/server/services/hebrew-calendar-service";

/** Destaque da porção desta semana, sempre atualizado no navegador. */
export function WeeklyPortion({ builtAt }: { builtAt: number }) {
  const { parashiot, parashaHebrew } = calendarService.shabbat(DEFAULT_CITY, useNow(builtAt));
  const name = parashiot.map((p) => p.name).join(" e ");
  return (
    <aside className="portion">
      <p>Porção Semanal da Torá</p>
      <p className="portion-name">{name ? `Parashá ${name}` : "Leitura da festa"}</p>
      {parashaHebrew && <p lang="he" dir="rtl">{parashaHebrew}</p>}
      <Link href="/parasha" className="btn gold">Estudar a porção desta semana</Link>
    </aside>
  );
}
