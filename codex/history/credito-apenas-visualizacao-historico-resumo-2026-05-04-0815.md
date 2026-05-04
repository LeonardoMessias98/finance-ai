# Credito Apenas Visualizacao Historico Resumo

## Contexto

Lancamentos em contas de credito devem continuar visiveis no historico e no grupo Credito, mas nao devem compor entradas, saidas ou resultado mensal enquanto nao existir uma funcionalidade de fatura.

## Decisao

O calculo mensal de debito foi centralizado em helper de transacoes, filtrando contas `credit` e `credit_card`. A tela de historico e o resumo principal da home passaram a usar essa regra para entradas, saidas, resultado e analytics.

## Impacto

Compras no credito seguem aparecendo na listagem e em recentes, mas nao distorcem os totais financeiros principais. Pagamentos de fatura continuam sendo despesas de conta debito e, por isso, seguem afetando o saldo e as saidas do mes.

## Arquivos criados

- `codex/history/credito-apenas-visualizacao-historico-resumo-2026-05-04-0815.md`

## Arquivos alterados

- `src/features/transactions/utils/build-transaction-account-kind-groups.ts`
- `src/features/transactions/utils/build-transaction-account-kind-groups.test.ts`
- `src/features/transactions/components/transactions-page.tsx`
- `src/features/transactions/components/transactions-page.test.tsx`
- `src/features/dashboard/utils/build-dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
