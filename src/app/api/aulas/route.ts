import type { NextRequest } from "next/server";
import { lessonService } from "@/server/container";
import { parseLessonParams } from "@/server/http/schemas";

export async function GET(req: NextRequest) {
  return Response.json(await lessonService.search(parseLessonParams(Object.fromEntries(req.nextUrl.searchParams))));
}
