# Sinagoga Sem Fronteiras

## 👉 [Visitar o site](https://rezendemacedo-debug.github.io/projeto-site-ssf/)

**https://rezendemacedo-debug.github.io/projeto-site-ssf/**

Plataforma de estudo judaico da Sinagoga Sem Fronteiras, em português: cursos e aulas do Rabino Ventura, Porção Semanal da Torá, calendário judaico com horários por cidade, Tanach em hebraico, alfabetização e Kotel ao vivo.

| Ver no site | |
| --- | --- |
| [Cursos](https://rezendemacedo-debug.github.io/projeto-site-ssf/cursos/) | [Aulas em vídeo](https://rezendemacedo-debug.github.io/projeto-site-ssf/aulas/) |
| [Porção Semanal da Torá](https://rezendemacedo-debug.github.io/projeto-site-ssf/parasha/) | [Calendário judaico](https://rezendemacedo-debug.github.io/projeto-site-ssf/calendario/) |
| [Biblioteca do Tanach](https://rezendemacedo-debug.github.io/projeto-site-ssf/biblioteca/) | [Aprender hebraico](https://rezendemacedo-debug.github.io/projeto-site-ssf/hebraico/) |
| [Judaísmo diário](https://rezendemacedo-debug.github.io/projeto-site-ssf/judaismo-diario/) | [Dicionário judaico](https://rezendemacedo-debug.github.io/projeto-site-ssf/dicionario/) |
| [Bnei Anussim](https://rezendemacedo-debug.github.io/projeto-site-ssf/bnei-anussim/) | [Kotel ao vivo](https://rezendemacedo-debug.github.io/projeto-site-ssf/kotel/) |

> **Situação:** versão em construção. O conteúdo ainda não foi revisado nem aprovado por um Beit Din.

## Celular e tablet

Funciona em Android, iPhone, iPad e tablets, e pode ser instalado na tela inicial: no Android, pelo botão ou menu do navegador; no iPhone e iPad, em Compartilhar > Adicionar à Tela de Início.

## Como ajudar

Shalom! Não é preciso saber programar.

1. Visite o site e anote o que encontrar.
2. Abra uma [nova sugestão ou correção](https://github.com/rezendemacedo-debug/projeto-site-ssf/issues/new) (é preciso ter conta no GitHub). Informe o endereço da página, o que está errado e, se for conteúdo, a fonte. Não inclua dados pessoais: as mensagens são públicas.

Precisamos especialmente de:

- **Rabinos e estudiosos:** revisar os textos e a lista em [docs/CONFORMIDADE-HALACHICA.md](docs/CONFORMIDADE-HALACHICA.md).
- **Tradutores de hebraico:** revisar o português do Tanach em [data/traducoes](data/traducoes), hoje provisório.
- **Revisores de vídeos:** indicar aulas no tema errado ou capas inadequadas.
- **Programadores:** descrevam a melhoria em uma sugestão, pelo link acima. Só a direção do projeto altera o código.

## Para programadores: começar

Requer Node 22 ou superior.

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Para criar o administrador, preencha `ADMIN_*` no `.env`, rode `node --env-file=.env --import tsx scripts/create-admin.ts` e apague os valores.

| Comando | Função |
| --- | --- |
| `npm test` / `npm run typecheck` / `npm run build` | Verificações |
| `npm run catalog:sync` | Refaz o acervo a partir do YouTube (requer `yt-dlp`) |
| `npm run library:sync` | Refaz o catálogo da seção Tanach do Sefaria |
| `npm run db:generate` / `db:migrate` | Migrações |

## Arquitetura

TypeScript, Next.js (App Router), React, Drizzle ORM com libSQL/SQLite, Zod e Hebcal.

```
src/domain        regras puras: aulas, classificação, parashá, PIX, céu
src/content       textos e configuração editorial
src/server
  db              esquema e conexão
  repositories    acesso a dados: banco, YouTube, Sefaria
  services        casos de uso em classes
  http            sessão, validação e server actions
  container.ts    composição das dependências
src/components    interface, por área
src/app           páginas e API (/api/aulas, /api/zmanim, /api/health)
```

Novos vídeos entram pelo RSS do canal a cada hora. Para mudar um tema, edite `src/domain/lesson-classifier.ts`; para ocultar vídeos, `src/content/editorial-policy.ts`.

## GitHub Pages

`npm run build:pages` gera em `out/` a versão estática, sem login, formulários nem API. Arquivos `*.static.tsx` valem só nela e `*.server.tsx` só na versão com servidor; o resto é comum. O workflow `pages.yml` publica a cada push na `main` e a cada 6 horas. Ative uma vez em Settings > Pages > Source: GitHub Actions.

## Publicação

A área de membros exige servidor Node. Use o `Dockerfile` com um volume em `/data`, ou Vercel com banco Turso (`DATABASE_URL` e `DATABASE_AUTH_TOKEN`). Defina `SITE_URL`. O servidor deve ficar atrás de um proxy que sobrescreva `X-Forwarded-For`, usado no limite de tentativas.

Antes de ir ao ar, leia [docs/CONFORMIDADE-HALACHICA.md](docs/CONFORMIDADE-HALACHICA.md).
