import type { Metadata } from "next";
import Link from "next/link";
import { LessonGrid } from "@/components/lessons/lesson-card";
import { CalendarView } from "@/components/calendar/calendar-view";
import { ParashaHead } from "@/components/parasha/parasha-head";
import { ShabbatTimes } from "@/components/parasha/shabbat-times";
import { DEFAULT_CITY as city } from "@/domain/cities";
import { calendarService, lessonService } from "@/server/container";

export const metadata: Metadata = { title: "Porção Semanal da Torá" };

export default async function Parasha() {
  const s = calendarService.shabbat(city);
  const [own, recent] = await Promise.all([
    lessonService.forParasha(s.parashiot, 12), lessonService.latest("parasha", 8),
  ]);
  const title = s.parashiot.map((p) => p.name).join(" e ");
  return (
    <>
      <ParashaHead builtAt={Date.now()} />
      <section className="wrap" style={{ paddingBottom: 56 }}>
        <ShabbatTimes builtAt={Date.now()} />
        <CalendarView builtAt={Date.now()} holidays={false} />
      </section>
      <section className="section deep">
        <div className="wrap"><div className="section-head"><h2>{own.length > 0 ? `Aulas sobre ${title}` : "Aulas da porção semanal"}</h2><Link className="link" href="/aulas?tema=parasha">Todas as aulas da porção semanal</Link></div><LessonGrid lessons={own.length > 0 ? own : recent} /></div>
      </section>
    </>
  );
}
