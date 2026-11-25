import type { Metadata } from "next";
import Link from "next/link";
import { KotelPlayer } from "@/components/kotel/kotel-player";
import { time } from "@/components/ui/format";
import { PageHead } from "@/components/ui/page-head";
import { findCity } from "@/domain/cities";
import { calendarService } from "@/server/container";

export const metadata: Metadata = { title: "Kotel ao vivo", description: "Câmeras ao vivo do Kotel, em Jerusalém." };

export const dynamic = "force-dynamic";

export default function Kotel() {
  const city = findCity("jerusalem");
  const now = new Date();
  const z = calendarService.zmanim(city, now);
  return (
    <>
      <PageHead title="Kotel ao vivo" hebrew="הכותל המערבי">Em Jerusalém agora são {time(now, city.tz)}.</PageHead>
      <div className="wrap" style={{ paddingBottom: 96 }}>
        {calendarService.isSacredTime(city) ? <p className="notice">Em Jerusalém é Shabat ou Yom Tov. A transmissão volta após a havdalá.</p> : <KotelPlayer />}
        <dl className="rows" style={{ marginTop: 40 }}>
          <div><dt>Nascer do sol em Jerusalém</dt><dd>{time(z.netz, city.tz)}</dd></div>
          <div><dt>Pôr do sol em Jerusalém</dt><dd>{time(z.shkia, city.tz)}</dd></div>
        </dl>
        <div className="actions"><Link className="btn ghost" href="/biblioteca/tehilim/122">Ler Tehilim 122</Link></div>
      </div>
    </>
  );
}
