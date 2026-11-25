import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { LessonGrid } from "@/components/lessons/lesson-card";
import { PageHead } from "@/components/ui/page-head";
import { categoryBySlug } from "@/domain/lesson";
import { lessonService } from "@/server/container";
import { parseLessonParams } from "@/server/http/schemas";

export const metadata: Metadata = { title: "Aulas", description: "Acervo de aulas de Torá do Rabino Ventura, organizado por tema." };

type Params = Record<string, string | undefined>;

export default async function Lessons({ searchParams }: { searchParams: Promise<Params> }) {
  const raw = await searchParams;
  const query = parseLessonParams(raw);
  const [result, overview] = await Promise.all([lessonService.search(query), lessonService.overview()]);
  const series = overview.series.find((s) => s.id === query.series);
  const category = query.category && categoryBySlug(query.category);
  const pageUrl = (page: number) => {
    const p = new URLSearchParams(Object.entries(raw).filter((e): e is [string, string] => typeof e[1] === "string"));
    p.set("pagina", String(page));
    return `/aulas?${p}`;
  };

  return (
    <>
      <PageHead title={series?.title ?? category?.name ?? "Aulas"} hebrew="שיעורים">
        {category?.description ?? "O acervo do canal do Rabino Ventura, organizado por tema para você estudar com continuidade."}
      </PageHead>
      <div className="wrap archive" style={{ paddingBottom: 96 }}>
        <nav className="topics" aria-label="Temas">
          <h2>Temas</h2>
          <Link href="/aulas" aria-current={!query.category && !query.series ? "page" : undefined}>Todas <span>{overview.total}</span></Link>
          {overview.categories.map((c) => <Link key={c.slug} href={`/aulas?tema=${c.slug}`} aria-current={query.category === c.slug ? "page" : undefined}>{c.name} <span>{c.count}</span></Link>)}
          <h2>Séries</h2>
          {overview.series.map((s) => <Link key={s.id} href={`/aulas?serie=${s.id}`} aria-current={query.series === s.id ? "page" : undefined}>{s.title} <span>{s.lessonIds.length}</span></Link>)}
        </nav>
        <div>
          <Form action="/aulas" className="filters" key={JSON.stringify(raw)}>
            {query.category && <input type="hidden" name="tema" value={query.category} />}
            {query.series && <input type="hidden" name="serie" value={query.series} />}
            <input type="search" name="q" defaultValue={query.search} placeholder="Buscar aula" aria-label="Buscar aula" />
            <select name="tipo" defaultValue={query.kind ?? ""} aria-label="Formato"><option value="">Aulas e lives</option><option value="aula">Só aulas</option><option value="live">Só lives</option></select>
            <select name="ordem" defaultValue={query.sort ?? "recentes"} aria-label="Ordem"><option value="recentes">Mais recentes</option><option value="antigas">Mais antigas</option><option value="populares">Mais vistas</option></select>
            <button className="btn">Filtrar</button>
          </Form>
          <p className="muted" style={{ marginBottom: 22 }}>{result.total} {result.total === 1 ? "aula" : "aulas"}</p>
          {result.total > 0 ? <LessonGrid lessons={result.items} /> : <p>Nenhuma aula encontrada. Tente outra palavra ou <Link className="link" href="/aulas">veja todas</Link>.</p>}
          {result.pages > 1 && (
            <nav className="pager" aria-label="Páginas">
              {result.page > 1 && <Link className="btn ghost" href={pageUrl(result.page - 1)}>Anterior</Link>}
              <span>{result.page} de {result.pages}</span>
              {result.page < result.pages && <Link className="btn ghost" href={pageUrl(result.page + 1)}>Próxima</Link>}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
