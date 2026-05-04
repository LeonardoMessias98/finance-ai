# Revisao Saldos Conta Home Credito

## Contexto

Foi revisada a consistencia entre saldo individual da tela de contas e saldo disponivel da home. A regra principal e permitir divida de credito como visualizacao por conta, sem reduzir diretamente o saldo disponivel.

## Decisao

Os calculos existentes foram mantidos: a tela de contas usa `currentBalance` calculado por conta, com credito negativo; a home segue calculando saldo disponivel apenas com contas debito/nao credito. Foi adicionado teste explicito garantindo que despesa em credito nao reduz saldo disponivel nem entra em saidas do mes.

## Impacto

A cobertura agora protege os cenarios principais: saldo individual de debito, divida individual de credito, pagamento de fatura por debito reduzindo saldo disponivel e compra no credito nao afetando saldo principal.

## Arquivos criados

- `codex/history/revisao-saldos-conta-home-credito-2026-05-04-0819.md`

## Arquivos alterados

- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
