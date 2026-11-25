import type { MetadataRoute } from "next";
import { DAILY } from "@/content/daily";
import { LIBRARY } from "@/content/library";
import { FOOTER, SITE } from "@/content/site";
import { CatalogRepository } from "@/server/repositories/catalog-repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { lessons } = await new CatalogRepository().load();
  const paths = ["", ...FOOTER.flatMap((g) => g.links.map(([href]) => href)).filter((p) => p !== "/membros"), ...DAILY.map((a) => `/judaismo-diario/${a.slug}`), ...LIBRARY.map((b) => `/biblioteca/${b.slug}/1`), ...lessons.map((l) => `/aulas/${l.id}`)];
  return paths.map((p) => ({ url: SITE.url + p }));
}
