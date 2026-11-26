"use client";

import { useEffect, useState } from "react";
import { SefariaClient, type SefariaText } from "@/server/repositories/sefaria-client";
import type { Translation } from "@/server/repositories/translation-repository";
import { ChapterText } from "./chapter-text";

const sefaria = new SefariaClient();

/** Busca o texto na API do Sefaria direto do navegador. */
export function ChapterLoader({ textRef, translation }: { textRef: string; translation: Translation | null }) {
  // Guarda a referência junto do texto: ao trocar de capítulo, o anterior deixa de valer sem reset manual.
  const [loaded, setLoaded] = useState<{ ref: string; text: SefariaText | null }>();
  useEffect(() => {
    let active = true;
    sefaria.hebrewText(textRef).then((text) => active && setLoaded({ ref: textRef, text }));
    return () => {
      active = false;
    };
  }, [textRef]);
  const text = loaded?.ref === textRef ? loaded.text : undefined;
  if (text === undefined) return <p className="muted" aria-busy="true">Carregando o texto</p>;
  return <ChapterText text={text} translation={translation} />;
}
