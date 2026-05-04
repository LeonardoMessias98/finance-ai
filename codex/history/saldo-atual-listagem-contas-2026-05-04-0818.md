# Saldo Atual Listagem Contas

## Contexto

A listagem de contas mostrava o campo interno `initialBalance` com o rotulo "Saldo inicial". A necessidade era exibir o valor atual de cada conta sem alterar registros existentes nem renomear o campo persistido.

## Decisao

Foi criado um calculo de exibicao para enriquecer contas com `currentBalance`. Para contas debito e legadas nao credito, o saldo atual considera saldo inicial, receitas recebidas e despesas pagas. Para contas `credit` e `credit_card`, o saldo atual representa a divida como valor negativo, descontando pagamentos associados quando existirem.

## Impacto

A tela de contas passa a mostrar "Saldo atual" e deixa de exibir "Saldo inicial" na listagem. O campo `initialBalance` continua existindo internamente para contas debito e nenhuma alteracao de banco ou migracao foi criada.

## Arquivos criados

- `src/features/accounts/services/list-accounts-with-current-balances-service.ts`
- `src/features/accounts/utils/build-account-current-balances.ts`
- `src/features/accounts/utils/build-account-current-balances.test.ts`
- `src/features/accounts/components/accounts-list.test.tsx`
- `codex/history/saldo-atual-listagem-contas-2026-05-04-0818.md`

## Arquivos alterados

- `src/features/accounts/types/account.ts`
- `src/features/accounts/components/accounts-page.tsx`
- `src/features/accounts/components/accounts-list.tsx`
