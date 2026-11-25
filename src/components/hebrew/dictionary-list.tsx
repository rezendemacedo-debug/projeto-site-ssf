"use client";

import { useState } from "react";
import type { Term } from "@/content/dictionary";
import { normalize } from "@/domain/lesson";

export function DictionaryList({ terms }: { terms: Term[] }) {
  const [query, setQuery] = useState("");
  const q = normalize(query.trim());
  const found = terms.filter((t) => normalize(`${t.term} ${t.meaning}`).includes(q) || t.hebrew.includes(query.trim()));
  return (
    <>
      <label className="sr" htmlFor="dict">Buscar no dicionário</label>
      <input id="dict" type="search" placeholder="Buscar termo, em português ou hebraico" value={query} onChange={(e) => setQuery(e.target.value)} />
      <dl className="terms">
        {found.map((t) => <div key={t.term}><dt>{t.term}<span lang="he" dir="rtl">{t.hebrew}</span></dt><dd>{t.meaning}</dd></div>)}
      </dl>
      {found.length === 0 && <p className="muted">Nenhum termo encontrado.</p>}
    </>
  );
}
