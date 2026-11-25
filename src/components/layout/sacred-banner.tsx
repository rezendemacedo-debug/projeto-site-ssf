import { DEFAULT_CITY } from "@/domain/cities";
import { calendarService } from "@/server/container";

export function SacredBanner() {
  if (!calendarService.isSacredTime(DEFAULT_CITY)) return null;
  return <p className="sacred">Shabat e Yom Tov: doações e formulários ficam suspensos até a havdalá em São Paulo.</p>;
}
