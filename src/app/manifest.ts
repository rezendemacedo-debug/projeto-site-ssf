import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return { name: SITE.name, short_name: "SSF", lang: "pt-BR", start_url: "/", display: "standalone", background_color: "#05070f", theme_color: "#05070f", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] };
}
