"use client";

import Link from "next/link";
import { time } from "@/components/ui/format";
import { useNow } from "@/components/ui/use-now";
import { DEFAULT_CITY as city } from "@/domain/cities";
import { skyPhase } from "@/domain/sky";
import { calendarService } from "@/server/services/hebrew-calendar-service";
import { SkyHero } from "./sky-hero";

export function HomeHero({ builtAt }: { builtAt: number }) {
  const now = useNow(builtAt);
  const z = calendarService.zmanim(city, now);
  const shabbat = calendarService.shabbat(city, now);
  const date = calendarService.hebrewDateText(city, now);
  const omer = calendarService.omer(city, now);
  const times = { alot: +z.alot, netz: +z.netz, plag: +z.plag, shkia: +z.shkia, tzeit: +z.tzeit };
  const parasha = shabbat.parashiot.map((p) => p.name).join(" e ");

  return (
    <SkyHero phase={skyPhase(times, +now)}>
      <div className="wrap sky-content">
        <p className="he" lang="he" dir="rtl" style={{ textAlign: "left" }}>{date.hebrew}</p>
        <h1>Torá sem fronteiras.</h1>
        <p className="lead">Aulas do Rabino Ventura, textos sagrados, hebraico e os horários do seu dia judaico.</p>
        <div className="actions">
          <Link href="/aulas" className="btn">Assistir às aulas</Link>
          <Link href="/parasha" className="btn ghost">Parashá {parasha}</Link>
        </div>
      </div>
      <div className="sky-facts">
        <div className="wrap">
          <dl>
            <div><dt>Hoje</dt><dd>{date.latin}</dd></div>
            {omer ? <div><dt>Ômer</dt><dd>{omer.day}º dia</dd></div> : <div><dt>Pôr do sol, {city.name}</dt><dd>{time(z.shkia, city.tz)}</dd></div>}
            <div><dt>Velas de Shabat</dt><dd>{time(shabbat.candles, city.tz)}</dd></div>
            <div><dt>Havdalá</dt><dd>{time(shabbat.havdalah, city.tz)}</dd></div>
          </dl>
        </div>
      </div>
    </SkyHero>
  );
}
