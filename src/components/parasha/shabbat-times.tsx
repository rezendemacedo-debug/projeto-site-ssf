"use client";

import { useCity } from "@/components/calendar/use-city";
import { time } from "@/components/ui/format";
import { useNow } from "@/components/ui/use-now";
import { calendarService } from "@/server/services/hebrew-calendar-service";

/** Faixa com os horários do próximo Shabat na cidade escolhida no calendário. */
export function ShabbatTimes({ builtAt }: { builtAt: number }) {
  const now = useNow(builtAt);
  const city = useCity();
  const shabbat = calendarService.shabbat(city, now);
  return (
    <dl className="shabbat-strip" aria-live="polite">
      <div><dt>Shabat em</dt><dd>{city.name}</dd></div>
      <div><dt>Porção da Torá</dt><dd>{shabbat.parashiot.map((p) => p.name).join(" e ") || "Leitura da festa"}</dd></div>
      <div><dt>Velas</dt><dd>{time(shabbat.candles, city.tz)}</dd></div>
      <div><dt>Havdalá</dt><dd>{time(shabbat.havdalah, city.tz)}</dd></div>
    </dl>
  );
}
