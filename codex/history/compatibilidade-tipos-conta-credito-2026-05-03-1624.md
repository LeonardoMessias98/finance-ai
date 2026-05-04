# Compatibilidade de tipos de conta de credito

## Contexto

Existem contas persistidas com tipos antigos como `checking`, `savings`, `cash`, `investment` e `credit_card`.
A regra de negocio passa a depender apenas da classificacao entre contas de credito e contas nao credito, sem alterar registros existentes, criar migration ou limpar dados antigos.

## Decisao

Foi criada uma camada reutilizavel de compatibilidade em `accounts/utils` para classificar `credit` e `credit_card` como credito.
Todo outro valor e tratado como debito/nao credito para manter tipos antigos e eventuais valores legados funcionando sem quebra.

O tipo `credit` tambem foi adicionado aos valores aceitos de conta, preservando `credit_card` para compatibilidade com dados ja salvos.

## Impacto

A regra de identificacao de contas de credito fica centralizada em helpers pequenos e testados.
Registros antigos continuam validos e nao exigem alteracao no banco.
Novas entradas podem usar `credit`, enquanto `credit_card` segue reconhecido como credito.

## Arquivos criados

- `src/features/accounts/utils/account-type-compatibility.ts`
- `src/features/accounts/utils/account-type-compatibility.test.ts`
- `codex/history/compatibilidade-tipos-conta-credito-2026-05-03-1624.md`

## Arquivos alterados

- `src/features/accounts/types/account.ts`
- `src/features/accounts/utils/account-formatters.ts`
