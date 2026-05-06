# Pagamento Cartao Credito Transacao Debito

## Contexto

O fluxo de cartao de credito ja registrava despesas no credito e calculava fatura visualmente, mas o pagamento da fatura precisava ficar claro no cadastro de transacoes e continuar impactando as saidas de debito.

## Decisão

O pagamento de cartao foi mantido como `transaction` do tipo `expense`, usando `paymentForCreditAccountId` para apontar a conta de credito paga. O formulario ganhou a opcao explicita "Pagamento", que seleciona despesa paga, mostra a conta de credito paga no fluxo principal e restringe a conta de origem para contas nao credito.

## Impacto

O usuario pode registrar pagamento de cartao sem criar entidade de fatura. O valor sai da conta debito, aparece nas saidas de debito e reduz o saldo devido da conta de credito. As compatibilidades `credit` e `credit_card` foram preservadas, sem migracao destrutiva nem alteracao de dados existentes.

## Arquivos criados

- `src/features/transactions/components/transaction-form.type-selector.tsx`
- `codex/history/pagamento-cartao-credito-transacao-debito-2026-05-06.md`

## Arquivos alterados

- `src/features/transactions/components/transaction-form.tsx`
- `src/features/transactions/components/transaction-form.primary-fields.tsx`
- `src/features/transactions/components/transaction-form.advanced-fields.tsx`
- `src/features/transactions/components/transaction-form.hooks.ts`
- `src/features/transactions/components/transaction-form.helpers.ts`
- `src/features/transactions/components/transactions-page.test.tsx`
- `src/features/transactions/utils/build-transaction-account-kind-groups.test.ts`
- `src/features/accounts/utils/build-account-current-balances.test.ts`
- `src/features/transactions/utils/transaction-form-defaults.ts`
- `src/features/transactions/utils/transaction-form-defaults.test.ts`
