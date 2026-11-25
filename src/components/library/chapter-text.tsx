import type { Translation } from "@/server/repositories/translation-repository";
import type { SefariaText } from "@/server/repositories/sefaria-client";

/** Mostra a tradução só se ela cobrir exatamente os mesmos versículos do hebraico. */
export function ChapterText({ text, translation: candidate }: { text: SefariaText | null; translation: Translation | null }) {
  if (!text) return <p className="notice">Não foi possível carregar este texto agora. Tente novamente em alguns minutos.</p>;
  const translation = candidate?.verses.length === text.verses.length ? candidate : null;
  return (
          <>
            {!translation && <p className="muted">A tradução em português deste capítulo ainda está em preparação.</p>}
            <ol className="page-text" lang="he">{text.verses.map((v, i) => (
              <li key={i}><span className="n">{i + 1}</span>{translation ? <div className="verse-pair"><span>{v}</span><span className="pt" lang="pt-BR">{translation.verses[i]}</span></div> : <span>{v}</span>}</li>
            ))}</ol>
            {translation && <p className="sources">Tradução: {translation.translator}. {translation.license}. Aprovação: {translation.approvedBy}.</p>}
            <p className="sources">Edição: {text.edition} ({text.license}). Texto fornecido pelo <a className="link" href={`${text.url}`} target="_blank" rel="noopener">Sefaria</a>, com comentários e traduções na página original.</p>
          </>
  );
}
