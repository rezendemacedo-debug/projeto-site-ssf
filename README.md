# Sinagoga Sem Fronteiras

Plataforma de estudo judaico: acervo de aulas do Rabino Ventura, parashá, luach e zmanim, biblioteca em hebraico, curso de alfabetização, Kotel ao vivo e área de membros.

## Começar

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

## Publicação

A área de membros exige servidor Node (GitHub Pages não serve). Use o `Dockerfile` com um volume em `/data`, ou Vercel com banco Turso (`DATABASE_URL` e `DATABASE_AUTH_TOKEN`). Defina `SITE_URL`. O servidor deve ficar atrás de um proxy que sobrescreva `X-Forwarded-For`, usado no limite de tentativas.

Antes de ir ao ar, leia [docs/CONFORMIDADE-HALACHICA.md](docs/CONFORMIDADE-HALACHICA.md).
