# Mes de pagamento para compras no credito

## Contexto

Compras feitas em contas de credito precisam registrar em qual mes entram para pagamento da fatura, sem criar entidade de fatura, sem alterar dados existentes e sem migration destrutiva.

## Decisao

Foi adicionado o campo opcional `creditPaymentMonth` em transacoes. O campo aceita `YYYY-MM`, permanece opcional para preservar transacoes antigas e e preenchido no service somente para despesas cuja conta de origem seja `credit` ou `credit_card`.

O valor padrao e o mes seguinte ao `competencyMonth`. Receitas e transacoes de contas nao credito nao usam o campo.

## Impacto

Compras no credito continuam aparecendo no historico do mes da compra via `competencyMonth`, mas agora tambem carregam o mes de pagamento da fatura em `creditPaymentMonth`. Contas de debito e transacoes antigas sem o campo continuam funcionando normalmente.

Foram executados:

- `npm run test -- src/features/transactions/utils/credit-payment-month.test.ts src/features/transactions/schemas/transaction-schema.test.ts src/features/transactions/services/create-transaction-service.test.ts`
- `npm run test`
- `npm run typecheck`
- `npm run lint`

## Arquivos criados

- `src/features/transactions/utils/credit-payment-month.ts`
- `src/features/transactions/utils/credit-payment-month.test.ts`
- `src/features/transactions/services/create-transaction-service.test.ts`
- `codex/history/credit-payment-month-transacoes-credito-2026-05-03-2329.md`

## Arquivos alterados

- `src/features/transactions/types/transaction.ts`
- `src/features/transactions/schemas/transaction-schema.ts`
- `src/features/transactions/schemas/transaction-schema.test.ts`
- `src/features/transactions/services/create-transaction-service.ts`
- `src/features/transactions/services/update-transaction-service.ts`
- `src/features/transactions/repositories/transaction-repository.ts`
- `src/features/transactions/utils/build-installment-transactions.ts`
- `src/lib/db/models/transaction-model.ts`
