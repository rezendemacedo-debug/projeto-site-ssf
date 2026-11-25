# Conformidade haláchica

**Situação: aguardando revisão. Nenhum Beit Din aprovou este site.** Não publique selo, frase ou logotipo que sugira aprovação antes de recebê-la por escrito.

## Já implementado

- Doações, cadastro e contato suspensos em Shabat e Yom Tov (hora de São Paulo); câmeras do Kotel suspensas em Shabat e Yom Tov de Jerusalém.
- Aviso de guenizá e de não uso em Shabat no rodapé.
- Nenhuma promessa de conversão; status judaico remetido a Beit Din ortodoxo competente.
- Música fora do ar (kol ishá) e fotos selecionadas por tsniut.
- Textos sagrados só no original, de edições com licença livre; nenhuma tradução sem aprovação.
- Cabalá restrita a noções introdutórias.
- Conteúdo com fontes citadas e orientação para consultar rabino.

## A submeter ao Beit Din

| Assunto | Onde está |
| --- | --- |
| Categorias e vídeos ocultos | `src/content/editorial-policy.ts` |
| Acervo: os títulos e temas vêm do YouTube e não passaram por revisão individual (códigos da Torá, profecias, política, debates com o cristianismo) | `data/catalog.json` |
| Textos de prática, Cabalá e Bnei Anussim | `src/content/daily.ts` |
| Dicionário e pronúncia | `src/content/dictionary.ts` |
| Método dos zmanim: Gra, tsêt a 8,5°, velas 18 min antes (40 min em Jerusalém), sem elevação | `src/server/services/hebrew-calendar-service.ts` |
| Missão e pilares: as críticas a lideranças judaicas do site anterior foram retiradas | `src/app/missao/page.tsx` |
| Tradução portuguesa do Tanach | `data/traducoes/` |
| Biografias | `src/app/sobre`, `src/app/rabino-ventura` |

## Tradução portuguesa do Tanach

Verificado na API do Sefaria em 25/11/2026: não há tradução portuguesa completa nem com licença livre. Há traduções parciais enviadas por usuários, com licença "unknown", e entre as de Bereshit constam uma da Sociedade Bíblica Britânica e uma "BJC", de origem não judaico-ortodoxa ou a verificar. Nenhuma foi usada. O caminho é licenciar uma edição ortodoxa e colocá-la em `data/traducoes/`.

## IA judaica israelense

O Dicta (dicta.org.il, Israel) desenvolve modelos de hebraico, como o Nakdan (vocalização) e o DictaLM. É candidato para vocalizar textos e apoiar o curso de hebraico. Não foi integrado: faltam confirmar os termos de uso da API e a decisão rabínica sobre IA. Nenhuma IA deve responder perguntas de Halachá no site nem traduzir o Tanach sem revisão.
