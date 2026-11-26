"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHead } from "@/components/ui/page-head";
import { isReadable, works } from "@/content/tanakh-works";
import { workName } from "@/domain/tanakh-work";
import type { OutlineSection } from "@/domain/work-outline";
import { SefariaClient, type SefariaSection } from "@/server/repositories/sefaria-client";

const sefaria = new SefariaClient();

interface Position { section: number; chapter: number | null; label: string; ref: string }

/** Todas as posições de leitura da obra, em ordem. */
function positions(outline: OutlineSection[]): Position[] {
  return outline.flatMap((s, section): Position[] =>
    s.chapters === null
      ? [{ section, chapter: null, label: s.hebrew, ref: s.title }]
      : s.chapters.map((chapter) => ({ section, chapter, label: String(chapter), ref: `${s.title} ${chapter}` })),
  );
}

export function WorkReader() {
  const params = useSearchParams();
  const router = useRouter();
  const title = params.get("t") ?? "";
  const work = works.find((w) => w.title === title && isReadable(w));
  const [loaded, setLoaded] = useState<{ title: string; outline: OutlineSection[] | null }>();
  const outline = loaded?.title === title ? loaded.outline : undefined;

  useEffect(() => {
    if (!work) return;
    let active = true;
    sefaria.outline(title).then((o) => active && setLoaded({ title, outline: o }));
    return () => {
      active = false;
    };
  }, [title, work]);

  if (!work) return <PageHead title="Obra não encontrada"><Link className="link" href="/biblioteca">Ver todas as obras</Link></PageHead>;

  const all = outline ? positions(outline) : [];
  const section = Number(params.get("s") ?? -1);
  const chapter = params.get("c");
  const wanted = (p: Position) => (section < 0 || p.section === section) && (chapter === null ? true : p.chapter === Number(chapter));
  // Sem o capítulo pedido, abre no começo da parte; sem a parte, no começo da obra.
  const index = Math.max(0, all.some(wanted) ? all.findIndex(wanted) : all.findIndex((p) => p.section === section));
  const current = all[index];
  const missing = chapter !== null && all.length > 0 && !all.some(wanted);
  const url = (p: Position) => `/biblioteca/obra?${new URLSearchParams({ t: title, s: String(p.section), ...(p.chapter !== null && { c: String(p.chapter) }) })}`;

  return (
    <>
      <PageHead title={workName(title)} hebrew={work.hebrew} />
      <div className="wrap narrow" style={{ paddingBottom: 96 }}>
        {outline === undefined && <p className="muted" aria-busy="true">Carregando o sumário</p>}
        {outline === null && <p className="notice">Não foi possível carregar esta obra agora. Tente novamente em alguns minutos.</p>}
        {current && outline && (
          <>
            <div className="inline" style={{ marginBottom: 28 }}>
              {outline.length > 1 && (
                <label className="inline">Parte
                  <select dir="rtl" lang="he" style={{ maxWidth: 300 }} value={current.section} onChange={(e) => router.push(url(all.find((p) => p.section === Number(e.target.value))!))}>
                    {outline.map((s, i) => <option key={s.title} value={i}>{s.hebrew}</option>)}
                  </select>
                </label>
              )}
              {current.chapter !== null && (
                <label className="inline">Capítulo
                  <select value={current.chapter} onChange={(e) => router.push(url(all.find((p) => p.section === current.section && p.chapter === Number(e.target.value))!))}>
                    {outline[current.section]!.chapters!.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
              )}
            </div>
            {missing && <p className="notice" style={{ marginBottom: 20 }}>Esta obra não tem texto para o capítulo {chapter}. Abrimos a partir do primeiro disponível.</p>}
            <SectionText key={current.ref} textRef={current.ref} />
            <nav className="pager" aria-label="Capítulos">
              {index > 0 && <Link className="btn ghost" href={url(all[index - 1]!)}>Anterior</Link>}
              <span>{index + 1} de {all.length}</span>
              {index < all.length - 1 && <Link className="btn ghost" href={url(all[index + 1]!)}>Próximo</Link>}
            </nav>
          </>
        )}
        <p style={{ marginTop: 40 }}><Link className="link" href="/biblioteca">Todas as obras</Link></p>
      </div>
    </>
  );
}

function SectionText({ textRef }: { textRef: string }) {
  const [text, setText] = useState<SefariaSection | null | undefined>();
  useEffect(() => {
    let active = true;
    sefaria.section(textRef).then((t) => active && setText(t));
    return () => {
      active = false;
    };
  }, [textRef]);

  const source = `https://www.sefaria.org/${encodeURIComponent(textRef.replace(/ /g, "_"))}`;
  if (text === undefined) return <p className="muted" aria-busy="true">Carregando o texto</p>;
  if (text === null) return <p className="notice">Este trecho não tem edição hebraica de uso livre, ou não pôde ser carregado. <a className="link" href={source} target="_blank" rel="noopener">Abrir no Sefaria</a></p>;
  return (
    <>
      <ol className="page-text commentary" lang="he">
        {text.blocks.map((parts, i) => parts.length > 0 && <li key={i}><span className="n">{i + 1}</span><div>{parts.map((p, j) => <p key={j}>{p}</p>)}</div></li>)}
      </ol>
      <p className="sources">Edição: {text.edition} ({text.license}). Texto fornecido pelo <a className="link" href={source} target="_blank" rel="noopener">Sefaria</a>.</p>
    </>
  );
}
