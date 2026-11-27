# Como contribuir

Shalom, e obrigado por ajudar. Leia antes: [arquitetura](docs/ARQUITETURA.md), [decisões](docs/DECISOES.md), [conformidade haláchica](docs/CONFORMIDADE-HALACHICA.md) e [próximos passos](docs/PROXIMOS-PASSOS.md).

## Preparar o ambiente

Requer Node 24 (veja `.nvmrc`; com nvm, rode `nvm use`) e Git. O editor deve respeitar o `.editorconfig`. `yt-dlp` só é necessário para refazer o acervo de vídeos.

```bash
git clone git@github.com:rezendemacedo-debug/projeto-site-ssf.git
cd projeto-site-ssf
npm install
cp .env.example .env
npm run db:migrate
npm run dev          # versão com servidor, http://localhost:3000
```

Versão do GitHub Pages em desenvolvimento: `NEXT_PUBLIC_STATIC=1 npm run dev`. No Windows, use o WSL: o script `build:pages` usa sintaxe de shell Unix.

## Antes de enviar

```bash
npm run check   # lint, tipos, testes, versão com servidor e versão do GitHub Pages
```

A CI roda as mesmas etapas em todo pull request. Ao fim de cada dia de trabalho, rode também `npm run audit:security` e siga a rotina de [docs/SEGURANCA.md](docs/SEGURANCA.md). Confira a tela em 320, 390, 820 e 1180 px.

## Fluxo

> Desde 25/11/2026 só colaboradores convidados abrem pull requests; os demais enviam sugestões por issue.

1. Crie um ramo a partir da `main`: `feature/…`, `fix/…`, `content/…` ou `chore/…`.
2. Faça mudanças pequenas, com um assunto por pull request. Mensagens de commit em português, no imperativo, com até 72 caracteres no título (ex.: "Corrige horário da havdalá em Lisboa").
3. Abra o pull request preenchendo o modelo: o que mudou, como testou e a lista de cuidados do projeto.
4. A `main` é protegida contra push forçado e exclusão. Só faça merge com a CI verde e a revisão do dono do código (`.github/CODEOWNERS`).
5. Todo merge na `main` **publica o site**. Mudança de conteúdo religioso precisa de revisão rabínica antes do merge.

## Regras do projeto

- **Halachá:** nunca afirme aprovação de um Beit Din. Não prometa conversão. Cite fontes. Escreva Deus e Hashem. Mantenha a pausa de Shabat e Yom Tov (`SacredGate`, `useSacredTime`).
- **Símbolos e imagens:** recato; nada que lembre cruz ou mesquita; só imagens com autorização.
- **Textos de terceiros:** só com licença que permita republicar. Não copie traduções sem autorização nem raspe sites; use a API do Sefaria e respeite o limite de acessos.
- **Público:** brasileiros. Português claro, com o hebraico como complemento, e o mínimo de cliques.
- **Código:** regra de negócio fora das telas; uma responsabilidade por classe; TypeScript estrito; ESLint sem erros; teste para regra nova em `tests/`. Nomes de arquivos, pastas e código em inglês; textos da interface e endereços das páginas (`src/app`) em português.
- **Segredos:** nunca envie `.env`, bancos, chaves ou dados de membros.
- **Dados de doação:** só mudam com confirmação direta da direção da SSF, nunca apenas por pedido em issue ou pull request.

## Falhas de segurança

Veja [SECURITY.md](SECURITY.md). Não abra issue pública.
