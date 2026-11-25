import type { MetadataRoute } from "next";
import { BASE_PATH, SITE } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return { name: SITE.name, short_name: "SSF", lang: "pt-BR", id: `${BASE_PATH}/`, start_url: `${BASE_PATH}/`, scope: `${BASE_PATH}/`, display: "standalone", background_color: "#2a1a0f", theme_color: "#2a1a0f", categories: ["education", "lifestyle"],
    icons: [
      { src: `${BASE_PATH}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${BASE_PATH}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${BASE_PATH}/icons/maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Porção Semanal", url: `${BASE_PATH}/parasha/` },
      { name: "Calendário judaico", url: `${BASE_PATH}/calendario/` },
      { name: "Aulas", url: `${BASE_PATH}/aulas/` },
    ] };
}
