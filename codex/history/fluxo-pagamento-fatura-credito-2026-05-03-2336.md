# Fluxo simples de pagamento de fatura de credito

## Contexto

Foi solicitada a garantia do fluxo simples de pagamento de fatura de credito sem criar entidade Invoice/Fatura, sem alterar dados existentes e mantendo o pagamento como uma transacao de despesa em conta debito.

## Decisao

O fluxo existente com `paymentForCreditAccountId` ja validava as regras principais no service de relacoes da transacao: a origem precisa ser conta nao credito, a conta associada precisa ser credito e o pagamento precisa ser `expense`.

Foram adicionados testes para cobrir a criacao do pagamento via service e o efeito do pagamento no saldo disponivel quando sai de conta debito.

## Impacto

O pagamento de fatura continua sendo uma `transaction` comum do tipo `expense`, com `accountId` apontando para a conta debito de origem e `paymentForCreditAccountId` apontando para a conta de credito paga. O pagamento reduz o saldo disponivel por sair da conta debito, enquanto pagamentos feitos a partir de conta credito e associacoes com conta nao credito seguem bloqueados.

Foram executados:

- `npm run test -- src/features/transactions/services/create-transaction-service.test.ts src/features/transactions/services/assert-transaction-relations-service.test.ts src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
- `npm run typecheck`
- `npm run test`
- `npm run lint`

## Arquivos criados

- `codex/history/fluxo-pagamento-fatura-credito-2026-05-03-2336.md`

## Arquivos alterados

- `src/features/transactions/services/create-transaction-service.test.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
