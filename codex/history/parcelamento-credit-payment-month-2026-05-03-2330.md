# Parcelamento de credito com mes de pagamento

## Contexto

O parcelamento de despesas em contas de credito precisa considerar o mes de pagamento da fatura em cada parcela, sem alterar transacoes antigas e sem criar entidade de fatura.

## Decisao

A regra ja estava centralizada em `buildInstallmentTransactions`: quando a transacao base possui `creditPaymentMonth`, cada parcela recebe seu proprio `competencyMonth` mensal e recalcula `creditPaymentMonth` como o mes seguinte da competencia da parcela.

Foram adicionados testes explicitos para a sequencia mensal de competencias e para o `creditPaymentMonth` de cada parcela. O limite de 12x continua no schema existente.

## Impacto

Uma compra de credito parcelada em maio/2026 gera parcelas com competencias maio, junho e julho, e meses de pagamento junho, julho e agosto. A descricao, divisao de centavos e status `planned` das parcelas futuras seguem preservados.

Foram executados:

- `npm run test -- src/features/transactions/utils/build-installment-transactions.test.ts src/features/transactions/schemas/transaction-schema.test.ts`
- `npm run typecheck`
- `npm run test`
- `npm run lint`

## Arquivos criados

- `codex/history/parcelamento-credit-payment-month-2026-05-03-2330.md`

## Arquivos alterados

- `src/features/transactions/utils/build-installment-transactions.test.ts`
