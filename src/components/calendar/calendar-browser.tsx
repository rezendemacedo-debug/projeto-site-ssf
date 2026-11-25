"use client";

import { useSearchParams } from "next/navigation";
import { CalendarView } from "./calendar-view";

export function CalendarBrowser() {
  return <CalendarView params={Object.fromEntries(useSearchParams())} />;
}
