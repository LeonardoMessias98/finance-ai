# Saldo disponivel ignora gastos de credito

## Contexto

Foi solicitada uma revisao do calculo de saldo para garantir que gastos feitos em contas de credito nao descontem diretamente do saldo disponivel, mantendo o comportamento atual das contas de debito e tipos legados nao credito.

## Decisao

O calculo existente ja usa o helper centralizado `isCreditAccount` para montar saldos apenas com contas nao credito. Assim, `credit` e `credit_card` ficam fora do saldo bancario e despesas dessas contas aparecem nos resumos de credito.

Foram adicionados testes diretos para despesa paga em conta debito reduzindo saldo e despesa em `credit_card` legado nao reduzindo saldo disponivel.

## Impacto

Contas de debito e antigas nao credito continuam somando `initialBalance`, receitas recebidas e despesas pagas. Contas de credito continuam fora do saldo disponivel, e gastos de credito seguem exibidos separadamente em `creditAccountSummaries`.

Foram executados:

- `npm run test -- src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
- `npm run typecheck`
- `npm run test`
- `npm run lint`

## Arquivos criados

- `codex/history/saldo-disponivel-ignora-gastos-credito-2026-05-03-2332.md`

## Arquivos alterados

- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
