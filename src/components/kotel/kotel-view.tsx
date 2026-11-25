"use client";

import Link from "next/link";
import { time } from "@/components/ui/format";
import { PageHead } from "@/components/ui/page-head";
import { useNow } from "@/components/ui/use-now";
import { useSacredTime } from "@/components/ui/use-sacred-time";
import { findCity } from "@/domain/cities";
import { calendarService } from "@/server/services/hebrew-calendar-service";
import { KotelPlayer } from "./kotel-player";

const city = findCity("jerusalem");

export function KotelView({ builtAt }: { builtAt: number }) {
  const now = useNow(builtAt);
  const sacred = useSacredTime(city);
  const z = calendarService.zmanim(city, now);
  return (
    <>
      <PageHead title="Kotel ao vivo" hebrew="הכותל המערבי">Em Jerusalém agora são {time(now, city.tz)}.</PageHead>
      <div className="wrap" style={{ paddingBottom: 96 }}>
        {sacred && <p className="notice">Em Jerusalém é Shabat ou Yom Tov. A transmissão volta após a havdalá.</p>}
        {sacred === false && <KotelPlayer />}
        <dl className="rows" style={{ marginTop: 40 }}>
          <div><dt>Nascer do sol em Jerusalém</dt><dd>{time(z.netz, city.tz)}</dd></div>
          <div><dt>Pôr do sol em Jerusalém</dt><dd>{time(z.shkia, city.tz)}</dd></div>
        </dl>
        <div className="actions"><Link className="btn ghost" href="/biblioteca/tehilim/122">Ler Tehilim 122</Link></div>
      </div>
    </>
  );
}
