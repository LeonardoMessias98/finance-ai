# Historico separado por debito e credito

## Contexto

A tela de historico de transacoes precisava separar visualmente os lancamentos do mes entre contas de debito e contas de credito, sem alterar registros existentes, criar migration ou mudar regras de saldo.

## Decisao

O agrupamento foi implementado apenas na camada de UI do historico, usando o helper centralizado `isCreditAccount` para classificar contas `credit` e `credit_card` como credito. Qualquer outro tipo, incluindo tipos legados, permanece no grupo Debito.

## Impacto

O historico passa a renderizar os grupos Debito e Credito com total por grupo e a lista de transacoes correspondente. O agrupamento por data foi preservado dentro de cada grupo, mantendo a leitura por dia e deixando gastos de credito visiveis mesmo sem afetar o saldo disponivel.

Foram executados:

- `npm run test -- src/features/transactions/components/transactions-list.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `npm run test`

## Arquivos criados

- `codex/history/historico-separar-debito-credito-2026-05-03-1803.md`

## Arquivos alterados

- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transactions-list.test.tsx`
