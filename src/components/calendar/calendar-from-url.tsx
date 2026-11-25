"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CalendarView } from "./calendar-view";
import { setCity } from "./use-city";

/** Aceita links antigos com ?cidade= e ?dia=. */
export function CalendarFromUrl({ builtAt }: { builtAt: number }) {
  const params = useSearchParams();
  const city = params.get("cidade");
  useEffect(() => {
    if (city) setCity(city);
  }, [city]);
  return <CalendarView builtAt={builtAt} initialDay={params.get("dia") ?? undefined} />;
}
