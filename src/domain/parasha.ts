export interface ParashaInfo {
  /** Nome na transliteração do Hebcal, usado como chave. */
  key: string;
  name: string;
  book: string;
  aliases: string[];
}

const BOOKS: Record<string, [string, string, ...string[]][]> = {
  "Bereshit (Gênesis)": [
    ["Bereshit", "Bereshit", "bereshit", "bereishit"], ["Noach", "Noach", "noach"], ["Lech-Lecha", "Lech Lechá", "lecha"],
    ["Vayera", "Vayerá", "vayera"], ["Chayei Sara", "Chayei Sará", "chayei", "chaye"], ["Toldot", "Toldot", "toldot"],
    ["Vayetzei", "Vayetsê", "vayetse", "vayetze"], ["Vayishlach", "Vayishlach", "vayishlach"], ["Vayeshev", "Vayeshev", "vayeshev"],
    ["Miketz", "Mikets", "mikets", "miketz"], ["Vayigash", "Vayigash", "vayigash"], ["Vayechi", "Vayechi", "vayechi"],
  ],
  "Shemot (Êxodo)": [
    ["Shemot", "Shemot", "shemot"], ["Vaera", "Vaerá", "vaera"], ["Bo", "Bô"], ["Beshalach", "Beshalach", "beshalach"],
    ["Yitro", "Yitrô", "yitro", "itro"], ["Mishpatim", "Mishpatim", "mishpatim"], ["Terumah", "Terumá", "teruma"],
    ["Tetzaveh", "Tetsavê", "tetsave", "tetzave"], ["Ki Tisa", "Ki Tissá", "tissa"], ["Vayakhel", "Vayakhel", "vayakhel"],
    ["Pekudei", "Pekudei", "pekudei"],
  ],
  "Vayikrá (Levítico)": [
    ["Vayikra", "Vayikrá", "vayikra"], ["Tzav", "Tsav", "tsav", "tzav"], ["Shmini", "Shemini", "shemini", "shmini"],
    ["Tazria", "Tazria", "tazria"], ["Metzora", "Metsorá", "metsora", "metzora"], ["Achrei Mot", "Acharei Mot", "acharei"],
    ["Kedoshim", "Kedoshim", "kedoshim"], ["Emor", "Emor", "emor"], ["Behar", "Behar", "behar"], ["Bechukotai", "Bechukotai", "bechukotai"],
  ],
  "Bamidbar (Números)": [
    ["Bamidbar", "Bamidbar", "bamidbar"], ["Nasso", "Nassô", "nasso"], ["Beha'alotcha", "Behaalotechá", "behaalotecha", "behaalotcha"],
    ["Sh'lach", "Shelach Lechá", "shelach", "shlach"], ["Korach", "Korach", "korach"], ["Chukat", "Chukat", "chukat"],
    ["Balak", "Balak", "balak"], ["Pinchas", "Pinchas", "pinchas"], ["Matot", "Matot", "matot"], ["Masei", "Massei", "massei", "masei"],
  ],
  "Devarim (Deuteronômio)": [
    ["Devarim", "Devarim", "devarim"], ["Vaetchanan", "Vaetchanan", "vaetchanan"], ["Eikev", "Êkev", "ekev", "eikev"],
    ["Re'eh", "Reê", "reeh"], ["Shoftim", "Shoftim", "shoftim"], ["Ki Teitzei", "Ki Tetsê", "tetse", "teitzei"],
    ["Ki Tavo", "Ki Tavô", "tavo"], ["Nitzavim", "Nitsavim", "nitsavim", "nitzavim"], ["Vayeilech", "Vayelech", "vayelech"],
    ["Ha'azinu", "Haazinu", "haazinu"], ["Vezot Haberakhah", "Vezot Haberachá", "vezot"],
  ],
};

export const PARASHIOT: ParashaInfo[] = Object.entries(BOOKS).flatMap(([book, items]) =>
  items.map(([key, name, ...aliases]) => ({ key, name, book, aliases })),
);

export function findParashiot(keys: readonly string[]) {
  return keys.flatMap((k) => PARASHIOT.filter((p) => p.key === k));
}
