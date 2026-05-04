# Parcelamento de despesas em contas de credito

## Contexto

Despesas em contas de credito precisam poder ser parceladas sem alterar registros existentes nem atualizar transacoes antigas automaticamente.
O fluxo anterior ja possuia suporte inicial a series parceladas, mas aceitava mais parcelas e nao restringia o parcelamento a contas de credito.

## Decisao

O limite de parcelas foi ajustado para 1 a 12 no schema de formulario, no schema de persistencia e no model Mongoose.
A validacao de relacao passou a permitir parcelamento maior que 1 apenas quando a transacao e `expense` e a conta selecionada e credito, usando o helper centralizado de tipos de conta.

O builder de parcelas passou a:

- criar uma transacao por parcela
- adicionar o sufixo `N/T` na descricao
- manter o status original na primeira parcela
- criar parcelas futuras com status `planned`
- dividir o valor igualmente e aplicar a diferenca de centavos na ultima parcela

## Impacto

Despesas em contas de credito podem ser lancadas de 1x ate 12x.
Receitas continuam sem parcelamento.
Despesas em contas nao credito continuam sem parcelamento maior que 1.
Transacoes antigas permanecem intactas.

## Arquivos criados

- `src/features/transactions/schemas/transaction-schema.test.ts`
- `codex/history/parcelamento-despesas-contas-credito-2026-05-03-1633.md`

## Arquivos alterados

- `src/features/transactions/schemas/transaction-schema.ts`
- `src/lib/db/models/transaction-model.ts`
- `src/features/transactions/services/assert-transaction-relations-service.ts`
- `src/features/transactions/services/assert-transaction-relations-service.test.ts`
- `src/features/transactions/utils/build-installment-transactions.ts`
- `src/features/transactions/utils/build-installment-transactions.test.ts`
- `src/features/transactions/components/transaction-form.helpers.ts`
- `src/features/transactions/components/transaction-form.hooks.ts`
- `src/features/transactions/components/transaction-form.tsx`
- `src/features/transactions/components/transaction-form.advanced-fields.tsx`
