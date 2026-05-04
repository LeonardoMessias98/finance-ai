# Microcopy de regras de credito na UI

## Contexto

Foi solicitada melhoria visual e textual para deixar as regras de credito mais claras ao usuario, sem alterar regras de negocio e sem modificar registros existentes.

## Decisao

Foram adicionados textos curtos e discretos em pontos de uso:

- formulario de conta: contas de credito nao recebem entradas, comecam com saldo zero e so afetam saldo quando a fatura e paga
- formulario de transacao: contas de credito nao recebem entradas; compras no credito aparecem no mes da compra e a fatura fica para o mes seguinte
- historico: compras no credito aparecem no grupo Credito e so afetam saldo quando a fatura e paga
- resumo de credito: credito nao altera saldo disponivel ate o pagamento da fatura

## Impacto

A UI comunica melhor a diferenca entre gasto no credito e impacto no saldo disponivel, mantendo a linguagem curta e discreta. Nenhum schema, service, repository, model ou dado existente foi alterado.

Foram executados:

- `npm run test -- src/features/accounts/components/account-form.test.tsx src/features/transactions/components/transactions-list.test.tsx src/features/dashboard/components/dashboard-summary-cards.test.tsx`
- `npm run typecheck`
- `npm run test`
- `npm run lint`

## Arquivos criados

- `src/features/accounts/components/account-form.test.tsx`
- `src/features/dashboard/components/dashboard-summary-cards.test.tsx`
- `codex/history/microcopy-ui-credito-2026-05-03-2339.md`

## Arquivos alterados

- `src/features/accounts/components/account-form.tsx`
- `src/features/transactions/components/transaction-form.primary-fields.tsx`
- `src/features/transactions/components/transactions-credit-group.tsx`
- `src/features/transactions/components/transactions-list.test.tsx`
- `src/features/dashboard/components/dashboard-summary-cards.tsx`
