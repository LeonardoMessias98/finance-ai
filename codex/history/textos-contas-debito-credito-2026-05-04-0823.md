# Textos Contas Debito Credito

## Contexto

A tela de contas precisava refletir melhor a regra atual de debito e credito sem alterar tipos antigos no banco. A listagem deve mostrar saldo atual, enquanto o formulario deve manter saldo inicial apenas para contas de debito.

## Decisao

Os labels de tipos legados foram normalizados na exibicao: `checking`, `savings`, `cash` e `investment` aparecem como Debito; `credit_card` aparece como Credito. O campo Saldo inicial foi removido visualmente do formulario quando o tipo selecionado e Credito.

## Impacto

Novas contas continuam sendo criadas apenas como Debito ou Credito, sem migrar dados antigos. A UI comunica a regra atual de forma mais direta e preserva `initialBalance` internamente para contas de debito.

## Arquivos criados

- `codex/history/textos-contas-debito-credito-2026-05-04-0823.md`

## Arquivos alterados

- `src/features/accounts/components/account-form.tsx`
- `src/features/accounts/components/account-form.test.tsx`
- `src/features/accounts/components/accounts-list.test.tsx`
- `src/features/accounts/utils/account-formatters.ts`
