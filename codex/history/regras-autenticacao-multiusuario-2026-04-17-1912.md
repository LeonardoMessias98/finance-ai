# Regras de autenticacao e multiusuario

## Contexto

O projeto precisava deixar de ser single-tenant no codigo e passar a tratar autenticacao e ownership como partes reais do dominio. A solicitacao exigiu login por email e senha com hash SHA-256, sessao unica por usuario, refresh token persistido em banco e filtro obrigatorio por `userId` em todos os dados financeiros.

## Decisao

Foi implementada autenticacao propria dentro do App Router, sem backend separado e sem introduzir dependencia extra de auth neste momento. O login usa `passwordHash` recebido do cliente, emite `access token` JWT com expiracao de 1 hora, persiste `refresh token` com TTL index e revoga a sessao anterior ao autenticar novamente.

Em paralelo, as entidades financeiras atuais passaram a carregar `userId` no schema, tipos, validacao, repositories e services. A sessao e resolvida na borda server-side e apenas `userId` segue para as camadas de dominio.

## Impacto

O app agora opera com isolamento multiusuario nas features financeiras principais e exige autenticacao para home, contas, categorias, transacoes, orcamentos e metas. Seeds passam a criar um usuario inicial e todos os dados financeiros deixam de ser globais. A base fica coerente com uso privado real e pronta para evoluir sem reintroduzir consultas sem ownership.

## Arquivos criados

- `src/app/api/auth/refresh/route.ts`
- `src/app/login/page.tsx`
- `src/features/auth/actions/login-action.ts`
- `src/features/auth/actions/logout-action.ts`
- `src/features/auth/components/login-form.tsx`
- `src/features/auth/components/logout-button.tsx`
- `src/features/auth/components/session-keep-alive.tsx`
- `src/features/auth/repositories/refresh-token-repository.ts`
- `src/features/auth/repositories/user-repository.ts`
- `src/features/auth/schemas/login-schema.ts`
- `src/features/auth/schemas/user-schema.ts`
- `src/features/auth/services/login-service.ts`
- `src/features/auth/services/logout-service.ts`
- `src/features/auth/types/auth.ts`
- `src/lib/auth/cookies.ts`
- `src/lib/auth/jwt.test.ts`
- `src/lib/auth/jwt.ts`
- `src/lib/auth/password.test.ts`
- `src/lib/auth/password.ts`
- `src/lib/auth/request-context.ts`
- `src/lib/auth/session-cookies.ts`
- `src/lib/db/models/refresh-token-model.ts`
- `src/lib/db/models/user-model.ts`

## Arquivos alterados

- `.env.example`
- `README.md`
- `codex/contexts/auth-strategy.md`
- `src/app/accounts/page.tsx`
- `src/app/budgets/page.tsx`
- `src/app/categories/page.tsx`
- `src/app/goals/page.tsx`
- `src/app/page.tsx`
- `src/app/transactions/page.tsx`
- `src/components/layout/app-header.tsx`
- `src/components/layout/app-shell.tsx`
- `src/features/accounts/repositories/account-repository.ts`
- `src/features/accounts/schemas/account-schema.ts`
- `src/features/accounts/services/create-account-service.ts`
- `src/features/accounts/services/delete-account-service.ts`
- `src/features/accounts/services/get-account-for-editing-service.ts`
- `src/features/accounts/services/list-accounts-for-management-service.ts`
- `src/features/accounts/services/list-operational-accounts-service.ts`
- `src/features/accounts/services/toggle-account-status-service.ts`
- `src/features/accounts/services/update-account-service.ts`
- `src/features/accounts/types/account.ts`
- `src/features/accounts/utils/normalize-account-form-values.ts`
- `src/features/budgets/repositories/budget-repository.ts`
- `src/features/budgets/schemas/budget-schema.ts`
- `src/features/budgets/services/create-budget-service.ts`
- `src/features/budgets/services/get-budget-for-editing-service.ts`
- `src/features/budgets/services/list-budgets-for-management-service.ts`
- `src/features/budgets/services/update-budget-service.ts`
- `src/features/budgets/types/budget.ts`
- `src/features/budgets/utils/budget-consumption.test.ts`
- `src/features/budgets/utils/normalize-budget-form-values.ts`
- `src/features/categories/repositories/category-repository.ts`
- `src/features/categories/schemas/category-schema.ts`
- `src/features/categories/services/create-category-service.ts`
- `src/features/categories/services/delete-category-service.ts`
- `src/features/categories/services/get-category-for-editing-service.ts`
- `src/features/categories/services/list-categories-for-management-service.ts`
- `src/features/categories/services/list-operational-categories-service.ts`
- `src/features/categories/services/toggle-category-status-service.ts`
- `src/features/categories/services/update-category-service.ts`
- `src/features/categories/types/category.ts`
- `src/features/categories/utils/normalize-category-form-values.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
- `src/features/goals/repositories/goal-repository.ts`
- `src/features/goals/schemas/goal-schema.ts`
- `src/features/goals/services/create-goal-service.ts`
- `src/features/goals/services/get-goal-for-editing-service.ts`
- `src/features/goals/services/list-goals-for-management-service.ts`
- `src/features/goals/services/update-goal-service.ts`
- `src/features/goals/types/goal.ts`
- `src/features/goals/utils/goal-progress.test.ts`
- `src/features/goals/utils/normalize-goal-form-values.ts`
- `src/features/transactions/repositories/transaction-repository.ts`
- `src/features/transactions/schemas/transaction-schema.ts`
- `src/features/transactions/services/assert-transaction-relations-service.ts`
- `src/features/transactions/services/create-transaction-service.ts`
- `src/features/transactions/services/delete-transaction-service.ts`
- `src/features/transactions/services/get-transaction-for-editing-service.ts`
- `src/features/transactions/services/list-transactions-for-management-service.ts`
- `src/features/transactions/services/update-transaction-service.ts`
- `src/features/transactions/types/transaction.ts`
- `src/features/transactions/utils/build-installment-transactions.test.ts`
- `src/features/transactions/utils/normalize-transaction-form-values.ts`
- `src/features/transactions/utils/transaction-form-defaults.test.ts`
- `src/lib/auth/route-access.test.ts`
- `src/lib/auth/route-access.ts`
- `src/lib/auth/session.ts`
- `src/lib/db/models/account-model.ts`
- `src/lib/db/models/budget-model.ts`
- `src/lib/db/models/category-model.ts`
- `src/lib/db/models/goal-model.ts`
- `src/lib/db/models/transaction-model.ts`
- `src/lib/db/seeds/initial-seed-data.ts`
- `src/lib/db/seeds/seed-initial-database.ts`
- `src/types/auth.ts`
