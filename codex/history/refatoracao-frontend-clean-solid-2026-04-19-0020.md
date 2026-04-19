# Contexto

A interface já estava funcional, mas ainda havia duplicação relevante de estrutura, estados vazios, banners de feedback e lógica de formulários. O principal ponto crítico era o frontend ficar menos previsível para manutenção por IA, especialmente nos formulários de gestão e no fluxo de transações.

## Decisão

A refatoração focou em ganho prático de manutenção, sem criar abstrações genéricas demais. O trabalho foi dividido em três frentes:

- criação de primitivas reutilizáveis para layout e feedback (`PageHeader`, `PageSection`, `EmptyState`, `StatusBanner`, helpers de formulário)
- extração da lógica repetida dos formulários menores para helpers dedicados
- quebra do `transaction-form` em arquivos menores, separando hook, helpers, tipos e blocos visuais

Também padronizei páginas e listagens para consumirem os mesmos componentes compartilhados, reduzindo duplicação visual e acoplamento entre UI e comportamento.

## Impacto

O frontend ficou mais coeso e previsível:

- formulários menores agora compartilham wrapper visual, feedback e aplicação de erros vindos das actions
- páginas de contas, categorias, orçamentos, metas e transações passaram a usar a mesma estrutura de header e seção
- estados vazios e banners de status foram centralizados em componentes únicos
- o formulário de transações deixou de ser um arquivo grande e passou a ter separação explícita entre composição visual e lógica

Na prática, isso reduz custo de manutenção, facilita edição por outros agentes e melhora a consistência entre telas sem alterar o comportamento do produto.

## Arquivos criados

- `src/components/forms/field-error-message.tsx`
- `src/components/forms/form-card-shell.tsx`
- `src/components/forms/form-feedback-message.tsx`
- `src/components/layout/page-header.tsx`
- `src/components/layout/page-section.tsx`
- `src/components/ui/empty-state.tsx`
- `src/components/ui/status-banner.tsx`
- `src/features/accounts/components/account-form.helpers.ts`
- `src/features/budgets/components/budget-form.helpers.ts`
- `src/features/categories/components/category-form.helpers.ts`
- `src/features/goals/components/goal-form.helpers.ts`
- `src/features/transactions/components/transaction-form.actions.tsx`
- `src/features/transactions/components/transaction-form.advanced-fields.tsx`
- `src/features/transactions/components/transaction-form.helpers.ts`
- `src/features/transactions/components/transaction-form.hooks.ts`
- `src/features/transactions/components/transaction-form.primary-fields.tsx`
- `src/features/transactions/components/transaction-form.types.ts`
- `src/lib/forms/form-action-feedback.ts`

## Arquivos alterados

- `src/features/accounts/components/account-form.tsx`
- `src/features/accounts/components/accounts-list.tsx`
- `src/features/accounts/components/accounts-page.tsx`
- `src/features/budgets/components/budget-form.tsx`
- `src/features/budgets/components/budgets-list.tsx`
- `src/features/budgets/components/budgets-page.tsx`
- `src/features/categories/components/categories-list.tsx`
- `src/features/categories/components/categories-page.tsx`
- `src/features/categories/components/category-form.tsx`
- `src/features/dashboard/components/dashboard-account-balances.tsx`
- `src/features/dashboard/components/dashboard-category-breakdown.tsx`
- `src/features/dashboard/components/dashboard-latest-transactions.tsx`
- `src/features/dashboard/components/dashboard-page.tsx`
- `src/features/goals/components/goal-form.tsx`
- `src/features/goals/components/goals-list.tsx`
- `src/features/goals/components/goals-page.tsx`
- `src/features/transactions/components/transaction-form.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transactions-page.tsx`

## Remoções

- `src/features/transactions/components/transaction-form.sections.tsx`
