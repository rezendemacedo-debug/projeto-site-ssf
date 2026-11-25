"use client";

import { useState } from "react";
import { day as formatDay, time } from "@/components/ui/format";
import { useNow } from "@/components/ui/use-now";
import { CITIES } from "@/domain/cities";
import { resolveDay } from "@/domain/resolve-day";
import { calendarService } from "@/server/services/hebrew-calendar-service";
import { setCity, useCity } from "./use-city";

const ZMANIM = [
  ["alot", "Alvorada (Alot hashachar)"], ["netz", "Nascer do sol (Nets)"], ["shma", "Limite do Shemá (Gra)"], ["tefila", "Limite da oração da manhã (Gra)"],
  ["chatzot", "Meio-dia haláchico (Chatsot)"], ["minchaGedola", "Início da oração da tarde (Minchá guedolá)"], ["minchaKetana", "Minchá ketaná"],
  ["plag", "Plag haminchá"], ["shkia", "Pôr do sol (Shekiá)"], ["tzeit", "Saída das estrelas (8,5°)"],
] as const;
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Shabat"];

/** Calendário completo, sempre aberto: mês, dia e cidade mudam na própria tela. */
export function CalendarView({ builtAt, initialDay, holidays: showHolidays = true }: { builtAt: number; initialDay?: string; holidays?: boolean }) {
  const now = useNow(builtAt);
  const city = useCity();
  const [picked, setPicked] = useState(initialDay);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: city.tz }).format(now);
  const { iso, year, month, day, noon, prev, next } = resolveDay(picked, today);
  const days = calendarService.month(city, year, month);
  const selected = days[day - 1]!;
  const z = calendarService.zmanim(city, noon);
  const months = [...new Set(days.map((d) => `${d.hebrewMonth} ${d.hebrewYear}`))].join(" e ");
  const facts = [...selected.holidays, selected.parasha && `Porção da Torá: ${selected.parasha}`, selected.omer && `${selected.omer}º dia do Ômer`].filter(Boolean);

  return (
    <div className="planner">
      <div>
        <div className="luach-head">
          <div><h2>{new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1))}</h2><p className="muted">{months}</p></div>
          <div className="inline">
            <button type="button" className="btn ghost small" onClick={() => setPicked(prev)}>Mês anterior</button>
            <button type="button" className="btn ghost small" onClick={() => setPicked(undefined)}>Hoje</button>
            <button type="button" className="btn ghost small" onClick={() => setPicked(next)}>Próximo mês</button>
          </div>
        </div>
        <div className="inline" style={{ marginBottom: 16 }}>
          <label className="inline">Cidade<select value={city.slug} onChange={(e) => setCity(e.target.value)}>{CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
          <label className="inline">Ir para a data<input type="date" value={iso} min="1900-01-01" max="2199-12-31" onChange={(e) => e.target.value && setPicked(e.target.value)} /></label>
        </div>
        <div className="luach">
          {WEEKDAYS.map((d) => <span className="wd" key={d}>{d}</span>)}
          {days.map((d) => {
            const key = `${iso.slice(0, 8)}${String(d.day).padStart(2, "0")}`;
            return (
              <button
                type="button" key={d.day} onClick={() => setPicked(key)} style={d.day === 1 ? { gridColumnStart: d.weekday + 1 } : undefined}
                data-holy={d.weekday === 6 || d.isYomTov} data-today={key === today} data-fest={d.holidays.length > 0} aria-pressed={d.day === day}
                aria-label={`${d.day}, ${d.full}${d.holidays.length ? `, ${d.holidays.join(", ")}` : ""}`}
              >
                <span className="top"><span>{d.day}</span><span lang="he">{d.hebrewDay}</span></span>
                {d.holidays.map((h) => <span className="fest extra" key={h}>{h}</span>)}
                {d.parasha && <span className="extra">{d.parasha}</span>}
                {d.candles && <span className="extra">Velas {time(d.candles, city.tz)}</span>}
                {d.havdalah && <span className="extra">Havdalá {time(d.havdalah, city.tz)}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className="planner-day" aria-live="polite">
        <p lang="he" dir="rtl" style={{ fontSize: "1.35rem", textAlign: "left" }}>{selected.full}</p>
        <h3>{formatDay(new Date(year, month - 1, day))}</h3>
        {facts.length > 0 && <p style={{ marginTop: 6 }}>{facts.join(". ")}</p>}
        <dl className="rows compact">
          {selected.candles && <div><dt>Acendimento das velas</dt><dd>{time(selected.candles, city.tz)}</dd></div>}
          {selected.havdalah && <div><dt>Havdalá</dt><dd>{time(selected.havdalah, city.tz)}</dd></div>}
          {ZMANIM.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{time(z[key], city.tz)}</dd></div>)}
        </dl>
        <p className="muted" style={{ fontSize: "0.9rem", marginTop: 10 }}>{city.name}. Horários aproximados (Hebcal): antecipe alguns minutos e siga o seu rabino.</p>
      </div>
      {showHolidays && (
        <div className="planner-full">
          <h2>Próximas datas</h2>
          <p className="muted">Festas começam ao pôr do sol da véspera. Toque para ver o dia.</p>
          <ul className="chips">
            {calendarService.upcomingHolidays(city, 18, now).map((h) => (
              <li key={h.name}><button type="button" onClick={() => setPicked(new Intl.DateTimeFormat("en-CA").format(h.date))}><strong>{h.name}</strong><span>{new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(h.date)}</span></button></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
