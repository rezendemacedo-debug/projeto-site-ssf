"use client";

import { useEffect, useState } from "react";
import { SefariaClient, type SefariaText } from "@/server/repositories/sefaria-client";
import type { Translation } from "@/server/repositories/translation-repository";
import { ChapterText } from "./chapter-text";

const sefaria = new SefariaClient();

/** Busca o texto na API do Sefaria direto do navegador. */
export function ChapterLoader({ textRef, translation }: { textRef: string; translation: Translation | null }) {
  const [text, setText] = useState<SefariaText | null | undefined>();
  useEffect(() => {
    let active = true;
    setText(undefined);
    sefaria.hebrewText(textRef).then((t) => active && setText(t));
    return () => {
      active = false;
    };
  }, [textRef]);
  if (text === undefined) return <p className="muted" aria-busy="true">Carregando o texto</p>;
  return <ChapterText text={text} translation={translation} />;
}
