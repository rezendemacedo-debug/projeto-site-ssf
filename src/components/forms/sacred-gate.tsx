import type { ReactNode } from "react";
import { EDITORIAL_POLICY } from "@/content/editorial-policy";
import { DEFAULT_CITY } from "@/domain/cities";
import { calendarService } from "@/server/container";

/** Suspende doações e formulários durante Shabat e Yom Tov. */
export function SacredGate({ children }: { children: ReactNode }) {
  if (EDITORIAL_POLICY.pauseOnSacredTime && calendarService.isSacredTime(DEFAULT_CITY)) {
    return <p className="notice">Este serviço está suspenso durante Shabat e Yom Tov e volta após a havdalá.</p>;
  }
  return children;
}
