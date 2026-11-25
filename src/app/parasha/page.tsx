import type { Metadata } from "next";
import Link from "next/link";
import { LessonGrid } from "@/components/lessons/lesson-card";
import { day } from "@/components/ui/format";
import { PageHead } from "@/components/ui/page-head";
import { ShabbatTimes } from "@/components/parasha/shabbat-times";
import { DEFAULT_CITY as city } from "@/domain/cities";
import { calendarService, lessonService } from "@/server/container";

export const metadata: Metadata = { title: "Parashá da semana" };

export default async function Parasha() {
  const s = calendarService.shabbat(city);
  const [own, recent] = await Promise.all([
    lessonService.forParasha(s.parashiot, 12), lessonService.latest("parasha", 8),
  ]);
  const title = s.parashiot.map((p) => p.name).join(" e ");
  return (
    <>
      <PageHead title={title || "Shabat festivo"} hebrew={s.parashaHebrew}>
        {title ? `${[...new Set(s.parashiot.map((p) => p.book))].join(", ")}. Lida no Shabat, ${day(s.date).replace(/^sábado, /, "")}.` : `Neste Shabat de ${day(s.date)}, lê-se a porção da festa.`}
      </PageHead>
      <section className="section">
        <div className="wrap cols">
          <ShabbatTimes builtAt={Date.now()} />
        </div>
      </section>
      <section className="section deep">
        <div className="wrap"><div className="section-head"><h2>{own.length > 0 ? `Aulas sobre ${title}` : "Aulas de parashá"}</h2><Link className="link" href="/aulas?tema=parasha">Todas as aulas de parashá</Link></div><LessonGrid lessons={own.length > 0 ? own : recent} /></div>
      </section>
    </>
  );
}
