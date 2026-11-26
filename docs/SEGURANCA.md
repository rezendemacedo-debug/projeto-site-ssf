# Segurança

Auditoria de 26/11/2026 (código, dependências, GitHub e site publicado). Relatar falhas: [SECURITY.md](../SECURITY.md).

## Corrigido nesta auditoria

| Gravidade | Problema | Correção |
| --- | --- | --- |
| Alta | O cadastro em etapas apagava qualquer conta sem `emailVerifiedAt` (administrador e membros antigos) quando alguém se cadastrava com o mesmo e-mail. Só na versão com servidor, ainda não publicada. | Só um cadastro em etapas pendente e não confirmado pode ser substituído; teste de regressão em `tests/member-signup.test.ts`. `admin:create` marca o e-mail como confirmado. |
| Média | Limite de tentativas por IP contornável com `X-Forwarded-For` inventado. | `clientIp` usa o último item do cabeçalho (o do proxy) ou `x-real-ip`. |
| Média | Versão estática sem CSP (o GitHub Pages não aceita cabeçalhos próprios). | CSP numa tag `<meta>`, a mesma da versão com servidor (`src/content/security.ts`). |
| Baixa | Janela do Sefaria aberta com acesso a `window.opener`. | `opener` anulado após abrir. |
| Baixa | E-mail do código repetia o nome digitado, permitindo usar o site para mandar texto de terceiros. | O e-mail não repete nada do formulário. |
| Baixa | Ações do GitHub referenciadas por versão móvel. | Fixadas por SHA; o Dependabot atualiza. |

## Verificado e sem problemas

- `npm audit --omit=dev`: nenhuma vulnerabilidade. As 4 moderadas restantes são do `esbuild` dentro do `drizzle-kit`, usado só em desenvolvimento.
- Histórico do Git: nenhum segredo, `.env`, banco ou chave.
- Site publicado: só HTTPS (HTTP redireciona), HSTS ativo, nenhum arquivo interno acessível.
- Nenhum HTML vindo de fora é injetado na página (`dangerouslySetInnerHTML` não é usado); textos do Sefaria são tratados como texto.
- Senhas com scrypt; sessão e token do cadastro guardados só como hash; código do e-mail com HMAC, 15 minutos e 5 tentativas; cookies `httpOnly`, `secure` e `SameSite=Lax`.
- Server actions validadas com Zod; páginas e ações de membro e administrador exigem sessão e papel; Next.js confere a origem das server actions.
- Consultas ao banco parametrizadas (Drizzle).
- Workflows com permissões mínimas e sem `pull_request_target`.

## Recomendações (não dependem de código)

1. Ativar verificação em duas etapas (2FA) na conta do GitHub do dono e exigir dos colaboradores.
2. Ao publicar a versão com servidor, conferir que o proxy sobrescreve `X-Forwarded-For` e guardar `RESEND_API_KEY` e o token do banco só nas variáveis da hospedagem.
3. Manter a chave de publicação (`ssf_deploy`) só neste Mac; se o Mac for trocado ou perdido, revogá-la em Settings > Deploy keys.
4. Repetir `npm audit` e esta revisão a cada mudança grande (login, pagamentos, dados de membros).
