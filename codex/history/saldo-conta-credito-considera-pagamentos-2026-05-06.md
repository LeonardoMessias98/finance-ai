# Saldo Conta Credito Considera Pagamentos

## Contexto

Contas de credito acumulam despesas como divida negativa. Com o pagamento de credito registrado como despesa de debito associada por `paymentForCreditAccountId`, o saldo atual do credito precisa abater esses pagamentos.

## Decisão

O calculo de conta credito foi explicitado como `total de pagamentos associados - total de despesas no credito`. Assim, uma conta com R$ 1.000,00 em gastos e R$ 400,00 em pagamento fica com saldo atual de -R$ 600,00.

## Impacto

Pagamentos reduzem a divida do credito sem afetar duas vezes o saldo disponivel. O saldo disponivel muda apenas pela despesa registrada na conta debito de origem. A compatibilidade com `credit` e `credit_card` foi preservada sem alterar registros existentes.

## Arquivos criados

- `codex/history/saldo-conta-credito-considera-pagamentos-2026-05-06.md`

## Arquivos alterados

- `src/features/accounts/utils/build-account-current-balances.ts`
- `src/features/accounts/utils/build-account-current-balances.test.ts`
