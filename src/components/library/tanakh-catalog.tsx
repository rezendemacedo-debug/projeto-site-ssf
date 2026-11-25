"use client";

import Link from "next/link";
import { useState } from "react";
import { LIBRARY } from "@/content/library";
import { isReadable } from "@/content/tanakh-works";
import { groupBy } from "@/domain/group-by";
import { normalize } from "@/domain/lesson";
import { groupInfo, type TanakhWork, workName, workUrl } from "@/domain/tanakh-work";

export function TanakhCatalog({ works }: { works: TanakhWork[] }) {
  const [query, setQuery] = useState("");
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const found = works.filter((w) => {
    const text = normalize(`${w.title} ${workName(w.title)} ${w.hebrew}`);
    return terms.every((t) => text.includes(t));
  });
  const groups = [...groupBy(found, (w) => w.path[0]!)];
  const books = groupBy(LIBRARY.filter((b) => ["Torá", "Neviim", "Ketuvim"].includes(b.section)), (b) => b.section);

  return (
    <>
      <label className="sr" htmlFor="obra">Buscar obra</label>
      <input id="obra" type="search" placeholder="Buscar obra ou comentarista (ex.: Rashi Bereshit)" value={query} onChange={(e) => setQuery(e.target.value)} />
      {terms.length === 0 && [...books].map(([name, list]) => (
        <section key={name} style={{ marginTop: 40 }}><h2>{name}</h2><ul className="works" style={{ marginTop: 16 }}>{list.map((b) => <li key={b.slug}><Link href={`/biblioteca/${b.slug}/1`}>{b.name}</Link><span lang="he" dir="rtl">{b.hebrew}</span></li>)}</ul></section>
      ))}
      {groups.map(([key, list]) => (
        <section key={key} style={{ marginTop: 56 }}>
          <div className="section-head" style={{ marginBottom: 12 }}><h2>{groupInfo(key).name}</h2><span lang="he" dir="rtl" style={{ fontSize: "1.4rem" }}>{groupInfo(key).hebrew}</span></div>
          {[...groupBy(list, (w) => w.path[1] ?? "Outras obras")].map(([author, own]) => (
            <details key={author} className="group" open={terms.length > 0 || undefined}>
              <summary>{author} ({own.length})</summary>
              <ul className="works">{own.map((w) => <li key={w.title}><WorkLink work={w} /><span lang="he" dir="rtl">{w.hebrew}</span></li>)}</ul>
            </details>
          ))}
        </section>
      ))}
      {found.length === 0 && <p className="muted" style={{ marginTop: 24 }}>Nenhuma obra encontrada.</p>}
      <p className="sources">Textos e catálogo do <a className="link" href="https://www.sefaria.org/texts/Tanakh" target="_blank" rel="noopener">Sefaria</a>. As obras marcadas com “no Sefaria” abrem lá e aguardam revisão rabínica. Este site não é afiliado ao Sefaria.</p>
    </>
  );
}

function WorkLink({ work }: { work: TanakhWork }) {
  if (isReadable(work)) return <Link href={workUrl(work.title)}>{workName(work.title)}</Link>;
  return <a href={`https://www.sefaria.org/${encodeURIComponent(work.title.replace(/ /g, "_"))}`} target="_blank" rel="noopener">{workName(work.title)} <span className="muted">(no Sefaria)</span></a>;
}
