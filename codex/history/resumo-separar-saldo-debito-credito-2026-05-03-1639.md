# Resumo separado entre debito e credito

## Contexto

O resumo financeiro da home somava todas as contas no saldo disponivel, incluindo contas de credito.
Com a entrada dos tipos `credit` e `credit_card`, contas de credito nao devem aumentar nem reduzir o saldo bancario disponivel.

## Decisao

O builder do resumo passou a usar o helper centralizado de tipos de conta para separar contas nao credito e contas de credito.
`accountBalances` agora representa apenas contas de debito/nao credito, preservando tipos antigos como `checking`, `savings`, `cash` e `investment`.

Foi adicionado `creditAccountSummaries` para exibir separadamente:

- gasto no credito no mes
- pagamento associado no mes
- saldo em aberto simples, calculado como gasto menos pagamento

## Impacto

O saldo principal da home passa a considerar apenas saldo disponivel em contas nao credito.
Despesas em contas de credito nao distorcem o saldo total.
Pagamentos de cartao continuam afetando a conta de debito de origem e aparecem tambem como pagamento associado no resumo de credito.
Registros antigos permanecem compativeis.

## Arquivos criados

- `codex/history/resumo-separar-saldo-debito-credito-2026-05-03-1639.md`

## Arquivos alterados

- `src/features/dashboard/types/dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
- `src/features/dashboard/components/dashboard-summary-cards.tsx`
