# Padronizar Totais Historico Debito Credito

## Contexto

A tela de historico precisava deixar explicita a diferenca entre resultado liquido de Debito e total visual de gastos no Credito. Dados antigos com income em conta de credito nao devem quebrar a tela nem distorcer os totais.

## Decisao

O helper de agrupamento do historico passou a calcular o total do grupo Credito usando apenas transacoes `expense`. O grupo Debito permanece com resultado liquido, e o resumo principal continua usando apenas contas debito/nao credito.

## Impacto

Compras em credito seguem visiveis no grupo Credito, mas incomes antigos em credito nao entram no total visual nem no resumo principal. A exibicao fica alinhada com a regra atual de que credito e apenas visualizacao ate existir fatura.

## Arquivos criados

- `codex/history/padronizar-totais-historico-debito-credito-2026-05-04-0821.md`

## Arquivos alterados

- `src/features/transactions/utils/build-transaction-account-kind-groups.ts`
- `src/features/transactions/utils/build-transaction-account-kind-groups.test.ts`
- `src/features/transactions/components/transactions-list.test.tsx`
- `src/features/transactions/components/transactions-page.test.tsx`
