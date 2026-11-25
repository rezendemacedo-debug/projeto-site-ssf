/**
 * Gera data/tanakh.json: catálogo da seção Tanakh do Sefaria.
 * A licença de cada texto é conferida na leitura (SefariaClient).
 * Uso: npm run library:sync
 */
import { writeFileSync } from "node:fs";
import type { TanakhWork } from "../../src/domain/tanakh-work";

const BASE_BOOKS = new Set(["Torah", "Prophets", "Writings"]);

interface Node { category?: string; title?: string; heTitle?: string; contents?: Node[] }

function leaves(node: Node, path: string[]): TanakhWork[] {
  return (node.contents ?? []).flatMap((c) =>
    c.contents ? leaves(c, [...path, c.category!]) : !c.title ? [] : [{ title: c.title, hebrew: c.heTitle ?? "", path }],
  );
}

const res = await fetch("https://www.sefaria.org/api/index", { signal: AbortSignal.timeout(120_000) });
if (!res.ok) throw new Error(`Sefaria respondeu ${res.status}`);
const tanakh = ((await res.json()) as Node[]).find((c) => c.category === "Tanakh")!;
const works = leaves(tanakh, []).filter((w) => !BASE_BOOKS.has(w.path[0]!));
writeFileSync("data/tanakh.json", JSON.stringify(works, null, 1) + "\n");
console.log(works.length, "obras");
