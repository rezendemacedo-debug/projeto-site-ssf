# Arquitetura

TypeScript, Next.js (App Router), React, Drizzle ORM com libSQL/SQLite, Zod, Hebcal e CSS próprio.

## Camadas

| Pasta | Papel | Pode depender de |
| --- | --- | --- |
| `src/domain` | Regras puras: aulas, classificação, parashá, cidades, PIX, sumários | quase nada (lê `content/library`) |
| `src/content` | Textos, cursos, menu, política editorial, catálogo | `domain` |
| `src/server/db` | Esquema e conexão | – |
| `src/server/repositories` | Banco, YouTube (RSS), Sefaria, traduções | `db`, `domain`, `content` |
| `src/server/services` | Casos de uso em classes | `repositories`, `domain` |
| `src/server/http` | Sessão, validação e server actions | `services` |
| `src/server/container.ts` | Monta as dependências (só servidor) | tudo em `server` |
| `src/components` | Interface por área | `domain`, `content`, serviços puros |
| `src/app` | Páginas e API | tudo |

`HebrewCalendarService`, `LessonService` e `SefariaClient` não dependem do banco: rodam também no navegador.

## Duas versões do mesmo código

`next.config.ts` escolhe as extensões de página:

| Arquivo | Servidor | GitHub Pages |
| --- | --- | --- |
| `page.tsx` | sim | sim |
| `page.server.tsx`, `route.server.ts` | sim | não |
| `page.static.tsx`, `route.static.ts` | não | sim |

A versão estática (`NEXT_PUBLIC_STATIC=1`) não tem login, formulários nem API. Nela, a busca de aulas baixa `acervo.json` e os textos vêm do Sefaria direto do navegador. `BASE_PATH` deve prefixar todo endereço escrito à mão; `Link` e imagens importadas já fazem isso.

## Como cada parte funciona

- **Aulas:** `data/catalog.json` (gerado por `npm run catalog:sync`) mais o RSS do canal. O tema vem de `lesson-classifier.ts`: a primeira regra que casar vence.
- **Calendário:** `HebrewCalendarService` com Hebcal. O dia judaico vira no pôr do sol da cidade. `useNow` atualiza a cada minuto; `useCity` compartilha a cidade escolhida.
- **Porção da semana:** `weeklyReading` (Hebcal + `@hebcal/leyning`) dá a leitura do Shabat da semana na regra da cidade (Israel ou diáspora) e o endereço exato do Sefaria (`domain/sefaria-link.ts`). Dois toques num dia do calendário abrem `PortionWindow`, que pergunta se a pessoa quer a tradução do Google e abre o Sefaria numa janela nova do próprio navegador (o site não escolhe o navegador do aparelho). Conferido contra a API de calendário do Sefaria (105 de 106 Shabatot iguais; a diferença é Shemini Atseret em Israel, em que o Sefaria mostra a leitura da diáspora).
- **Shabat e Yom Tov:** `isSacredTime` verifica se o último evento foi acendimento (e não havdalá). Doação e compra usam São Paulo; o Kotel usa Jerusalém.
- **Biblioteca:** `data/tanakh.json` (gerado por `npm run library:sync`). `SefariaClient` só aceita edições hebraicas com licença livre.
- **Tradução:** `data/translations/<livro>.json`. Só aparece se o número de versículos for igual ao do hebraico.
- **PIX:** `PixPayload` gera o BR Code com CRC; a chave está em `src/content/site.ts`.
- **Membros (servidor):** senha com scrypt, token de sessão guardado só como hash, cadastro aprovado pela administração, limite de tentativas no banco.
- **Cadastro de membro:** quatro etapas em `/seja-membro` (modelo do Chabad.org, sem newsletter): 1) título, nome, sobrenome, e-mail e senha; 2) código de 6 dígitos por e-mail, válido por 15 minutos, com no máximo 5 tentativas e reenvio após 1 minuto; 3) perfil opcional; 4) botão do WhatsApp com a mensagem e os dados (`domain/membership.ts`). `MemberSignupService` guarda o hash do token da etapa (cookie `ssf_cadastro`, 2 horas) e um HMAC do código com o próprio token como chave. E-mail já confirmado recebe só um aviso, e a tela não revela se a conta existe. O envio usa a interface `Mailer`: `ResendMailer` com `RESEND_API_KEY` e `MAIL_FROM`; sem eles, o e-mail aparece no terminal em desenvolvimento e o cadastro avisa a falha em produção. Na versão estática, `/seja-membro` tem o mesmo formulário, sem senha nem código, enviado direto pelo WhatsApp.
- **Instalação e offline:** `manifest.ts` e `public/sw.js`, que usa a rede primeiro. Ao mudar a estratégia, troque o nome do cache.
- **Aparência:** cores e fontes em `src/styles/tokens.css`. `Noto Serif Hebrew` é usada nos textos por suportar os te'amim.

## Qualidade

`npm run check` roda ESLint (`eslint.config.mjs`, regras do Next e do React Compiler), `tsc`, Vitest e as duas compilações; a CI (`ci.yml`) faz o mesmo em cada push e pull request. Valores dependentes da hora vêm de `BUILT_AT` (`src/content/build-info.ts`) e são atualizados no navegador por `useNow`.

## Publicação

`.github/workflows/ci.yml` testa e compila. `pages.yml` publica a cada push na `main` e a cada 6 horas. Para a versão com servidor, há `Dockerfile` (volume em `/data`) ou Vercel com Turso; veja o README.

## Cuidados conhecidos

- O Sefaria responde 429 a muitas consultas seguidas.
- `Map.groupBy` falha em aparelhos antigos; no navegador use `domain/group-by.ts`.
- Datas do Hebcal são civis: formate sem `timeZone`; horários, sempre com o `tz` da cidade.
- Os arquivos CSS são globais; confira as outras páginas ao mudar uma classe comum.
