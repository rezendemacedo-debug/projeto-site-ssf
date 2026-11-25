import type { Metadata } from "next";
import { type CalendarParams, CalendarView } from "@/components/calendar/calendar-view";

export const metadata: Metadata = { title: "Calendário e zmanim", description: "Luach judaico com festas, velas, havdalá e zmanim por cidade." };

export default async function Calendar({ searchParams }: { searchParams: Promise<CalendarParams> }) {
  return <CalendarView params={await searchParams} />;
}
