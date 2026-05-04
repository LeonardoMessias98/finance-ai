# Pagamento de cartao de credito no MVP

## Contexto

O MVP precisa registrar pagamento de cartao de credito sem criar um sistema de faturas.
A decisao deve preservar registros existentes e manter o pagamento como uma transacao comum do tipo `expense`.

## Decisao

Foi adicionado o campo opcional `paymentForCreditAccountId` em transacoes.
Quando preenchido, ele representa que a despesa registrada em uma conta de debito e um pagamento associado a uma conta de credito.

A validacao ficou distribuida entre schema e service:

- schema garante que pagamento de cartao so exista em transacoes `expense`
- service carrega as contas do usuario e valida que a origem nao e credito
- service valida que a conta associada ao pagamento e credito, incluindo o tipo legado `credit_card`

## Impacto

O pagamento de cartao fica simples e rastreavel sem introduzir faturas, fechamento, vencimento ou conciliacao automatica.
A UI mostra o campo opcional em `Mais opcoes` para despesas, usando contas de credito ativas.
Transacoes antigas continuam intactas e sem preenchimento automatico do novo campo.

## Arquivos criados

- `codex/history/pagamento-cartao-credito-mvp-2026-05-03-1636.md`

## Arquivos alterados

- `src/features/transactions/types/transaction.ts`
- `src/features/transactions/schemas/transaction-schema.ts`
- `src/features/transactions/schemas/transaction-schema.test.ts`
- `src/features/transactions/services/assert-transaction-relations-service.ts`
- `src/features/transactions/services/assert-transaction-relations-service.test.ts`
- `src/features/transactions/repositories/transaction-repository.ts`
- `src/features/transactions/utils/normalize-transaction-form-values.ts`
- `src/features/transactions/utils/transaction-form-defaults.ts`
- `src/features/transactions/utils/transaction-form-defaults.test.ts`
- `src/features/transactions/components/transaction-form.advanced-fields.tsx`
- `src/features/transactions/components/transaction-form.helpers.ts`
- `src/features/transactions/components/transaction-form.hooks.ts`
- `src/features/transactions/components/transaction-form.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/lib/db/models/transaction-model.ts`
