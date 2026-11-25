import { type CategorySlug, normalize } from "./lesson";
import { PARASHIOT } from "./parasha";

type Rule = [CategorySlug, RegExp];

/** A primeira regra que casar vence; por isso temas específicos vêm antes dos gerais. */
const RULES: Rule[] = [
  ["hebraico", /\bhebraico|alfabetiza/],
  ["conversao", /conver(sao|ter|tid)|virar judeu|beit din/],
  ["bnei-anussim", /anussim|anusim|cristaos? novos?|marrano|sobrenome|inquisi|judaismo do brasil|judeus? (do|no) brasil|sefarad|tribos perdidas|descendente|prazer, eu sou o judeu/],
  ["musica", /musica|louvor|cantad|cancao|lecha dodi|\brock\b|hino|show\b/],
  ["judaismo-e-cristianismo", /jesus|crist(ao|aos|ianismo)|evangel|novo testamento|isaias 53|trindade|pastor\b|igreja|catolic|yeshua/],
  ["festas", /purim|pessach|chanuc|chanuk|hanuk|sucot|shavuot|rosh hashana|ano novo judaico|yom kipur|kippur|shofar|omer\b|simchat|tu b|tisha|seder\b|festas? judaica/],
  ["tefila", /tefila|\breza|oracao|oracoes|sidur|shacharit|arvit|mincha|selichot|havdala|kabalat/],
  ["shabat-e-halacha", /shabat|shabbat|kasher|kosher|kashrut|halach|luto|lapide|tefilin|mezuza|casamento|brit mila|mikve/],
  ["talmud-e-sabios", /talmud|pirkei|etica dos pais|guemara|mishna|rambam|maimonides|rashi|sabios|rabi akiva/],
  ["cabala", /cabala|kabala|zohar|misticismo|gematria|codigos?|reencarna|anjos?\b|alma\b|golem|astrolog|apocalip|fim dos tempos|profecia/],
  ["israel", /israel|hamas|gaza|palestin|netanyahu|bibi\b|\bira\b|guerra|sionis|antissem|nazis|hitler|holocausto|lula|bolsonaro|trump|terror|politic|apagao|siria|ucrania|hezbollah/],
  ["parasha", /parasha|parsha|porcao semanal/],
  ["tanach", /biblia|tanach|\btora\b|genesis|exodo|levitico|deuteronomio|salmo|proverbios|mandamentos|rei davi|salomao|moises|abraao|jaco\b|noe\b|eva\b|adao|gideao|daniel|ester\b|profeta|templo/],
  ["fundamentos", /judaismo|judaic|judeu|deus|hashem|mitsv|idolatria|messias|mashiach|\bfe\b/],
];

/** Assinaturas e hashtags repetidas nos títulos, que não indicam o tema. */
const NOISE = /(rabino|rav|more) ventura|@?lady ?law\w*|#\S+|[-|] *(judaismo|israel|judeus?)(?= *([-|]|$))/g;

const PARASHA_NAMES = PARASHIOT.flatMap((p) => p.aliases);

export function classify(title: string, series: readonly string[] = []): CategorySlug {
  const text = normalize([title, ...series].join(" ")).replace(NOISE, " ");
  if (/parasha|parsha/.test(text)) return "parasha";
  for (const [slug, pattern] of RULES) if (pattern.test(text)) return slug;
  const words = new Set(text.split(/[^a-z]+/));
  return PARASHA_NAMES.some((n) => words.has(n)) ? "parasha" : "geral";
}

/** Descarta títulos automáticos (datas, "está ao vivo!", nomes de arquivo). */
export function hasMeaningfulTitle(title: string) {
  const t = normalize(title).trim();
  if (/^\d{1,2} de \w+ de \d{4}$/.test(t)) return false;
  if (/(esta|estao|is|are) (ao vivo|live)!?$/.test(t) || /^(ao vivo|live|lives|teste|lancamento)$/.test(t)) return false;
  if (/^[0-9a-f]{8}[ -]/.test(t) || /^\[(private|deleted) video\]$/.test(t)) return false;
  return t.length > 4;
}
