# Ajustes UI Modais Filtros Transacoes

## Contexto

A interface ainda tinha atritos no fluxo principal de lançamentos. A página de transações mantinha o formulário fixo ocupando espaço demais, os filtros não escalavam bem entre desktop e mobile, faltava exclusão direta de contas e categorias, e alguns elementos visuais continuavam inconsistentes, como espaçamento superior, tags pouco visíveis e o campo de valor sem máscara de moeda.

## Decisão

Transformei a criação e edição de transações em modal, mantive os filtros como sidebar no desktop e usei modal fullscreen no mobile com a mesma lógica de navegação e aplicação. Também adicionei uma infraestrutura simples de modal reutilizável, máscara de valor em `BRL`, badges discretos para conta e categoria e fluxos de exclusão de contas e categorias com confirmação e bloqueio amigável quando já existem transações relacionadas.

## Impacto

O histórico de transações ficou mais limpo e focado na leitura. Criar ou editar lançamento exige menos rolagem, os filtros ficaram mais previsíveis em cada breakpoint e os metadados de conta e categoria ganharam destaque sem perder o estilo minimalista. Contas e categorias agora podem ser removidas pela interface sem quebrar o domínio quando já houver relacionamento com transações.

## Arquivos criados

- `src/components/ui/modal-shell.tsx`
- `src/features/accounts/actions/delete-account-action.ts`
- `src/features/accounts/components/account-delete-button.tsx`
- `src/features/accounts/services/account-errors.ts`
- `src/features/accounts/services/delete-account-service.ts`
- `src/features/categories/actions/delete-category-action.ts`
- `src/features/categories/components/category-delete-button.tsx`
- `src/features/categories/services/delete-category-service.ts`
- `src/features/transactions/components/transaction-meta-badge.tsx`
- `src/features/transactions/utils/build-transactions-href.test.ts`
- `src/features/transactions/utils/transaction-currency.test.ts`
- `src/features/transactions/utils/transaction-currency.ts`
- `codex/history/ajustes-ui-modais-filtros-transacoes-2026-04-17-1658.md`

## Arquivos alterados

- `src/app/transactions/error.tsx`
- `src/app/transactions/loading.tsx`
- `src/app/transactions/page.tsx`
- `src/components/layout/app-shell.tsx`
- `src/features/accounts/components/accounts-list.tsx`
- `src/features/accounts/components/accounts-page.tsx`
- `src/features/accounts/repositories/account-repository.ts`
- `src/features/budgets/components/budgets-page.tsx`
- `src/features/categories/components/categories-list.tsx`
- `src/features/categories/components/categories-page.tsx`
- `src/features/categories/repositories/category-repository.ts`
- `src/features/categories/services/category-errors.ts`
- `src/features/dashboard/components/dashboard-latest-transactions.tsx`
- `src/features/dashboard/components/dashboard-page.tsx`
- `src/features/goals/components/goals-page.tsx`
- `src/features/transactions/components/transaction-form.tsx`
- `src/features/transactions/components/transactions-filters.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transactions-page.tsx`
- `src/features/transactions/utils/build-transactions-href.ts`
