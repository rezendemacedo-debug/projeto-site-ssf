import { CandleLightingEvent, type Event, flags, gematriya, GeoLocation, HavdalahEvent, HDate, HebrewCalendar, Location, OmerEvent, ParshaEvent, Zmanim } from "@hebcal/core";
import type { City } from "@/domain/cities";
import { holidayName } from "@/domain/holidays";
import { findParashiot } from "@/domain/parasha";

const DAY = 86_400_000;

export class HebrewCalendarService {
  /** Data civil (00:00 local do servidor) correspondente a "agora" na cidade. */
  private civilDate(city: City, now: Date) {
    const iso = new Intl.DateTimeFormat("en-CA", { timeZone: city.tz }).format(now);
    const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
    return new Date(y, m - 1, d);
  }

  private zmanimFor(city: City, date: Date) {
    return new Zmanim(new GeoLocation(city.name, city.lat, city.lon, 0, city.tz), date, false);
  }

  private location(city: City) {
    return new Location(city.lat, city.lon, city.country === "IL", city.tz, city.name, city.country);
  }

  /** Dia haláchico: começa no pôr do sol. */
  hebrewDate(city: City, now = new Date()) {
    const civil = this.civilDate(city, now);
    const hd = new HDate(civil);
    return now >= this.zmanimFor(city, civil).sunset() ? hd.next() : hd;
  }

  hebrewDateText(city: City, now = new Date()) {
    const hd = this.hebrewDate(city, now);
    return { hebrew: hd.renderGematriya(true), latin: `${hd.getDate()} de ${monthName(hd)} de ${hd.getFullYear()}` };
  }

  zmanim(city: City, now = new Date()) {
    const z = this.zmanimFor(city, this.civilDate(city, now));
    return {
      alot: z.alotHaShachar(),
      netz: z.sunrise(),
      shma: z.sofZmanShma(),
      tefila: z.sofZmanTfilla(),
      chatzot: z.chatzot(),
      minchaGedola: z.minchaGedola(),
      minchaKetana: z.minchaKetana(),
      plag: z.plagHaMincha(),
      shkia: z.sunset(),
      tzeit: z.tzeit(8.5),
    };
  }

  /** Velas, havdalá e parashá do próximo Shabat (ou do atual, até a havdalá). */
  shabbat(city: City, now = new Date()) {
    const today = this.civilDate(city, now);
    const shabbat = new Date(today.getFullYear(), today.getMonth(), today.getDate() + ((6 - today.getDay() + 7) % 7));
    const tzeit = this.zmanimFor(city, shabbat).tzeit(8.5);
    if (now > tzeit) shabbat.setDate(shabbat.getDate() + 7);

    const friday = new Date(shabbat);
    friday.setDate(friday.getDate() - 1);
    const events = HebrewCalendar.calendar({ start: friday, end: shabbat, location: this.location(city), candlelighting: true, sedrot: true, il: city.country === "IL" });
    const candles = events.find((e) => e instanceof CandleLightingEvent) as CandleLightingEvent | undefined;
    const havdalah = events.filter((e) => e instanceof HavdalahEvent).at(-1) as HavdalahEvent | undefined;
    const parsha = events.find((e) => e instanceof ParshaEvent) as ParshaEvent | undefined;

    return {
      date: shabbat,
      candles: candles?.eventTime,
      // Quando o Shabat emenda com Yom Tov não há havdalá no sábado.
      havdalah: havdalah?.eventTime,
      parashiot: parsha ? findParashiot(parsha.parsha) : [],
      parashaHebrew: parsha?.render("he-x-NoNikud") ?? "",
    };
  }

  /** true durante Shabat ou Yom Tov: o último evento foi acendimento, não havdalá. */
  isSacredTime(city: City, now = new Date()) {
    const today = this.civilDate(city, now);
    const events = HebrewCalendar.calendar({
      start: new Date(today.getTime() - 4 * DAY),
      end: new Date(today.getTime() + DAY),
      location: this.location(city),
      candlelighting: true,
      il: city.country === "IL",
    })
      // Velas de Chanucá e horários de jejum não marcam o início de um dia sagrado.
      .filter((e): e is CandleLightingEvent | HavdalahEvent => isCandles(e) || e instanceof HavdalahEvent)
      .filter((e) => e.eventTime <= now)
      .sort((a, b) => a.eventTime.getTime() - b.eventTime.getTime());
    return events.at(-1)?.getDesc() === "Candle lighting";
  }

