# Performance de historico e familia

## Contexto

A revisao buscou reduzir calculos e agrupamentos dentro das telas de historico e familia, mantendo componentes focados em renderizacao.

## Decisao

O historico passou a usar um service de composicao da pagina, que resolve usuario uma vez, carrega dados via repositories e entrega resumo mensal e grupos de lista prontos para renderizacao.

A lista de transacoes passou a receber um view model com grupos debito/credito, grupos por data e dados de conta/categoria ja resolvidos.

Na familia, o grafico por categoria recebeu helper, types e styles proprios. O service de resumo familiar tambem reduziu passadas repetidas ao consolidar totais em uma unica agregacao.

## Impacto

As telas mantem o comportamento atual, mas deixam menos trabalho de dominio nos componentes. Historico preserva totais de debito/credito e familia preserva os totais e agrupamentos de categoria por membro.

## Arquivos criados

- `src/features/transactions/services/get-transactions-page-data-service.ts`
- `src/features/transactions/utils/build-transactions-list-view.ts`
- `src/features/transactions/utils/build-transactions-list-view.test.ts`
- `src/features/families/components/family-category-expense-charts.helpers.ts`
- `src/features/families/components/family-category-expense-charts.helpers.test.ts`
- `src/features/families/components/family-category-expense-charts.styles.ts`
- `src/features/families/components/family-category-expense-charts.types.ts`
- `codex/history/performance-historico-familia-2026-05-06.md`

## Arquivos alterados

- `src/features/transactions/components/transactions-page.tsx`
- `src/features/transactions/components/transactions-page.test.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transactions-list.test.tsx`
- `src/features/transactions/components/transaction-date-groups.tsx`
- `src/features/transactions/components/transactions-list.types.ts`
- `src/features/transactions/utils/build-transaction-account-kind-groups.ts`
- `src/features/families/components/family-category-expense-charts.tsx`
- `src/features/families/services/get-family-financial-summary-service.ts`

## Arquivos removidos

- `src/features/transactions/components/transactions-list.helpers.ts`
