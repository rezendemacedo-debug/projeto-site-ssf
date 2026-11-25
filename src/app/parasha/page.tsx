import type { Metadata } from "next";
import Link from "next/link";
import { LessonGrid } from "@/components/lessons/lesson-card";
import { day, time } from "@/components/ui/format";
import { PageHead } from "@/components/ui/page-head";
import { DEFAULT_CITY as city } from "@/domain/cities";
import { calendarService, lessonService, libraryService } from "@/server/container";

export const metadata: Metadata = { title: "Parashá da semana" };

export default async function Parasha() {
  const s = calendarService.shabbat(city);
  const [own, recent, studies] = await Promise.all([
    lessonService.forParasha(s.parashiot, 12), lessonService.latest("parasha", 8), libraryService.dailyStudy(city.tz),
  ]);
  const title = s.parashiot.map((p) => p.name).join(" e ");
  return (
    <>
      <PageHead title={title || "Shabat festivo"} hebrew={s.parashaHebrew}>
        {title ? `${[...new Set(s.parashiot.map((p) => p.book))].join(", ")}. Lida no Shabat, ${day(s.date)}.` : `Neste Shabat, ${day(s.date)}, lê-se a porção da festa.`}
      </PageHead>
      <section className="section">
        <div className="wrap cols">
          <div><h2>Shabat em {city.name}</h2><dl className="rows" style={{ marginTop: 20 }}><div><dt>Acendimento das velas</dt><dd>{time(s.candles, city.tz)}</dd></div><div><dt>Havdalá</dt><dd>{time(s.havdalah, city.tz)}</dd></div></dl><p style={{ marginTop: 18 }}><Link className="link" href="/calendario">Ver em outra cidade</Link></p></div>
          {studies.length > 0 && <div><h2>Estudo de hoje</h2><ul className="rows" style={{ marginTop: 20 }}>{studies.map((i) => <li key={i.title}><span>{i.title}</span><a className="link" lang="he" dir="rtl" href={i.url} target="_blank" rel="noopener">{i.hebrew}</a></li>)}</ul></div>}
        </div>
      </section>
      <section className="section deep">
        <div className="wrap"><div className="section-head"><h2>{own.length > 0 ? `Aulas sobre ${title}` : "Aulas de parashá"}</h2><Link className="link" href="/aulas?tema=parasha">Todas as aulas de parashá</Link></div><LessonGrid lessons={own.length > 0 ? own : recent} /></div>
      </section>
    </>
  );
}