  upcomingHolidays(city: City, limit: number, now = new Date()) {
    const start = this.hebrewDate(city, now).greg();
    const end = new Date(start.getTime() + 400 * DAY);
    const seen = new Set<string>();
    const result: { name: string; hebrew: string; date: Date; kind: "festa" | "jejum" | "rosh-chodesh" }[] = [];
    for (const e of HebrewCalendar.calendar({ start, end, il: city.country === "IL", noModern: true, noSpecialShabbat: true, noMinorFast: false })) {
      const mask = e.getFlags();
      if (mask & (flags.SHABBAT_MEVARCHIM | flags.YOM_KIPPUR_KATAN)) continue;
      const name = holidayName(e.basename());
      if (!name) continue;
      const date = e.getDate().greg();
      // Um item por festa; Rosh Chodesh de dois dias conta só o primeiro.
      if (seen.has(name)) continue;
      seen.add(name);
      const kind = mask & flags.ROSH_CHODESH ? "rosh-chodesh" : mask & (flags.MINOR_FAST | flags.MAJOR_FAST) ? "jejum" : "festa";
      result.push({ name, hebrew: e.render("he-x-NoNikud"), date, kind });
      if (result.length === limit) break;
    }
    return result;
  }

  /** Luach: todos os dias de um mês civil (month de 1 a 12). */
  month(city: City, year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const il = city.country === "IL";
    const events = HebrewCalendar.calendar({ start, end, location: this.location(city), candlelighting: true, sedrot: true, omer: true, il, noModern: true });
    return Array.from({ length: end.getDate() }, (_, i) => {
      const date = new Date(year, month - 1, i + 1);
      const hd = new HDate(date);
      const own = events.filter((e) => e.getDate().isSameDate(hd));
      const parsha = own.find((e) => e instanceof ParshaEvent) as ParshaEvent | undefined;
      const omer = own.find((e) => e instanceof OmerEvent) as OmerEvent | undefined;
      return {
        day: i + 1,
        weekday: date.getDay(),
        hebrewDay: gematriya(hd.getDate()),
        hebrewMonth: monthName(hd),
        hebrewYear: hd.getFullYear(),
        full: hd.renderGematriya(true),
        holidays: [...new Set(own.flatMap((e) => holidayName(e.basename()) ?? []))],
        isYomTov: own.some((e) => e.getFlags() & flags.CHAG),
        parasha: parsha ? findParashiot(parsha.parsha).map((p) => p.name).join(" e ") : "",
        omer: omer?.omer ?? null,
        candles: own.find(isCandles)?.eventTime,
        havdalah: (own.find((e) => e instanceof HavdalahEvent) as HavdalahEvent | undefined)?.eventTime,
      };
    });
  }

  /** Contagem do Ômer da noite atual, ou null fora do período. */
  omer(city: City, now = new Date()) {
    const hd = this.hebrewDate(city, now);
    const first = new HDate(16, "Nisan", hd.getFullYear());
    const day = hd.abs() - first.abs() + 1;
    if (day < 1 || day > 49) return null;
    return { day, weeks: Math.floor(day / 7), days: day % 7, sefira: new OmerEvent(hd, day).sefira("translit") };
  }
}

/** Acendimento de Shabat ou Yom Tov; exclui velas de Chanucá, que são outra classe. */
function isCandles(e: Event): e is CandleLightingEvent {
  return e instanceof CandleLightingEvent && (e.getFlags() & flags.CHANUKAH_CANDLES) === 0;
}

/** Cálculo puro, sem estado: a mesma instância serve ao servidor e ao navegador. */
export const calendarService = new HebrewCalendarService();

const MONTHS: Record<string, string> = {
  "Sh'vat": "Shevat", "Adar I": "Adar I", "Adar II": "Adar II", Iyyar: "Iyar", Cheshvan: "Cheshvan", Tishrei: "Tishrei",
  Kislev: "Kislev", Tevet: "Tevet", Nisan: "Nissan", Sivan: "Sivan", Tamuz: "Tamuz", Av: "Av", Elul: "Elul", Adar: "Adar",
};

function monthName(hd: HDate) {
  return MONTHS[hd.getMonthName()] ?? hd.getMonthName();
}
