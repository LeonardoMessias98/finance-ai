# Migrar dominio para userId

## Contexto

O dominio financeiro precisava deixar de operar como base global e passar a tratar ownership por usuario em todas as leituras e mutacoes. O foco desta migracao foi garantir que contas, categorias, transacoes, orcamentos e metas dependam sempre de um usuario autenticado.

## Decisão

O projeto manteve o nome de campo `userId` em vez de `user_id` para seguir o padrao atual de TypeScript, Zod e Mongoose da base. A regra funcional, no entanto, permanece a mesma: cada entidade pessoal/financeira pertence a um unico usuario e nenhuma query relevante roda sem esse identificador.

## Impacto

Models, types, schemas e repositories dos dominios financeiros atuais passaram a exigir `userId`. Services resolvem o usuario autenticado via sessao server-side antes de chamar repositories. Home, dashboard, listagens por competencia mensal e filtros de transacao passaram a carregar dados apenas do usuario autenticado. Seeds tambem deixaram de criar dados globais.

Nao existe hoje uma entidade `history` no codigo, entao essa parte da regra fica documentada para qualquer colecao futura de dados pessoais.

## Arquivos criados

- `codex/history/migrar-dominio-para-user-id-2026-04-17-1928.md`

## Arquivos alterados

- `src/features/accounts/repositories/account-repository.ts`
- `src/features/categories/repositories/category-repository.ts`

## Arquivos relevantes da migracao ja refletidos no dominio

- `src/lib/db/models/{account-model.ts,category-model.ts,transaction-model.ts,budget-model.ts,goal-model.ts}`
- `src/features/accounts/{types/account.ts,schemas/account-schema.ts,services/*.ts,repositories/account-repository.ts}`
- `src/features/categories/{types/category.ts,schemas/category-schema.ts,services/*.ts,repositories/category-repository.ts}`
- `src/features/transactions/{types/transaction.ts,schemas/transaction-schema.ts,services/*.ts,repositories/transaction-repository.ts}`
- `src/features/budgets/{types/budget.ts,schemas/budget-schema.ts,services/*.ts,repositories/budget-repository.ts}`
- `src/features/goals/{types/goal.ts,schemas/goal-schema.ts,services/*.ts,repositories/goal-repository.ts}`
- `src/features/dashboard/services/get-dashboard-financial-summary-service.ts`
- `src/features/transactions/services/list-transactions-for-management-service.ts`
- `src/lib/db/seeds/{initial-seed-data.ts,seed-initial-database.ts,reset-database.ts}`
- `src/lib/auth/{session.ts,session-cookies.ts,route-access.ts}`
- `src/app/{page.tsx,accounts/page.tsx,categories/page.tsx,transactions/page.tsx,budgets/page.tsx,goals/page.tsx}`
