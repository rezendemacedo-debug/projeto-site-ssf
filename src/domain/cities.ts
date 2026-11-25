export interface City {
  slug: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  tz: string;
}

export const CITIES: City[] = [
  { slug: "sao-paulo", name: "São Paulo", country: "BR", lat: -23.5505, lon: -46.6333, tz: "America/Sao_Paulo" },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", country: "BR", lat: -22.9068, lon: -43.1729, tz: "America/Sao_Paulo" },
  { slug: "belo-horizonte", name: "Belo Horizonte", country: "BR", lat: -19.9167, lon: -43.9345, tz: "America/Sao_Paulo" },
  { slug: "brasilia", name: "Brasília", country: "BR", lat: -15.7939, lon: -47.8828, tz: "America/Sao_Paulo" },
  { slug: "curitiba", name: "Curitiba", country: "BR", lat: -25.4284, lon: -49.2733, tz: "America/Sao_Paulo" },
  { slug: "porto-alegre", name: "Porto Alegre", country: "BR", lat: -30.0346, lon: -51.2177, tz: "America/Sao_Paulo" },
  { slug: "salvador", name: "Salvador", country: "BR", lat: -12.9777, lon: -38.5016, tz: "America/Bahia" },
  { slug: "recife", name: "Recife", country: "BR", lat: -8.0476, lon: -34.877, tz: "America/Recife" },
  { slug: "fortaleza", name: "Fortaleza", country: "BR", lat: -3.7319, lon: -38.5267, tz: "America/Fortaleza" },
  { slug: "belem", name: "Belém", country: "BR", lat: -1.4558, lon: -48.4902, tz: "America/Belem" },
  { slug: "manaus", name: "Manaus", country: "BR", lat: -3.119, lon: -60.0217, tz: "America/Manaus" },
  { slug: "lisboa", name: "Lisboa", country: "PT", lat: 38.7223, lon: -9.1393, tz: "Europe/Lisbon" },
  { slug: "miami", name: "Miami", country: "US", lat: 25.7617, lon: -80.1918, tz: "America/New_York" },
  { slug: "jerusalem", name: "Jerusalém", country: "IL", lat: 31.7683, lon: 35.2137, tz: "Asia/Jerusalem" },
];

export const DEFAULT_CITY = CITIES[0]!;

export function findCity(slug?: string) {
  return CITIES.find((c) => c.slug === slug) ?? DEFAULT_CITY;
}
