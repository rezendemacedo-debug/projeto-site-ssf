"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHead } from "@/components/ui/page-head";
import { BASE_PATH } from "@/content/site";
import type { Catalog } from "@/domain/lesson";
import { parseLessonParams } from "@/server/http/schemas";
import { LessonService } from "@/server/services/lesson-service";
import { LessonArchive } from "./lesson-archive";

let catalog: Promise<Catalog> | undefined;

/** Baixa o acervo uma vez e faz a busca no próprio navegador. */
const service = new LessonService({
  load: () => {
    catalog ??= fetch(`${BASE_PATH}/acervo.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Catalog>) : Promise.reject(new Error(String(r.status)))))
      .catch((e) => {
        catalog = undefined;
        throw e;
      });
    return catalog;
  },
});

export function ArchiveBrowser() {
  const search = useSearchParams().toString();
  const [data, setData] = useState<Parameters<typeof LessonArchive>[0]>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const raw = Object.fromEntries(new URLSearchParams(search));
    const query = parseLessonParams(raw);
    Promise.all([service.search(query), service.overview()])
      .then(([result, overview]) => active && setData({ raw, query, result, overview }))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [search]);

  if (data) return <LessonArchive {...data} />;
  return <PageHead title="Aulas" hebrew="שיעורים">{failed ? "Não foi possível carregar o acervo. Recarregue a página." : "Carregando o acervo"}</PageHead>;
}
