# Ajustes UI Listagens Navegacao

## Contexto

A interface ainda apresentava quebra visual na topbar, redundância entre a marca visível e a navegação inicial, pouco respiro no topo da home e inconsistência na experiência de listagem de transações.

## Decisão

Consolidei a topbar em uma única linha, removi a duplicidade visível entre `Financeiro` e `Início`, aumentei o espaçamento superior do shell e transformei o filtro por tipo em um componente reutilizável entre home e histórico. Também centralizei as classes visuais de tipo de transação para manter dot e cor do valor consistentes.

## Impacto

O app ficou mais compacto e previsível. A home respira melhor, a navegação principal perdeu ruído e as listagens de transações agora compartilham a mesma lógica visual e funcional para tipo, mês e links de contexto.

## Arquivos criados

- `src/features/transactions/components/transaction-type-filter.tsx`
- `codex/history/ajustes-ui-listagens-navegacao-2026-04-17-1624.md`

## Arquivos alterados

- `src/components/layout/app-header.tsx`
- `src/components/layout/app-header.test.tsx`
- `src/components/layout/app-shell.tsx`
- `src/app/page.tsx`
- `src/features/dashboard/components/dashboard-page.tsx`
- `src/features/dashboard/components/dashboard-month-filter.tsx`
- `src/features/dashboard/components/dashboard-latest-transactions.tsx`
- `src/features/dashboard/services/get-dashboard-financial-summary-service.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
- `src/features/dashboard/utils/build-dashboard-href.ts`
- `src/features/transactions/components/transactions-filters.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/utils/transaction-formatters.ts`
