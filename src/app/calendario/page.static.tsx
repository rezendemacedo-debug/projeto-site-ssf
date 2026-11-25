import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarBrowser } from "@/components/calendar/calendar-browser";
import { PageHead } from "@/components/ui/page-head";

export const metadata: Metadata = { title: "Calendário judaico", description: "Calendário judaico com festas, velas de Shabat, havdalá e horários por cidade." };

export default function Calendar() {
  return <Suspense fallback={<PageHead title="Calendário judaico" hebrew="לוח" />}><CalendarBrowser /></Suspense>;
}
