/** Interpreta ?dia=AAAA-MM-DD, voltando para hoje se for inválido. */
export function resolveDay(value: string | undefined, today: string) {
  const iso = isValid(value) ? value : today;
  const [year, month, day] = iso.split("-").map(Number) as [number, number, number];
  const first = (offset: number) => new Date(Date.UTC(year, month - 1 + offset, 1)).toISOString().slice(0, 10);
  // Meio-dia UTC cai no mesmo dia civil em todas as cidades oferecidas.
  return { iso, year, month, day, noon: new Date(Date.UTC(year, month - 1, day, 12)), prev: first(-1), next: first(1) };
}

function isValid(value: string | undefined): value is string {
  if (!value || !/^(19|20|21)\d{2}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}
