import type { Metadata } from "next";
import { TanakhCatalog } from "@/components/library/tanakh-catalog";
import { PageHead } from "@/components/ui/page-head";
import { works } from "@/content/tanakh-works";

export const metadata: Metadata = { title: "Biblioteca: Tanach" };

export default function Library() {
  return (
    <>
      <PageHead title="Biblioteca do Tanach" hebrew="תנ״ך">{`Os 39 livros e ${works.length} Targumim e comentaristas, com português ao lado nos capítulos já traduzidos.`}</PageHead>
      <div className="wrap" style={{ paddingBottom: 72 }}><TanakhCatalog works={works} /></div>
    </>
  );
}
