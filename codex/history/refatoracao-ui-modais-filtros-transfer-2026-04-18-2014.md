# Contexto

Refatorar a experiência principal do `finance-ai` para reduzir complexidade operacional, padronizar filtros e tornar os fluxos de criação mais consistentes no mobile. A tarefa também exigiu remover completamente o tipo de transação `transfer`, desacoplar a criação de transações da rota `/transactions` e consolidar o uso de modais sem quebrar a arquitetura por feature.

## Decisão

Removi `transfer` do domínio inteiro, incluindo tipos, schemas, model Mongoose, repositories, services, componentes e seeds. Para a UX, adotei dois padrões complementares:

- um modal global de nova transação, controlado por contexto no `AppShell`, sem navegação para `/transactions`
- um padrão de modal mobile-only para contas, categorias, orçamentos e metas, mantendo formulário inline no desktop

Também introduzi componentes compartilhados de filtro para reaproveitar chips de seleção e cards de filtros entre dashboard, categorias, orçamentos e histórico.

## Impacto

A aplicação ficou mais simples no domínio e na interface. Transações agora trabalham apenas com `income` e `expense`, o formulário perdeu a ramificação de transferência e os cálculos de dashboard e filtros ficaram mais diretos.

Na navegação, o CTA de nova transação passou a abrir o modal global de qualquer tela autenticada, sem acoplamento com a página de histórico. Nos módulos de gestão, o mobile deixa de carregar uma seção fixa de criação e passa a usar modais consistentes, reduzindo rolagem e ruído visual.

Na manutenção, a base ganhou utilitários compartilhados de filtro, builders explícitos de href por feature e um contexto isolado para o modal global, preservando a separação entre UI, regras de negócio e infraestrutura.

## Arquivos criados

- `src/components/filters/filter-chip-group.tsx`
- `src/components/filters/filter-chip-group.types.ts`
- `src/components/filters/filter-panel.tsx`
- `src/components/ui/mobile-only-modal-shell.tsx`
- `src/features/accounts/utils/build-accounts-href.ts`
- `src/features/categories/utils/build-categories-href.ts`
- `src/features/transactions/components/open-transaction-modal-button.tsx`
- `src/features/transactions/context/global-transaction-modal-context.ts`
- `src/features/transactions/context/global-transaction-modal-provider.tsx`
- `src/features/transactions/hooks/use-global-transaction-modal.ts`
- `src/features/transactions/types/global-transaction-modal.ts`
- `src/hooks/use-is-mobile.ts`
- `src/lib/search-params.ts`

## Arquivos alterados

- `README.md`
- `src/app/accounts/page.tsx`
- `src/app/budgets/page.tsx`
- `src/app/categories/page.tsx`
- `src/app/goals/page.tsx`
- `src/app/transactions/page.tsx`
- `src/components/layout/app-header.test.tsx`
- `src/components/layout/app-header.tsx`
- `src/components/layout/app-shell.tsx`
- `src/components/ui/modal-shell.tsx`
- `src/features/accounts/components/account-form.tsx`
- `src/features/accounts/components/accounts-list.tsx`
- `src/features/accounts/components/accounts-page.tsx`
- `src/features/accounts/repositories/account-repository.ts`
- `src/features/budgets/components/budget-form.tsx`
- `src/features/budgets/components/budgets-month-filter.tsx`
- `src/features/budgets/components/budgets-page.tsx`
- `src/features/budgets/utils/build-budgets-href.ts`
- `src/features/categories/components/categories-list.tsx`
- `src/features/categories/components/categories-page.tsx`
- `src/features/categories/components/category-form.tsx`
- `src/features/categories/components/category-type-filter.tsx`
- `src/features/categories/types/category.ts`
- `src/features/categories/utils/category-formatters.ts`
- `src/features/categories/utils/group-categories-by-type.ts`
- `src/features/dashboard/components/dashboard-latest-transactions.tsx`
- `src/features/dashboard/components/dashboard-month-filter.tsx`
- `src/features/dashboard/components/dashboard-page.tsx`
- `src/features/dashboard/types/dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.ts`
- `src/features/goals/components/goal-form.tsx`
- `src/features/goals/components/goals-page.tsx`
- `src/features/goals/utils/build-goals-href.ts`
- `src/features/transactions/components/transaction-form.tsx`
- `src/features/transactions/components/transaction-type-filter.tsx`
- `src/features/transactions/components/transactions-filters.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transactions-page.tsx`
- `src/features/transactions/repositories/transaction-repository.ts`
- `src/features/transactions/schemas/transaction-schema.ts`
- `src/features/transactions/services/assert-transaction-relations-service.ts`
- `src/features/transactions/types/transaction.ts`
- `src/features/transactions/utils/build-transactions-href.test.ts`
- `src/features/transactions/utils/build-transactions-href.ts`
- `src/features/transactions/utils/normalize-transaction-form-values.ts`
- `src/features/transactions/utils/transaction-form-defaults.ts`
- `src/features/transactions/utils/transaction-formatters.ts`
- `src/lib/db/models/transaction-model.ts`
- `src/lib/db/seeds/initial-seed-data.ts`
- `src/lib/db/seeds/seed-initial-database.ts`
