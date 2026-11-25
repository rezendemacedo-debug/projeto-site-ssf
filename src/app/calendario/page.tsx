import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarFromUrl } from "@/components/calendar/calendar-from-url";
import { PageHead } from "@/components/ui/page-head";

export const metadata: Metadata = { title: "Calendário judaico", description: "Calendário judaico com festas, velas de Shabat, havdalá e horários por cidade." };

export default function Calendar() {
  return (
    <>
      <PageHead title="Calendário judaico" hebrew="לוח" />
      <div className="wrap" style={{ paddingBottom: 72 }}><Suspense><CalendarFromUrl builtAt={Date.now()} /></Suspense></div>
    </>
  );
}
