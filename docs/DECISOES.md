# Decisões do projeto

Registro do que foi decidido até 25/11/2026 e por quê. Ao mudar uma decisão, atualize este arquivo no mesmo pull request.

| Tema | Decisão | Motivo |
| --- | --- | --- |
| Objetivo | Trazer membros e alunos de Torá | Foco da sinagoga |
| Base de conteúdo | minhasinagoga.com | Site oficial da SSF |
| Autoridade | Tudo deve poder ser aprovado por um Beit Din ortodoxo de Israel | Pedido da direção |
| Aparência | Sinagoga ortodoxa de Jerusalém: pedra, madeira, azul do parochet, dourado | A primeira versão, escura, parecia site de tecnologia |
| Símbolos | Sem cúpulas nem estrela de quatro pontas; Tábuas quadradas (Bava Batra 14a) | Evitar associação com outras religiões |
| Navegação | Menos cliques: menu sempre visível, calendário aberto, ações nos cartões | Não deixar o visitante perdido |
| Língua | Português do Brasil, hebraico como complemento | Público brasileiro |
| Abertura | "Quero ser membro", "Estudar Torá ao vivo" (WhatsApp) e Porção Semanal em destaque | Foco da sinagoga |
| Topo | Botão Doação/Tzedaká com aviso em itálico sobre Shabat e Yom Tov | Pedido da direção |
| Biblioteca | Só a seção Tanach do Sefaria, em hebraico, com edições de licença livre | Pedido da direção e direitos autorais |
| Comentários modernos | Só link externo | Aguardam orientação rabínica |
| Tradução | Duas colunas sem linha; poucos capítulos provisórios, marcados como pendentes | Não há tradução ortodoxa licenciada |
| Cursos | Link oficial de venda, sem copiar preços | Preços variam por promoção |
| Vídeos de música | Ocultos | Questão de kol ishá, a decidir |
| Cabalá | Só noções introdutórias | Cuidado com o tema |
| Título da abertura | "Sinagoga Central", subtítulo em itálico "Tradição Ortodoxa" | Pedido do usuário em 25/11/2026 |
| Porção no Sefaria | Janela nova do navegador no trecho exato; tradução do Google só se a pessoa pedir, com aviso de que não tem revisão rabínica | Pedido do usuário; tradução automática não é revisada |
| Padrões de engenharia | ESLint (regras do Next), EditorConfig, Node 24 em `.nvmrc`, `npm run check`, modelos de PR e issue, CODEOWNERS, Dependabot mensal | Entrada de dois desenvolvedores sênior |
| Nomes | Código, arquivos e pastas internas em inglês; endereços das páginas em português | Padrão técnico sem quebrar links divulgados |
| Cadastro de membro | Em etapas como no Chabad.org, sem newsletter; código por e-mail de 15 minutos; ao final, WhatsApp com os dados e a pergunta sobre NEFESH/NESHAMÁ; perguntas pessoais opcionais | Pedido do usuário em 26/11/2026; menos desistência e menos dados obrigatórios (LGPD) |
| Nome divino em português | "Deus" em todo o site (textos, traduções, títulos de vídeos e guias), não "D'us" | Pedido do Rabino Ventura em 27/11/2026 |
| Hospedagem | GitHub Pages para o site público | Simples e gratuito |
| Aplicativo | Site instalável (PWA) | Um só código para Android, iOS e tablets |

## Etapas

1. Análise do site oficial, de referências e do canal do YouTube; plataforma inicial (`6734e14`).
2. Versão estática e GitHub Pages (`1e8d45a`).
3. Aparência de Jerusalém, cursos, Tanach e leitura em duas colunas (`f2c3564`).
4. Cidade na parashá (`0d708d1`) e publicação em duas etapas (`ff7757c`).
5. Porção Semanal em destaque e termos em português (`caa857e`).
6. Calendário aberto e menos cliques (`67eb40a`).
7. README para colaboradores (`11bc44d`) e botão de estudo ao vivo (`d6b416c`).
8. Doação no topo (`c9e7a1c`, `d168532`).
9. Instalação em celulares e tablets, com modo offline (`3613a3e`).
10. Porção da semana no Sefaria por dois toques no calendário e novo título da abertura.
11. Padrões de engenharia para os colaboradores; guias publicados no repositório.
12. Cadastro de membro em etapas, com código por e-mail (versão com servidor) e envio pelo WhatsApp.
