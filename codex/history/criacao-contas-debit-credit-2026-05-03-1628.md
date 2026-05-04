# Criacao de contas debit e credit

## Contexto

Novas contas devem ser criadas apenas como `debit` ou `credit`, sem alterar registros existentes no banco e sem migration.
Contas antigas com tipos como `checking`, `savings`, `cash`, `investment` e `credit_card` precisam continuar sendo lidas e exibidas normalmente.

## Decisao

Foram separados os tipos persistidos dos tipos permitidos em mutacoes.
`accountTypeValues` continua aceitando valores legados para compatibilidade de leitura, enquanto `accountMutationTypeValues` limita formularios, actions, services e repositories a `debit` e `credit`.

Contas `credit` passam a exigir `initialBalance` igual a `0` no schema e no service.
A normalizacao tambem zera o saldo inicial de contas de credito antes da persistencia.

## Impacto

A UI de contas mostra apenas as opcoes Debito e Credito.
Contas de debito podem receber saldo inicial, e contas de credito mantem saldo inicial zero.
Registros antigos continuam compativeis na leitura, listagem e formatacao.

## Arquivos criados

- `src/features/accounts/schemas/account-schema.test.ts`
- `src/features/accounts/utils/normalize-account-form-values.test.ts`
- `codex/history/criacao-contas-debit-credit-2026-05-03-1628.md`

## Arquivos alterados

- `src/features/accounts/types/account.ts`
- `src/features/accounts/schemas/account-schema.ts`
- `src/features/accounts/services/create-account-service.ts`
- `src/features/accounts/services/update-account-service.ts`
- `src/features/accounts/components/account-form.tsx`
- `src/features/accounts/components/account-form.helpers.ts`
- `src/features/accounts/utils/account-formatters.ts`
- `src/features/accounts/utils/account-type-compatibility.test.ts`
- `src/features/accounts/utils/normalize-account-form-values.ts`
- `src/lib/db/seeds/initial-seed-data.ts`
- `src/lib/db/seeds/seed-initial-database.ts`
