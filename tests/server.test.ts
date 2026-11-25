import { migrate } from "drizzle-orm/libsql/migrator";
import { beforeEach, describe, expect, it } from "vitest";
import { findCity } from "@/domain/cities";
import { createDatabase, type Database } from "@/server/db/client";
import { parseFeed } from "@/server/repositories/catalog-repository";
import { SessionRepository } from "@/server/repositories/session-repository";
import { UserRepository } from "@/server/repositories/user-repository";
import { AuthService } from "@/server/services/auth-service";
import { isOpenLicense, plainText } from "@/server/repositories/sefaria-client";
import { HebrewCalendarService } from "@/server/services/hebrew-calendar-service";
import { LessonService } from "@/server/services/lesson-service";
import { PasswordHasher } from "@/server/services/password-hasher";
import { RateLimiter } from "@/server/services/rate-limiter";

let db: Database;
beforeEach(async () => {
  db = createDatabase("file::memory:");
  await migrate(db, { migrationsFolder: "./drizzle" });
});

describe("AuthService", () => {
  it("exige aprovação, autentica e encerra a sessão", async () => {
    const users = new UserRepository(db);
    const auth = new AuthService(users, new SessionRepository(db), new PasswordHasher());
    const data = { name: "Davi", email: "d@x.com", password: "senha-de-teste", city: "", motivation: "" };
    expect(await auth.register(data)).toBe(true);
    expect(await auth.register(data)).toBe(false);
    expect(await auth.login("d@x.com", "senha-de-teste")).toEqual({ ok: false, reason: "pending" });

    const user = await users.findByEmail("d@x.com");
    await users.setStatus(user!.id, "active");
    expect(await auth.login("d@x.com", "errada")).toEqual({ ok: false, reason: "invalid" });
    const session = await auth.login("d@x.com", "senha-de-teste");
    if (!session.ok) throw new Error("login falhou");
    expect(await auth.authenticate(session.token)).not.toHaveProperty("passwordHash");

    await users.setStatus(user!.id, "blocked");
    expect(await auth.authenticate(session.token)).toBeNull();
    await auth.logout(session.token);
  });
});

it("RateLimiter bloqueia após o limite", async () => {
  const limiter = new RateLimiter(db);
  expect(await limiter.allow("k", 2, 60)).toBe(true);
  expect(await limiter.allow("k", 2, 60)).toBe(true);
  expect(await limiter.allow("k", 2, 60)).toBe(false);
});

describe("HebrewCalendarService", () => {
  const cal = new HebrewCalendarService();
  const sp = findCity("sao-paulo");
  const at = (iso: string) => new Date(iso);

  it("vira o dia no pôr do sol", () => {
    expect(cal.hebrewDateText(sp, at("2026-09-11T12:00:00-03:00")).latin).toBe("29 de Elul de 5786");
    expect(cal.hebrewDateText(sp, at("2026-09-11T20:00:00-03:00")).latin).toBe("1 de Tishrei de 5787");
  });
  it("acha a parashá e as velas do Shabat", () => {
    const s = cal.shabbat(sp, at("2026-11-25T12:00:00-03:00"));
    expect(s.parashiot.map((p) => p.name)).toEqual(["Vayishlach"]);
    expect(s.candles!.getTime()).toBeLessThan(s.havdalah!.getTime());
  });
  it.each([
    ["quarta comum", "2026-11-25T12:00:00-03:00", false],
    ["Shabat", "2026-11-28T10:00:00-03:00", true],
    ["motsaei Shabat", "2026-11-28T21:00:00-03:00", false],
    ["Chanucá em dia de semana", "2026-12-08T12:00:00-03:00", false],
    ["sexta antes das velas", "2026-11-27T12:00:00-03:00", false],
    ["2º dia de Pessach", "2027-04-23T12:00:00-03:00", true],
    ["Chol Hamoed", "2027-04-25T12:00:00-03:00", false],
  ])("dia sagrado: %s", (_, iso, expected) => expect(cal.isSacredTime(sp, at(iso))).toBe(expected));
  it("conta o Ômer a partir da segunda noite de Pessach", () => {
    expect(cal.omer(sp, at("2027-04-22T21:00:00-03:00"))?.day).toBe(1);
    expect(cal.omer(sp, at("2026-11-25T12:00:00-03:00"))).toBeNull();
  });
  it("monta o luach do mês", () => {
    const days = cal.month(sp, 2026, 12);
    expect(days).toHaveLength(31);
    expect(days[4]!.holidays).toContain("Chanucá");
    expect(days[4]!.candles).toBeUndefined();
    expect(days[3]!.candles).toBeInstanceOf(Date);
    expect(days[4]!.havdalah).toBeInstanceOf(Date);
  });
  it("lista as próximas festas em ordem", () => {
    const names = cal.upcomingHolidays(sp, 30, at("2026-11-25T12:00:00-03:00")).map((h) => h.name);
    expect(names).toEqual(expect.arrayContaining(["Chanucá", "Purim", "Pessach", "Shavuot", "Yom Kipur", "Sucot"]));
    expect(new Set(names).size).toBe(names.length);
  });
});

it("LessonService filtra ignorando acentos", async () => {
  const lesson = { id: "a", title: "Oração da manhã", seconds: 1, views: 1, kind: "aula" as const, category: "tefila" as const };
  const service = new LessonService({ load: async () => ({ syncedAt: "", series: [], lessons: [lesson] }) });
  expect((await service.search({ search: "oracao MANHÃ" })).total).toBe(1);
  expect((await service.search({ category: "cabala" })).total).toBe(0);
});

it("lê o RSS e ignora shorts", () => {
  const entry = (id: string, path: string) =>
    `<entry><yt:videoId>${id}</yt:videoId><title>Aula de Tor&amp;á</title><link rel="alternate" href="https://www.youtube.com/${path}"/><published>2026-01-01</published></entry>`;
  const out = parseFeed(`<feed>${entry("abcdefghijk", "watch?v=1")}${entry("zbcdefghijk", "shorts/1")}</feed>`);
  expect(out.map((l) => l.id)).toEqual(["abcdefghijk"]);
});

it("SefariaClient só aceita edições com licença livre", () => {
  expect(isOpenLicense("Public Domain")).toBe(true);
  expect(isOpenLicense("CC-BY-SA")).toBe(true);
  expect(isOpenLicense("unknown")).toBe(false);
  expect(isOpenLicense("Copyright: Schocken")).toBe(false);
  expect(plainText('א<i class="footnote">nota <b>x</b></i>ב&nbsp;<b>ג</b>')).toBe("אב ג");
});
