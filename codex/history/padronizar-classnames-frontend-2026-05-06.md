# Padronizar Classnames Frontend

## Contexto

Componentes de frontend relevantes ainda concentravam strings longas de `className` diretamente no JSX. Isso deixava a leitura de composicao mais ruidosa, especialmente em historico, home, cards, familia, topbar e month scroller.

## Decisão

Foram criados e ampliados arquivos `.styles.ts` com objetos simples de classNames. A refatoracao manteve Tailwind CSS, preservou o visual e moveu apenas classes estaticas ou helpers de classe para arquivos de estilo.

## Impacto

Os componentes principais ficam mais focados em renderizacao e composicao. Nao houve alteracao de regra de negocio, persistencia ou dados existentes.

## Arquivos criados

- `src/components/layout/app-header.styles.ts`
- `src/features/dashboard/components/dashboard-analytics-cards.styles.ts`
- `src/features/dashboard/components/dashboard-latest-transactions.styles.ts`
- `src/features/dashboard/components/dashboard-list-cards.styles.ts`
- `src/features/dashboard/components/dashboard-page.styles.ts`
- `src/features/dashboard/components/dashboard-summary-cards.styles.ts`
- `src/features/families/components/family-member-card.styles.ts`
- `src/features/families/components/family-page.styles.ts`
- `codex/history/padronizar-classnames-frontend-2026-05-06.md`

## Arquivos alterados

- `src/components/layout/app-header.tsx`
- `src/features/dashboard/components/dashboard-account-balances.tsx`
- `src/features/dashboard/components/dashboard-category-breakdown.tsx`
- `src/features/dashboard/components/dashboard-latest-transactions.tsx`
- `src/features/dashboard/components/dashboard-page.tsx`
- `src/features/dashboard/components/dashboard-summary-cards.tsx`
- `src/features/dashboard/components/forecast-chart.tsx`
- `src/features/dashboard/components/monthly-expense-card.tsx`
- `src/features/families/components/family-member-card.tsx`
- `src/features/families/components/family-page.tsx`
- `src/features/transactions/components/transaction-card.tsx`
- `src/features/transactions/components/transaction-date-groups.tsx`
- `src/features/transactions/components/transactions-credit-group.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transactions-list.styles.ts`
- `src/features/transactions/components/transactions-monthly-summary.tsx`
