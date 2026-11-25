import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarBrowser } from "@/components/calendar/calendar-browser";
import { PageHead } from "@/components/ui/page-head";

export const metadata: Metadata = { title: "Calendário e zmanim", description: "Luach judaico com festas, velas, havdalá e zmanim por cidade." };

export default function Calendar() {
  return <Suspense fallback={<PageHead title="Luach" hebrew="לוח" />}><CalendarBrowser /></Suspense>;
}
