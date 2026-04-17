# Preparar Auth Futura

## Contexto

O projeto precisava ficar pronto para receber autenticacao depois, sem introduzir login completo nem complicar o MVP atual.

## Decisão

A estrategia escolhida foi preparar apenas as fronteiras minimas para a futura integracao com `Auth.js`: tipos compartilhados de sessao, uma camada server-side unica para leitura de usuario autenticado e um mapeamento simples das rotas que devem virar protegidas quando a autenticacao entrar.

Tambem foi adicionada a documentacao canônica em `codex/contexts/auth-strategy.md`, com a recomendacao de usar `Auth.js` com sessao `JWT` na primeira fase e de introduzir `userId` nos modelos financeiros junto com a protecao de rotas.

## Impacto

O MVP continua sem login e sem dependencias novas de autenticacao, mas a base agora tem pontos explicitos de extensao para:

- sessao server-side
- definicao de rotas protegidas
- escopo de ownership por usuario

Isso reduz retrabalho futuro e evita espalhar integracao de auth em componentes, services e repositories no momento errado.

## Arquivos criados

- `src/types/auth.ts`
- `src/lib/auth/session.ts`
- `src/lib/auth/route-access.ts`
- `src/lib/auth/route-access.test.ts`
- `codex/contexts/auth-strategy.md`
- `codex/history/preparar-auth-futura-2026-04-16-1049.md`

## Arquivos alterados

- `AGENTS.md`
