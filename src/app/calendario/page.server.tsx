import type { Metadata } from "next";
import { type CalendarParams, CalendarView } from "@/components/calendar/calendar-view";

export const metadata: Metadata = { title: "Calendário judaico", description: "Calendário judaico com festas, velas de Shabat, havdalá e horários por cidade." };

export default async function Calendar({ searchParams }: { searchParams: Promise<CalendarParams> }) {
  return <CalendarView params={await searchParams} />;
}
