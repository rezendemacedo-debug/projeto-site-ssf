import type { Metadata } from "next";
import { Suspense } from "react";
import { ArchiveBrowser } from "@/components/lessons/archive-browser";
import { PageHead } from "@/components/ui/page-head";

export const metadata: Metadata = { title: "Aulas", description: "Acervo de aulas de Torá do Rabino Ventura, organizado por tema." };

export default function Lessons() {
  return <Suspense fallback={<PageHead title="Aulas" hebrew="שיעורים" />}><ArchiveBrowser /></Suspense>;
}
