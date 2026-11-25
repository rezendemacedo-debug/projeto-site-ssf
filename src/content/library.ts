export interface Book {
  slug: string;
  ref: string;
  name: string;
  hebrew: string;
  section: string;
  chapters: number;
  unit: string;
}

const book = (section: string, slug: string, ref: string, name: string, hebrew: string, chapters: number, unit = "Capítulo"): Book =>
  ({ section, slug, ref, name, hebrew, chapters, unit });

/** Seleção curada; para ampliar a biblioteca basta acrescentar linhas. */
export const LIBRARY: Book[] = [
  book("Torá", "bereshit", "Genesis", "Bereshit", "בראשית", 50),
  book("Torá", "shemot", "Exodus", "Shemot", "שמות", 40),
  book("Torá", "vayikra", "Leviticus", "Vayikrá", "ויקרא", 27),
  book("Torá", "bamidbar", "Numbers", "Bamidbar", "במדבר", 36),
  book("Torá", "devarim", "Deuteronomy", "Devarim", "דברים", 34),
  book("Neviim", "yehoshua", "Joshua", "Yehoshua", "יהושע", 24),
  book("Neviim", "shoftim", "Judges", "Shoftim", "שופטים", 21),
  book("Neviim", "shmuel-1", "I Samuel", "Shmuel I", "שמואל א", 31),
  book("Neviim", "shmuel-2", "II Samuel", "Shmuel II", "שמואל ב", 24),
  book("Neviim", "melachim-1", "I Kings", "Melachim I", "מלכים א", 22),
  book("Neviim", "melachim-2", "II Kings", "Melachim II", "מלכים ב", 25),
  book("Neviim", "yeshayahu", "Isaiah", "Yeshayahu", "ישעיהו", 66),
  book("Neviim", "yirmeyahu", "Jeremiah", "Yirmeyahu", "ירמיהו", 52),
  book("Neviim", "yechezkel", "Ezekiel", "Yechezkel", "יחזקאל", 48),
  book("Neviim", "hoshea", "Hosea", "Hoshea", "הושע", 14),
  book("Neviim", "yoel", "Joel", "Yoel", "יואל", 4),
  book("Neviim", "amos", "Amos", "Amos", "עמוס", 9),
  book("Neviim", "ovadia", "Obadiah", "Ovadiá", "עובדיה", 1),
  book("Neviim", "yona", "Jonah", "Yoná", "יונה", 4),
  book("Neviim", "micha", "Micah", "Michá", "מיכה", 7),
  book("Neviim", "nachum", "Nahum", "Nachum", "נחום", 3),
  book("Neviim", "chavakuk", "Habakkuk", "Chavakuk", "חבקוק", 3),
  book("Neviim", "tsefania", "Zephaniah", "Tsefaniá", "צפניה", 3),
  book("Neviim", "chagai", "Haggai", "Chagai", "חגי", 2),
  book("Neviim", "zecharia", "Zechariah", "Zechariá", "זכריה", 14),
  book("Neviim", "malachi", "Malachi", "Malachi", "מלאכי", 3),
  book("Ketuvim", "tehilim", "Psalms", "Tehilim", "תהילים", 150),
  book("Ketuvim", "mishlei", "Proverbs", "Mishlei", "משלי", 31),
  book("Ketuvim", "iyov", "Job", "Iyov", "איוב", 42),
  book("Ketuvim", "shir-hashirim", "Song of Songs", "Shir Hashirim", "שיר השירים", 8),
  book("Ketuvim", "ruth", "Ruth", "Ruth", "רות", 4),
  book("Ketuvim", "eicha", "Lamentations", "Eichá", "איכה", 5),
  book("Ketuvim", "kohelet", "Ecclesiastes", "Kohelet", "קהלת", 12),
  book("Ketuvim", "ester", "Esther", "Ester", "אסתר", 10),
  book("Ketuvim", "daniel", "Daniel", "Daniel", "דניאל", 12),
  book("Ketuvim", "ezra", "Ezra", "Ezra", "עזרא", 10),
  book("Ketuvim", "nechemia", "Nehemiah", "Nechemiá", "נחמיה", 13),
  book("Ketuvim", "divrei-hayamim-1", "I Chronicles", "Divrei Hayamim I", "דברי הימים א", 29),
  book("Ketuvim", "divrei-hayamim-2", "II Chronicles", "Divrei Hayamim II", "דברי הימים ב", 36),
];

export function findBook(slug: string) {
  return LIBRARY.find((b) => b.slug === slug);
}
