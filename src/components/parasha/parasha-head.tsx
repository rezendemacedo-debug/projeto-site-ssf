"use client";

import { useState } from "react";
import { useCity } from "@/components/calendar/use-city";
import { day } from "@/components/ui/format";
import { PageHead } from "@/components/ui/page-head";
import { useNow } from "@/components/ui/use-now";
import { calendarService } from "@/server/services/hebrew-calendar-service";
import { PortionWindow, type Reading } from "./portion-window";

/** Título da página da parashá: acompanha a cidade escolhida e vira a semana após a havdalá. */
export function ParashaHead({ builtAt }: { builtAt: number }) {
  const now = useNow(builtAt);
  const city = useCity();
  const s = calendarService.shabbat(city, now);
  const week = calendarService.weeklyReading(city, s.date);
  const [open, setOpen] = useState<Reading | null>(null);
  const title = s.parashiot.map((p) => p.name).join(" e ");
  const books = [...new Set(s.parashiot.map((p) => p.book))].join(", ");
  const date = day(s.date).replace(/^sábado, /, "");

  return (
    <>
      <PageHead title={week?.title ?? (title ? `Parashá ${title}` : "Shabat festivo")} hebrew={s.parashaHebrew || week?.hebrew}>
        {title ? `Porção Semanal da Torá. ${books}. Lida no Shabat, ${date}, em ${city.name}.` : `Neste Shabat de ${date}, lê-se a porção da festa.`}
      </PageHead>
      {week && (
        <div className="wrap portion-cta">
          <button type="button" className="btn gold" onClick={() => setOpen(week)}>Ler a porção desta semana no Sefaria</button>
        </div>
      )}
      <PortionWindow reading={open} city={city} onClose={() => setOpen(null)} />
    </>
  );
}
