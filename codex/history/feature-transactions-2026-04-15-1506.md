# Feature Transactions

## Contexto

Implementar a primeira feature de movimentações financeiras do `finance-ai`, cobrindo criação, listagem, edição, exclusão e filtros por competência, conta, categoria e tipo.

## Decisão

A feature foi construída seguindo o mesmo padrão já estabelecido em `accounts` e `categories`: mutações em `actions`, regras de negócio em `services`, persistência em `repositories` e UI isolada em componentes pequenos. A validação de integridade entre conta, categoria e tipo da transação ficou centralizada na camada de serviço para evitar lógica financeira espalhada no formulário.

## Impacto

O projeto agora possui um fluxo completo de gestão de transações com `Server Actions`, `Zod`, `React Hook Form` e `Mongoose`. A listagem suporta filtros operacionais, a UI diferencia receitas, despesas e transferências, e o roteamento já inclui estados explícitos de loading e error para a nova tela.

## Arquivos criados

- `src/features/transactions/actions/create-transaction-action.ts`
- `src/features/transactions/actions/delete-transaction-action.ts`
- `src/features/transactions/actions/update-transaction-action.ts`
- `src/features/transactions/components/transaction-delete-button.tsx`
- `src/features/transactions/components/transaction-form.tsx`
- `src/features/transactions/components/transactions-filters.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transactions-page.tsx`
- `src/features/transactions/services/assert-transaction-relations-service.ts`
- `src/features/transactions/services/create-transaction-service.ts`
- `src/features/transactions/services/delete-transaction-service.ts`
- `src/features/transactions/services/get-transaction-for-editing-service.ts`
- `src/features/transactions/services/list-transactions-for-management-service.ts`
- `src/features/transactions/services/transaction-errors.ts`
- `src/features/transactions/services/update-transaction-service.ts`
- `src/features/transactions/utils/build-transactions-href.ts`
- `src/features/transactions/utils/normalize-transaction-form-values.ts`
- `src/features/transactions/utils/transaction-formatters.ts`
- `src/app/transactions/page.tsx`
- `src/app/transactions/loading.tsx`
- `src/app/transactions/error.tsx`
- `codex/history/feature-transactions-2026-04-15-1506.md`

## Arquivos alterados

- `src/components/layout/app-header.tsx`
- `src/features/transactions/types/transaction.ts`
- `src/features/transactions/schemas/transaction-schema.ts`
- `src/features/transactions/repositories/transaction-repository.ts`
- `src/lib/db/models/transaction-model.ts`
