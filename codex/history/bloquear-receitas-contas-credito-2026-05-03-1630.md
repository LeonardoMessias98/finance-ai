# Bloquear receitas em contas de credito

## Contexto

Transacoes de receita nao devem ser registradas em contas de credito.
A regra precisa considerar contas novas `credit` e contas antigas `credit_card`, sem alterar registros existentes no banco.

## Decisao

A validacao foi adicionada em `assertTransactionRelations`, que ja carrega a conta e categoria do usuario antes da persistencia.
Esse ponto protege criacao e edicao de transacoes por service/action e usa o helper centralizado `isCreditAccount`.

O formulario tambem passou a ocultar contas de credito para novas receitas, mas essa e apenas uma melhoria de fluxo; a protecao principal permanece no service.

## Impacto

Tentativas de criar ou editar receita em conta de credito retornam o erro amigavel:

`Contas de crédito não aceitam receitas. Use uma conta de débito para registrar entradas.`

Receitas continuam permitidas em contas nao credito, incluindo tipos legados como `checking`, e despesas continuam permitidas em contas de credito.

## Arquivos criados

- `src/features/transactions/services/assert-transaction-relations-service.test.ts`
- `codex/history/bloquear-receitas-contas-credito-2026-05-03-1630.md`

## Arquivos alterados

- `src/features/transactions/services/assert-transaction-relations-service.ts`
- `src/features/transactions/components/transaction-form.helpers.ts`
- `src/features/transactions/components/transaction-form.hooks.ts`
- `src/features/transactions/utils/transaction-form-defaults.test.ts`
