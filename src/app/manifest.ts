import type { MetadataRoute } from "next";
import { BASE_PATH, SITE } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return { name: SITE.name, short_name: "SSF", lang: "pt-BR", start_url: `${BASE_PATH}/`, display: "standalone", background_color: "#05070f", theme_color: "#05070f", icons: [{ src: `${BASE_PATH}/icon.svg`, sizes: "any", type: "image/svg+xml" }] };
}
