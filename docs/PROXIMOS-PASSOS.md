# Próximos passos

Escolha um item, abra uma issue dizendo que vai trabalhar nele e siga o [guia](../CONTRIBUTING.md).

## Dependem da direção ou de rabinos

- [ ] Revisão rabínica dos textos, dicionário, Cabalá e cursos
- [ ] Tradução do Tanach: licenciar edição ortodoxa ou revisar a provisória
- [ ] Autorização para as câmeras do Kotel
- [ ] Confirmação dos horários das aulas ao vivo e dos links de venda
- [ ] Orientação sobre vídeos de música, comentários modernos e uso de IA
- [ ] Licença do código (hoje não há arquivo LICENSE)

## Conteúdo

- [ ] Revisar títulos, temas e capas dos vídeos; 331 estão em "Outros temas"
- [ ] Explicação curta dos termos hebraicos na interface
- [ ] Mais cidades no calendário

## Engenharia

- [ ] Testar em aparelhos físicos e no Safari
- [ ] Testes de interface automatizados (Playwright) e de acessibilidade
- [ ] Publicar a versão com servidor: hospedagem (Vercel ou Docker), banco oficial (Turso/libSQL, `DATABASE_URL`) e provedor de e-mail (`RESEND_API_KEY`, `MAIL_FROM` com domínio da SSF verificado). Com isso o cadastro com código por e-mail entra no ar.
- [ ] Recuperação de senha por e-mail
- [ ] Paginação na administração
- [ ] Sincronização automática do acervo do YouTube
- [ ] Melhorar o classificador de aulas, com testes
- [ ] Avaliar o Dicta para vocalização (termos de uso e decisão rabínica)
- [ ] Avaliar publicação na App Store e no Google Play
