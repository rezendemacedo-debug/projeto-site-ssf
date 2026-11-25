const NAMES: Record<string, string> = {
  "Rosh Hashana": "Rosh Hashaná", "Yom Kippur": "Yom Kipur", Sukkot: "Sucot", "Shmini Atzeret": "Shemini Atseret",
  "Simchat Torah": "Simchat Torá", Chanukah: "Chanucá", "Tu BiShvat": "Tu BiShvat", Purim: "Purim", Pesach: "Pessach",
  "Pesach Sheni": "Pessach Sheni", "Lag BaOmer": "Lag BaÔmer", Shavuot: "Shavuot", "Tish'a B'Av": "Tishá BeAv", "Tu B'Av": "Tu BeAv",
  "Tzom Gedaliah": "Jejum de Guedaliá", "Asara B'Tevet": "Jejum de 10 de Tevet", "Ta'anit Esther": "Jejum de Ester",
  "Tzom Tammuz": "Jejum de 17 de Tamuz",
};

const ROSH_CHODESH = "Rosh Chodesh ";

/** Nome em português, ou null para datas que o site não lista. */
export function holidayName(base: string) {
  if (base.startsWith(ROSH_CHODESH)) return base.replace("Sh'vat", "Shevat").replace("Iyyar", "Iyar").replace("Nisan", "Nissan");
  return NAMES[base.replace(/’/g, "'")] ?? null;
}
