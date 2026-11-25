export interface SkyTimes { alot: number; netz: number; plag: number; shkia: number; tzeit: number }
export type SkyPhase = "night" | "dawn" | "day" | "sunset" | "twilight";

export function skyPhase(t: SkyTimes, now: number): SkyPhase {
  if (now < t.alot || now >= t.tzeit) return "night";
  if (now < t.netz) return "dawn";
  if (now < t.plag) return "day";
  return now < t.shkia ? "sunset" : "twilight";
}
