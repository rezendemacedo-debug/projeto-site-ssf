export interface Course {
  slug: string;
  name: string;
  hebrew: string;
  format: string;
  summary: string;
  details: string[];
  modules: string[];
  /** Página oficial de venda; sem ela, a inscrição é por WhatsApp. */
  buyUrl?: string;
  /** Tema do acervo aberto relacionado. */
  category: string;
}

/** Preços não são copiados: variam por promoção e valem os da página de venda. */
export const COURSES: Course[] = [
  {
    slug: "introducao-ao-judaismo", name: "Introdução ao judaísmo", hebrew: "יסודות", format: "Curso gravado, 18 aulas de 50 minutos",
    summary: "Os valores, os costumes e os princípios do judaísmo, para quem está começando.",
    details: ["Curso completo, ministrado pelo Rabino Ventura."],
    modules: ["Princípios da fé judaica", "Conceito e níveis de Tsedaká", "Conceito e definição de Mitsvot", "Shabat", "Torá", "Princípio da unicidade de D'us", "Conceito e requisitos do Guiur"],
    buyUrl: "https://ssf.hotmart.host/pagina-de-vendas-ac119dec-a6b6-40f8-93af-910c216ec375", category: "fundamentos",
  },
  {
    slug: "hebraico-alfabetizacao", name: "Hebraico: alfabetização", hebrew: "אלף־בית", format: "Curso gravado completo",
    summary: "Aprenda a ler as Escrituras no idioma original.",
    details: ["Método próprio do Rabino Ventura, que tem mais de 30 anos de ensino, para começar a ler já no primeiro módulo.", "O curso completo é liberado logo após a compra."],
    modules: [],
    buyUrl: "https://hotmart.com/pt-br/marketplace/produtos/hebraico-alfabetizacao/B95347311K", category: "hebraico",
  },
  {
    slug: "festas-judaicas", name: "Festas judaicas", hebrew: "מועדים", format: "Curso gravado, 24 aulas, 30 horas",
    summary: "Uma visão profunda de cada uma das principais festas do calendário.",
    details: ["Cultura, leis e tradições de cada festa, em aulas do Rabino Ventura."],
    modules: ["Shabat, 3 aulas", "Purim, 3 aulas", "Pessach, 3 aulas", "Lag BaÔmer, 2 aulas", "Shavuot, a entrega da Torá, 2 aulas", "Tishá BeAv, 2 aulas", "Rosh Hashaná, 3 aulas", "Yom Kipur, 2 aulas", "Sucot, 2 aulas", "Chanucá, 2 aulas"],
    buyUrl: "https://hotmart.com/pt-br/marketplace/produtos/festas-judaicas/V97347730N", category: "festas",
  },
  {
    slug: "sabios-do-judaismo", name: "Sábios do judaísmo", hebrew: "חכמים", format: "Curso gravado, 14 aulas",
    summary: "A vida e os ensinamentos dos grandes Sábios da Mishná e do Talmud.",
    details: ["Ministrado pelo Rabino Ventura."],
    modules: ["Os exílios do Sanhedrin", "Maimônides", "Mishnê Torá", "Livro do Saber", "Rabi Yehudá Hanassi", "Yochanan ben Zakai", "Shamai", "Hilel"],
    buyUrl: "https://hotmart.com/pt-br/marketplace/produtos/sabios-do-judaismo/B95035811F", category: "talmud-e-sabios",
  },
  {
    slug: "parasha-da-semana", name: "Parashá da semana", hebrew: "פרשה", format: "Aulas ao vivo, às quintas-feiras, 21h",
    summary: "A porção semanal da Torá, semana após semana.",
    details: ["Aulas ao vivo com o Rabino Ventura. Inscrição pelo WhatsApp da SSF."], modules: [], category: "parasha",
  },
  {
    slug: "valores-e-tradicoes", name: "Valores e tradições judaicas", hebrew: "מסורת", format: "Aulas ao vivo, aos domingos, 21h",
    summary: "Aulas profundas e filosóficas de imersão no judaísmo.",
    details: ["Aulas ao vivo. Inscrição pelo WhatsApp da SSF."], modules: [], category: "shabat-e-halacha",
  },
];
