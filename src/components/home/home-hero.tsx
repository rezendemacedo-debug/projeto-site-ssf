"use client";

import Link from "next/link";
import { MemberLink } from "@/components/forms/member-link";
import { time } from "@/components/ui/format";
import { useNow } from "@/components/ui/use-now";
import { useSacredTime } from "@/components/ui/use-sacred-time";
import { SITE } from "@/content/site";
import { DEFAULT_CITY as city } from "@/domain/cities";
import { skyPhase } from "@/domain/sky";
import { calendarService } from "@/server/services/hebrew-calendar-service";
import { SkyHero } from "./sky-hero";

const STUDY_URL = `${SITE.whatsapp.url}?text=${encodeURIComponent("Shalom! Quero estudar Torá e saber como ser membro da Sinagoga Sem Fronteiras.")}`;

export function HomeHero({ builtAt }: { builtAt: number }) {
  const now = useNow(builtAt);
  const sacred = useSacredTime();
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
        <h1>A sinagoga para todos.</h1>
          <p className="lead">Estude Torá com o Rabino Ventura e faça parte da Sinagoga Sem Fronteiras, com membros em mais de 30 países.</p>
          <div className="actions">
            <MemberLink className="btn gold">Quero ser membro</MemberLink>
            {!sacred && <a href={STUDY_URL} className="btn ghost" target="_blank" rel="noopener">Estudar Torá pelo WhatsApp</a>}
          </div>
          <Link href="/parasha" className="hero-portion">
            <span>Porção Semanal da Torá</span>
            <strong>{parasha ? `Parashá ${parasha}` : "Leitura da festa"}</strong>
          </Link>
          <p className="hero-contact">
            {!sacred && <span>WhatsApp <a href={STUDY_URL} target="_blank" rel="noopener">{SITE.whatsapp.label}</a></span>}
          </p>
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
