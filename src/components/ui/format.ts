export function time(date: Date | undefined, tz: string) {
  if (!date || Number.isNaN(date.getTime())) return "–";
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(date);
}

export function day(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}
