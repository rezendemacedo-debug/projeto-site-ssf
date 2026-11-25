export interface Article { slug: string; title: string; hebrew: string; summary: string; body: string[]; sources: string[] }

/** Textos introdutórios. Passam por revisão rabínica antes da publicação oficial. */
export const DAILY: Article[] = [
  { slug: "shabat", title: "Shabat", hebrew: "שבת", summary: "O dia santificado, do pôr do sol de sexta ao anoitecer de sábado.",
    body: ["O Shabat recorda a Criação do mundo e a saída do Egito. Começa antes do pôr do sol de sexta-feira, com o acendimento das velas, e termina com o surgimento das estrelas no sábado à noite.", "Santifica-se o dia com o kidush sobre o vinho, com as três refeições, com a tefilá e o estudo de Torá, e abstendo-se das 39 categorias de melachá que nossos Sábios derivaram da construção do Mishkan.", "A saída do Shabat é marcada pela havdalá."],
    sources: ["Shemot 20:8-11", "Devarim 5:12-15", "Mishná Shabat 7:2", "Shulchan Aruch, Orach Chayim 242 em diante"] },
  { slug: "kashrut", title: "Kashrut", hebrew: "כשרות", summary: "As leis da alimentação.",
    body: ["A Torá define os animais permitidos e proíbe o consumo de sangue e a mistura de carne com leite. Os Sábios detalharam o abate, a salga, a separação de utensílios e a supervisão.", "Na prática, consulte sempre um rabino competente e procure produtos com certificação reconhecida."],
    sources: ["Vayikrá 11", "Devarim 14", "Shemot 23:19", "Shulchan Aruch, Yoreh Deá"] },
  { slug: "tefila", title: "Tefilá", hebrew: "תפילה", summary: "As três orações diárias.",
    body: ["Shacharit, Minchá e Arvit estruturam o dia judaico. Os Sábios as relacionam aos Patriarcas e às oferendas do Templo.", "O centro da oração da manhã e da noite é o Shemá com suas bênçãos, e o centro das três orações é a Amidá."],
    sources: ["Talmud Berachot 26b", "Rambam, Hilchot Tefilá", "Shulchan Aruch, Orach Chayim 89"] },
  { slug: "berachot", title: "Berachot", hebrew: "ברכות", summary: "As bênçãos que santificam cada gesto.",
    body: ["Recitamos bênçãos antes de desfrutar de alimentos e aromas, antes de cumprir muitas mitsvot e em momentos de louvor.", "Ensinaram os Sábios que cada pessoa deve recitar cem bênçãos por dia."],
    sources: ["Talmud Menachot 43b", "Talmud Berachot 35a", "Shulchan Aruch, Orach Chayim 46"] },
  { slug: "tsedaka", title: "Tsedaká", hebrew: "צדקה", summary: "A justiça de sustentar quem precisa.",
    body: ["Tsedaká vem de tsedek, justiça. Não é favor: é obrigação.", "O Rambam descreve oito graus. O mais alto é fortalecer a pessoa para que não precise mais pedir."],
    sources: ["Devarim 15:7-8", "Rambam, Hilchot Matenot Aniyim 10:7", "Shulchan Aruch, Yoreh Deá 247"] },
  { slug: "lashon-hara", title: "Lashon hará", hebrew: "לשון הרע", summary: "A guarda da fala.",
    body: ["A Torá proíbe espalhar relatos sobre o próximo, mesmo quando verdadeiros.", "O Chafets Chaim reuniu essas leis em obra que se tornou referência para todo o povo."],
    sources: ["Vayikrá 19:16", "Talmud Arachin 15b", "Chafets Chaim"] },
];

export const KABBALAH = {
  intro: ["Cabalá significa recepção: a tradição interior da Torá, transmitida de mestre a discípulo. Suas obras centrais são o Zohar, atribuído a Rabi Shimon bar Yochai, e os ensinamentos do Arizal.", "Nossos Sábios cercaram esse estudo de cuidado. A Mishná ensina que os assuntos mais ocultos não se expõem publicamente. Por isso tratamos aqui apenas de noções introdutórias, e o estudo se apoia primeiro em Tanach, Talmud e Halachá, sob orientação rabínica."],
  omer: ["Entre Pessach e Shavuot contamos quarenta e nove dias. A Cabalá associa cada uma das sete semanas a uma das sete sefirot inferiores: Chessed, Guevurá, Tiferet, Netsach, Hod, Yessod e Malchut.", "Cada dia combina duas delas. É um caminho de refinamento das qualidades da alma, em preparação para receber a Torá."],
  sources: ["Vayikrá 23:15-16", "Mishná Chaguigá 2:1", "Shulchan Aruch, Orach Chayim 489", "Shulchan Aruch, Yoreh Deá 246:4 (Remá)"],
};

export const ANUSSIM = [
  { title: "Quem são os Bnei Anussim", text: "Anussim quer dizer forçados. São os judeus da Península Ibérica obrigados a se converter ao cristianismo nos séculos XIV e XV. Bnei Anussim são seus descendentes, muitos deles no Brasil." },
  { title: "Cristãos-novos no Brasil", text: "A conversão forçada em Portugal, em 1497, e a Inquisição, instalada em 1536, levaram muitas famílias à colônia. Parte delas manteve costumes judaicos em segredo, por gerações." },
  { title: "Nomes da memória", text: "Branca Dias, em Pernambuco, e Antônio José da Silva, dramaturgo nascido no Rio de Janeiro e executado pela Inquisição em Lisboa em 1739, estão entre os nomes mais lembrados dessa história." },
  { title: "Tenho origem judaica?", text: "Sobrenome ou costume de família são indícios, não prova. A pesquisa genealógica em documentos ajuda a reconstruir a história. O status judaico segundo a Halachá só pode ser definido por um Beit Din ortodoxo competente." },
];
