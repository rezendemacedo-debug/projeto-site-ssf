import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkReader } from "@/components/library/work-reader";
import { PageHead } from "@/components/ui/page-head";

export const metadata: Metadata = { title: "Leitura" };

export default function WorkPage() {
  return <Suspense fallback={<PageHead title="Biblioteca" />}><WorkReader /></Suspense>;
}
