import type { MetadataRoute } from "next";
import { BASE_PATH, SITE } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return { name: SITE.name, short_name: "SSF", lang: "pt-BR", start_url: `${BASE_PATH}/`, display: "standalone", background_color: "#2a1a0f", theme_color: "#2a1a0f", icons: [{ src: `${BASE_PATH}/icon.png`, sizes: "512x512", type: "image/png" }] };
}
