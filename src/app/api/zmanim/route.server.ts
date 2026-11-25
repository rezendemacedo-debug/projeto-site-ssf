import type { NextRequest } from "next/server";
import { findCity } from "@/domain/cities";
import { calendarService } from "@/server/container";

export function GET(req: NextRequest) {
  const city = findCity(req.nextUrl.searchParams.get("cidade") ?? undefined);
  const { candles, havdalah, parashiot } = calendarService.shabbat(city);
  return Response.json({ city: city.name, date: calendarService.hebrewDateText(city), zmanim: calendarService.zmanim(city), shabbat: { candles, havdalah, parasha: parashiot.map((p) => p.name) } });
}
