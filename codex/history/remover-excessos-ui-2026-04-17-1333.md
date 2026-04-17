# Remover Excessos UI

## Contexto

A interface ainda carregava sinais de dashboard genérico: navegação principal com peso excessivo, muitos cards-resumo em páginas secundárias, descrições longas e blocos visuais redundantes que desviavam do objetivo principal de ver saldo, consultar histórico e lançar transações.

## Decisão

Simplifiquei a navegação global, reduzi a largura máxima das páginas e removi métricas redundantes das telas secundárias. Na home e nos módulos de apoio, troquei vários cards e textos explicativos por blocos mais compactos, títulos curtos e listas com menos ruído visual.

## Impacto

O app ficou mais silencioso e direto. O foco visual volta para saldo, histórico e criação de transações, enquanto contas, categorias, orçamentos e metas continuam acessíveis, mas com menos distrações e menos carga cognitiva.

## Arquivos criados

- `codex/history/remover-excessos-ui-2026-04-17-1333.md`

## Arquivos alterados

- `src/components/layout/app-shell.tsx`
- `src/components/layout/app-header.tsx`
- `src/components/layout/app-header.test.tsx`
- `src/components/filters/competency-month-switcher.tsx`
- `src/features/dashboard/components/dashboard-page.tsx`
- `src/features/dashboard/components/dashboard-summary-cards.tsx`
- `src/features/dashboard/components/dashboard-latest-transactions.tsx`
- `src/features/accounts/components/accounts-page.tsx`
- `src/features/accounts/components/accounts-list.tsx`
- `src/features/accounts/components/account-form.tsx`
- `src/features/categories/components/categories-page.tsx`
- `src/features/categories/components/category-type-filter.tsx`
- `src/features/categories/components/categories-list.tsx`
- `src/features/categories/components/category-form.tsx`
- `src/features/budgets/components/budgets-page.tsx`
- `src/features/budgets/components/budgets-month-filter.tsx`
- `src/features/budgets/components/budgets-list.tsx`
- `src/features/budgets/components/budget-form.tsx`
- `src/features/goals/components/goals-page.tsx`
- `src/features/goals/components/goals-list.tsx`
- `src/features/goals/components/goal-form.tsx`
