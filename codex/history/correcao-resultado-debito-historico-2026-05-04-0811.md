# Correcao Resultado Debito Historico

## Contexto

O resumo do grupo Debito no historico precisava representar resultado liquido, considerando entradas menos saidas, e nao soma absoluta dos lancamentos. Contas de credito atuais e legadas devem ficar fora desse calculo.

## Decisao

A regra de agrupamento por tipo de conta e calculo do resultado de debito foi extraida para um helper em `src/features/transactions/utils`. O componente de historico passou a consumir esse helper, mantendo a UI apenas responsavel por renderizar os grupos.

## Impacto

O grupo Debito agora calcula income como soma e expense como subtracao, considera contas antigas nao credito como debito e exclui contas `credit` e `credit_card` do resumo. O comportamento nao altera registros existentes nem regras de criacao de transacoes.

## Arquivos criados

- `src/features/transactions/utils/build-transaction-account-kind-groups.ts`
- `src/features/transactions/utils/build-transaction-account-kind-groups.test.ts`
- `codex/history/correcao-resultado-debito-historico-2026-05-04-0811.md`

## Arquivos alterados

- `src/features/transactions/components/transactions-list.tsx`
