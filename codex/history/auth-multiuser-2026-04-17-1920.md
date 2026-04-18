# Auth Multiuser

## Contexto

O projeto precisava sair do modo single-tenant e passar a operar com autenticacao por login, sessao unica por usuario e isolamento total dos dados financeiros por ownership.

## Decisão

Foi mantida a implementacao de autenticacao propria dentro do App Router, com `access token` JWT em cookie `httpOnly`, `refresh token` persistido em colecao propria com TTL e ownership resolvido server-side por `userId`. Como complemento desta rodada, a protecao das rotas privadas foi movida para `middleware`, o seed ganhou modo destrutivo seguro via `--reset` e a politica de senha do login foi formalizada no front.

## Impacto

As rotas privadas deixam de depender apenas de redirect em page server component, o reset do banco fica reproduzivel para limpar os dados legados antes da nova fase multiusuario, e a documentacao passa a registrar explicitamente o trade-off de produto de persistir o `SHA-256` vindo do front apesar de nao ser a abordagem mais segura recomendada.

## Arquivos criados

- `codex/history/auth-multiuser-2026-04-17-1920.md`
- `src/features/auth/schemas/password-policy.ts`
- `src/features/auth/schemas/password-policy.test.ts`
- `src/lib/db/seeds/reset-database.ts`
- `src/middleware.ts`

## Arquivos alterados

- `.env.example`
- `README.md`
- `codex/contexts/architecture-rules.md`
- `codex/contexts/business-rules.md`
- `package.json`
- `scripts/seed-initial.ts`
- `src/app/login/page.tsx`
- `src/features/auth/components/login-form.tsx`
- `src/lib/auth/route-access.test.ts`
- `src/lib/auth/route-access.ts`
- `src/lib/db/seeds/seed-initial-database.ts`
