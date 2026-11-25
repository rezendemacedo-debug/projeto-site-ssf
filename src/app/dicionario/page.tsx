import type { Metadata } from "next";
import { DictionaryList } from "@/components/hebrew/dictionary-list";
import { PageHead } from "@/components/ui/page-head";
import { DICTIONARY } from "@/content/dictionary";

export const metadata: Metadata = { title: "Dicionário judaico" };

export default function Dictionary() {
  return (
    <>
      <PageHead title="Dicionário judaico" hebrew="מילון">Na transliteração, ch soa como rr forte; h soa aspirado, como em hall.</PageHead>
      <div className="wrap" style={{ paddingBottom: 96 }}><DictionaryList terms={DICTIONARY} /></div>
    </>
  );
}
