import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/membros", "/api/"] }, sitemap: `${SITE.url}/sitemap.xml` };
}
