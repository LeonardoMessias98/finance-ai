# Recentes da home separados por debito e credito

## Contexto

A secao Recentes da tela principal precisava mostrar tambem gastos feitos em contas de credito, deixando claro quais lancamentos pertencem a Debito e quais pertencem a Credito, sem alterar dados existentes nem misturar credito no saldo disponivel.

## Decisao

As transacoes recentes passaram a carregar `accountType` no resumo financeiro. A UI da home usa o helper centralizado `isCreditAccount` para separar `credit` e `credit_card` no grupo Credito, mantendo todos os demais tipos no grupo Debito.

O limite de recentes continua em 6 itens. Quando ha transacoes dos dois grupos, o resumo reserva ate 3 itens para Debito e ate 3 para Credito, evitando que gastos no credito sejam escondidos por lancamentos de debito mais recentes.

## Impacto

A home agora mostra a secao Recentes com grupos compactos de Debito e Credito. O calculo de saldo disponivel permanece baseado apenas nas contas nao credito e pagamentos de fatura continuam afetando o saldo por sairem de conta debito.

Foram executados:

- `npm run test -- src/features/dashboard/components/dashboard-latest-transactions.test.tsx`
- `npm run test -- src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
- `npm run typecheck`
- `npm run test`
- `npm run lint`

## Arquivos criados

- `src/features/dashboard/components/dashboard-latest-transactions.test.tsx`
- `codex/history/home-recentes-debito-credito-2026-05-03-2324.md`

## Arquivos alterados

- `src/features/dashboard/components/dashboard-latest-transactions.tsx`
- `src/features/dashboard/types/dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
