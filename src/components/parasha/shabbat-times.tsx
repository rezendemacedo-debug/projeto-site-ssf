"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { time } from "@/components/ui/format";
import { useNow } from "@/components/ui/use-now";
import { CITIES, DEFAULT_CITY, findCity } from "@/domain/cities";
import { calendarService } from "@/server/services/hebrew-calendar-service";

const STORAGE_KEY = "ssf-cidade";

export function ShabbatTimes({ builtAt }: { builtAt: number }) {
  const now = useNow(builtAt);
  const [slug, setSlug] = useState(DEFAULT_CITY.slug);
  const city = findCity(slug);
  const shabbat = calendarService.shabbat(city, now);

  useEffect(() => {
    try {
      setSlug(findCity(localStorage.getItem(STORAGE_KEY) ?? undefined).slug);
    } catch {
      // Sem armazenamento, vale a cidade padrão.
    }
  }, []);

  function choose(next: string) {
    setSlug(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // A escolha vale só para esta visita.
    }
  }

  return (
    <div>
      <h2>Shabat em {city.name}</h2>
      <label className="inline" style={{ marginTop: 18 }}>
        Ver em outra cidade
        <select value={slug} onChange={(e) => choose(e.target.value)}>
          {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </label>
      <dl className="rows" style={{ marginTop: 12 }} aria-live="polite">
        <div><dt>Porção da Torá</dt><dd>{shabbat.parashiot.map((p) => p.name).join(" e ") || "Leitura da festa"}</dd></div>
        <div><dt>Acendimento das velas</dt><dd>{time(shabbat.candles, city.tz)}</dd></div>
        <div><dt>Havdalá</dt><dd>{time(shabbat.havdalah, city.tz)}</dd></div>
      </dl>
      <p style={{ marginTop: 18 }}><Link className="link" href={`/calendario?cidade=${slug}`}>Todos os horários em {city.name}</Link></p>
    </div>
  );
}
