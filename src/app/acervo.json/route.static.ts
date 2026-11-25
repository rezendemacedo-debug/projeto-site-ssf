import { CatalogRepository } from "@/server/repositories/catalog-repository";

export const dynamic = "force-static";

export async function GET() {
  return Response.json(await new CatalogRepository().load());
}
