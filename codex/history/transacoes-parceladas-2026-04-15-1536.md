# Transações Parceladas

## Contexto

Adicionar suporte inicial para compras parceladas na feature de transações, gerando automaticamente parcelas futuras relacionadas a partir de uma única criação.

## Decisão

O parcelamento foi implementado na camada de service, que transforma uma despesa parcelada em uma série de transações mensais. O repository ficou responsável pela persistência em lote e por atribuir um `parentTransactionId` comum a todas as parcelas, inclusive à primeira. O valor informado no formulário foi tratado como valor total da compra e dividido entre as parcelas, distribuindo eventuais centavos residuais nas primeiras parcelas.

## Impacto

Agora o app consegue criar séries parceladas com `installment.current`, `installment.total`, `parentTransactionId` e `competencyMonth` corretos em cada parcela. A listagem passou a identificar parcelas visualmente e a exclusão de qualquer item da série remove toda a série, evitando inconsistência parcial.

## Limitações

- A edição isolada de parcelas ainda não está disponível.
- Nesta primeira versão, o parcelamento só pode ser definido na criação da despesa.
- Em séries parceladas, a primeira parcela respeita o status escolhido no formulário e as demais são criadas como `planned`.
- A exclusão de uma transação pertencente a uma série parcelada remove a série inteira por segurança e previsibilidade.

## Arquivos criados

- `src/features/transactions/utils/build-installment-transactions.ts`
- `src/features/transactions/utils/build-installment-transactions.test.ts`
- `codex/history/transacoes-parceladas-2026-04-15-1536.md`

## Arquivos alterados

- `src/features/transactions/types/transaction.ts`
- `src/features/transactions/schemas/transaction-schema.ts`
- `src/features/transactions/utils/normalize-transaction-form-values.ts`
- `src/features/transactions/services/transaction-errors.ts`
- `src/features/transactions/services/create-transaction-service.ts`
- `src/features/transactions/services/update-transaction-service.ts`
- `src/features/transactions/services/delete-transaction-service.ts`
- `src/features/transactions/repositories/transaction-repository.ts`
- `src/features/transactions/actions/create-transaction-action.ts`
- `src/features/transactions/actions/delete-transaction-action.ts`
- `src/features/transactions/components/transaction-form.tsx`
- `src/features/transactions/components/transaction-delete-button.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transactions-page.tsx`
- `src/lib/db/models/transaction-model.ts`
