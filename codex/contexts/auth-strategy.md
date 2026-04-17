# Auth Strategy

## Objetivo

Preparar a base do `finance-ai` para receber autenticacao depois, sem bloquear o MVP atual e sem espalhar acoplamento prematuro.

## Recomendacao principal

Adotar `Auth.js` como solucao principal quando a autenticacao entrar no roadmap.

Motivos:

- encaixa naturalmente no `Next.js` com App Router
- oferece o helper `auth()` para acesso server-side a sessao
- permite comecar com sessao `JWT`, o que reduz complexidade inicial
- pode evoluir depois para adapter e sessoes em banco se o produto precisar

Referencias oficiais:

- `https://authjs.dev/`
- `https://authjs.dev/reference/nextjs`
- `https://authjs.dev/concepts/session-strategies`

## Leitura do estado atual

Hoje o projeto ainda nao possui:

- modelo de usuario
- escopo `userId` nos dominios financeiros
- protecao de rota
- middleware/proxy de autenticacao
- camada de sessao real

Isso significa que toda a base atual e efetivamente single-tenant no codigo, mesmo rodando em banco compartilhado.

## Menor caminho de evolucao

Quando a autenticacao for implementada de fato, o caminho recomendado e:

1. adicionar `Auth.js`
2. criar `src/auth.ts` como ponto central de configuracao
3. expor handlers em `src/app/api/auth/[...nextauth]/route.ts`
4. adicionar uma pagina propria de login
5. ligar protecao de rotas via middleware/proxy usando as regras de `src/lib/auth/route-access.ts`
6. incluir `userId` em `Account`, `Category`, `Transaction`, `Budget` e `Goal`
7. atualizar repositories para sempre filtrar por `userId`
8. ajustar seeds para criar dados por usuario, nao globais

## Estrategia de sessao recomendada

Fase inicial recomendada:

- usar `JWT` session strategy
- nao persistir sessoes em colecao propria ainda
- manter o payload de sessao pequeno
- persistir apenas identificadores e dados minimos do usuario

Justificativa:

- o projeto ja usa `Mongoose` para dados de negocio, mas o MVP nao precisa introduzir adapter de autenticacao e modelos extras agora
- `JWT` reduz custo operacional e atrito de setup
- a migracao para sessao em banco pode acontecer depois se surgirem requisitos como revogacao imediata, logout global ou multiplas sessoes controladas

## Preparacao adicionada agora

Arquivos preparados:

- `src/types/auth.ts`: tipos compartilhados de usuario autenticado e entidade com ownership
- `src/lib/auth/session.ts`: fronteira server-side unica para leitura de sessao futura
- `src/lib/auth/route-access.ts`: definicao simples das rotas que devem virar protegidas depois

Esses arquivos ainda nao ativam autenticacao. Eles apenas definem os pontos corretos de integracao futura.

## Regras para a futura implementacao

- nao ler sessao diretamente em repositories
- resolver autenticacao na borda server-side e propagar apenas `userId`
- evitar depender de dados amplos da sessao dentro de components
- tratar dashboard e features financeiras como privadas quando a auth entrar
- nao adicionar campos de auth aos models financeiros sem incluir filtro correspondente nos repositories

## Impacto esperado da futura migracao

As maiores mudancas futuras nao estarao na UI, e sim em:

- models Mongoose com `userId`
- repositories com filtros obrigatorios por ownership
- services que hoje assumem base global
- seed inicial, que precisara operar por usuario

Por isso, a autenticacao deve entrar junto com a primeira rodada de isolamento de dados por usuario, e nao apenas como uma tela de login cosmetica.
