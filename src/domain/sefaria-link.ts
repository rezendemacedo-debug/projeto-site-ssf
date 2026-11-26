/** Trecho da Torá: livro em inglês (como no Sefaria) e capítulo:versículo de início e fim. */
export interface TorahRange {
  book: string;
  begin: string;
  end: string;
}

/** "Genesis 32:4" até "36:43" vira "Genesis.32.4-36.43", o endereço usado pelo Sefaria. */
export function sefariaRef({ book, begin, end }: TorahRange) {
  const [bc, bv] = begin.split(":");
  const [ec, ev] = end.split(":");
  const tail = bc === ec ? ev : `${ec}.${ev}`;
  return `${book.replace(/ /g, "_")}.${bc}.${bv}-${tail}`;
}

/** Leitura no Sefaria em hebraico e inglês, lado a lado. */
export function sefariaUrl(ref: string) {
  return `https://www.sefaria.org/${ref}?lang=bi`;
}

/** Mesma página passada pelo Google Tradutor: o inglês aparece em português; o hebraico fica intacto. */
export function translatedSefariaUrl(ref: string) {
  return `https://www-sefaria-org.translate.goog/${ref}?lang=bi&_x_tr_sl=en&_x_tr_tl=pt&_x_tr_hl=pt-BR`;
}
