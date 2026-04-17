# Dashboard Resumo Financeiro

## Contexto

Implementar o primeiro dashboard funcional do `finance-ai`, com visão consolidada do mês atual e dados financeiros preparados inteiramente no servidor.

## Decisão

O resumo foi centralizado em uma service dedicada do `dashboard`, que orquestra contas, categorias e transações já existentes. A agregação financeira ficou isolada em funções utilitárias específicas, separando cálculo de saldo, totais mensais, totais por categoria e últimas transações.

## Impacto

O dashboard agora mostra patrimônio atual, receitas, despesas, resultado do mês, saldo por conta, totais por categoria e últimas transações. A home passou a ser dinâmica para refletir mudanças reais de dados, e o cálculo de saldo respeita a regra de aplicar apenas transações pagas ou recebidas.

## Arquivos criados

- `src/features/dashboard/types/dashboard-financial-summary.ts`
- `src/features/dashboard/utils/get-current-competency-month.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
- `src/features/dashboard/services/get-dashboard-financial-summary-service.ts`
- `src/features/dashboard/components/dashboard-summary-cards.tsx`
- `src/features/dashboard/components/dashboard-account-balances.tsx`
- `src/features/dashboard/components/dashboard-category-breakdown.tsx`
- `src/features/dashboard/components/dashboard-latest-transactions.tsx`
- `codex/history/dashboard-resumo-financeiro-2026-04-15-1522.md`

## Arquivos alterados

- `src/features/dashboard/components/dashboard-page.tsx`
- `src/app/page.tsx`
