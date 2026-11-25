export interface Letter { glyph: string; name: string; sound: string; value: number; final?: string }

const FINALS: Record<string, string> = { כ: "ך", מ: "ם", נ: "ן", פ: "ף", צ: "ץ" };

export const LETTERS: Letter[] = (
  [
    ["א", "Alef", "muda", 1],
    ["ב", "Bet", "b com ponto (בּ), v sem ponto", 2],
    ["ג", "Guimel", "g de gato", 3],
    ["ד", "Dalet", "d", 4],
    ["ה", "He", "h aspirado, como em hall", 5],
    ["ו", "Vav", "v, o ou u", 6],
    ["ז", "Zayin", "z", 7],
    ["ח", "Chet", "rr forte, na garganta", 8],
    ["ט", "Tet", "t", 9],
    ["י", "Yud", "y, i", 10],
    ["כ", "Kaf", "k com ponto (כּ), rr sem ponto", 20],
    ["ל", "Lamed", "l", 30],
    ["מ", "Mem", "m", 40],
    ["נ", "Nun", "n", 50],
    ["ס", "Samech", "s", 60],
    ["ע", "Ayin", "muda (gutural em algumas tradições)", 70],
    ["פ", "Pe", "p com ponto (פּ), f sem ponto", 80],
    ["צ", "Tsadi", "ts", 90],
    ["ק", "Kuf", "k", 100],
    ["ר", "Resh", "r", 200],
    ["ש", "Shin", "sh (שׁ) ou s (שׂ)", 300],
    ["ת", "Tav", "t (em parte da tradição ashkenazi, s sem ponto)", 400],
  ] as const
).map(([glyph, name, sound, value]) => ({ glyph, name, sound, value, final: FINALS[glyph] }));

/** Vogais mostradas sobre a letra Bet. */
export const VOWELS = [
  { glyph: "בָּ", name: "Kamats", sound: "a" },
  { glyph: "בַּ", name: "Patach", sound: "a" },
  { glyph: "בֵּ", name: "Tserê", sound: "e fechado" },
  { glyph: "בֶּ", name: "Segol", sound: "e aberto" },
  { glyph: "בִּ", name: "Chirik", sound: "i" },
  { glyph: "בֹּ", name: "Cholam", sound: "o" },
  { glyph: "בֻּ", name: "Kubuts", sound: "u" },
  { glyph: "בּוּ", name: "Shuruk", sound: "u" },
  { glyph: "בְּ", name: "Shevá", sound: "breve ou mudo" },
];

export const WORDS = [
  { hebrew: "שָׁלוֹם", latin: "shalom", meaning: "paz" },
  { hebrew: "תּוֹרָה", latin: "torá", meaning: "Torá" },
  { hebrew: "שַׁבָּת", latin: "shabat", meaning: "Shabat" },
  { hebrew: "בַּיִת", latin: "bayit", meaning: "casa" },
  { hebrew: "סֵפֶר", latin: "sefer", meaning: "livro" },
  { hebrew: "אוֹר", latin: "or", meaning: "luz" },
  { hebrew: "מַיִם", latin: "mayim", meaning: "água" },
  { hebrew: "לֶחֶם", latin: "lechem", meaning: "pão" },
  { hebrew: "תּוֹדָה", latin: "todá", meaning: "obrigado" },
  { hebrew: "אֱמֶת", latin: "emet", meaning: "verdade" },
  { hebrew: "חֶסֶד", latin: "chessed", meaning: "bondade" },
  { hebrew: "מִצְוָה", latin: "mitsvá", meaning: "mandamento" },
];
