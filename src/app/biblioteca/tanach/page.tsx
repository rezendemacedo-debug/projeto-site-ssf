import type { Metadata } from "next";
import { TanakhCatalog } from "@/components/library/tanakh-catalog";
import { PageHead } from "@/components/ui/page-head";
import { works } from "@/content/tanakh-works";

export const metadata: Metadata = { title: "Targumim e comentaristas do Tanach" };

export default function TanakhPage() {
  return (
    <>
      <PageHead title="Tanach e comentaristas" hebrew="תנ״ך ומפרשיו">{`Os 39 livros e ${works.length} obras: Targumim, Rishonim, Acharonim e comentários modernos.`}</PageHead>
      <div className="wrap" style={{ paddingBottom: 96 }}><TanakhCatalog works={works} /></div>
    </>
  );
}
