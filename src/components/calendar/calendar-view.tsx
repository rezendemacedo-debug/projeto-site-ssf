import Link from "next/link";
import { Suspense } from "react";
import { CitySelect } from "@/components/ui/city-select";
import { day as formatDay, time } from "@/components/ui/format";
import { PageHead } from "@/components/ui/page-head";
import { findCity } from "@/domain/cities";
import { resolveDay } from "@/domain/resolve-day";
import { calendarService } from "@/server/services/hebrew-calendar-service";

const ZMANIM = [
  ["alot", "Alot hashachar"], ["netz", "Nets hachamá"], ["shma", "Fim do Shemá (Gra)"], ["tefila", "Fim da tefilá (Gra)"], ["chatzot", "Chatsot"],
  ["minchaGedola", "Minchá guedolá"], ["minchaKetana", "Minchá ketaná"], ["plag", "Plag haminchá"], ["shkia", "Shekiá"], ["tzeit", "Tsêt hacochavim (8,5°)"],
] as const;

export interface CalendarParams { cidade?: string; dia?: string }

export function CalendarView({ params }: { params: CalendarParams }) {
  const city = findCity(params.cidade);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: city.tz }).format(new Date());
  const { iso, year, month, day, noon, prev, next } = resolveDay(params.dia, today);
  const days = calendarService.month(city, year, month);
  const selected = days[day - 1]!;
  const z = calendarService.zmanim(city, noon);
  const holidays = calendarService.upcomingHolidays(city, 18);
  const url = (d: string) => `/calendario?cidade=${city.slug}&dia=${d}`;
  const months = [...new Set(days.map((d) => `${d.hebrewMonth} ${d.hebrewYear}`))].join(" e ");

  return (
    <>
      <PageHead title="Luach" hebrew="לוח">{calendarService.hebrewDateText(city).latin}. O dia judaico começa ao pôr do sol.</PageHead>
      <div className="wrap" style={{ paddingBottom: 72 }}>
        <div className="luach-head">
          <div><h2>{new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1))}</h2><p className="muted">{months}</p></div>
          <div className="inline">
            <Link className="btn ghost small" href={url(prev)} scroll={false}>Mês anterior</Link>
            <Link className="btn ghost small" href={url(today)} scroll={false}>Hoje</Link>
            <Link className="btn ghost small" href={url(next)} scroll={false}>Próximo mês</Link>
          </div>
        </div>
        <div className="inline" style={{ marginBottom: 24 }}>
          <Suspense><CitySelect value={city.slug} /></Suspense>
          <form className="inline"><input type="hidden" name="cidade" value={city.slug} /><label className="inline">Converter data<input type="date" name="dia" defaultValue={iso} key={iso} min="1900-01-01" max="2200-12-31" /></label><button className="btn ghost small">Ir</button></form>
        </div>
        <div className="luach">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Shabat"].map((d) => <span className="wd" key={d}>{d}</span>)}
          {days.map((d) => {
            const key = `${iso.slice(0, 8)}${String(d.day).padStart(2, "0")}`;
            return (
              <Link
                key={d.day} href={url(key)} scroll={false} style={d.day === 1 ? { gridColumnStart: d.weekday + 1 } : undefined}
                data-holy={d.weekday === 6 || d.isYomTov} data-today={key === today} data-fest={d.holidays.length > 0} aria-current={d.day === day ? "date" : undefined}
                aria-label={`${d.day}, ${d.full}${d.holidays.length ? `, ${d.holidays.join(", ")}` : ""}`}
              >
                <span className="top"><span>{d.day}</span><span lang="he">{d.hebrewDay}</span></span>
                {d.holidays.map((h) => <span className="fest extra" key={h}>{h}</span>)}
                {d.parasha && <span className="extra">{d.parasha}</span>}
                {d.candles && <span className="extra">Velas {time(d.candles, city.tz)}</span>}
                {d.havdalah && <span className="extra">Havdalá {time(d.havdalah, city.tz)}</span>}
              </Link>
            );
          })}
        </div>
      </div>
      <section className="section deep">
        <div className="wrap cols">
          <div>
            <p lang="he" dir="rtl" style={{ fontSize: "1.5rem", textAlign: "left" }}>{selected.full}</p>
            <h2>{formatDay(new Date(year, month - 1, day))}</h2>
            <p className="lead" style={{ marginTop: 12 }}>{[...selected.holidays, selected.parasha && `Parashá ${selected.parasha}`, selected.omer && `${selected.omer}º dia do Ômer`].filter(Boolean).join(". ")}</p>
            <dl className="rows" style={{ marginTop: 18 }}>
              {selected.candles && <div><dt>Acendimento das velas</dt><dd>{time(selected.candles, city.tz)}</dd></div>}
              {selected.havdalah && <div><dt>Havdalá</dt><dd>{time(selected.havdalah, city.tz)}</dd></div>}
              {ZMANIM.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{time(z[key], city.tz)}</dd></div>)}
            </dl>
            <p className="sources">Cálculo astronômico (Hebcal), {city.name}, sem elevação. Os horários são aproximados: antecipe alguns minutos e siga a orientação do seu rabino.</p>
          </div>
          <div><h2>Próximas datas</h2><ul className="rows" style={{ marginTop: 20 }}>{holidays.map((h) => <li key={h.name}><Link href={url(new Intl.DateTimeFormat("en-CA").format(h.date))}>{h.name}</Link><time>{new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(h.date)}</time></li>)}</ul><p className="sources">Festas começam ao pôr do sol da véspera.</p></div>
        </div>
      </section>
    </>
  );
}
