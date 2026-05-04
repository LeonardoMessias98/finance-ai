# Grupo de credito colapsavel no historico

## Contexto

O historico de transacoes ja separava os lancamentos do mes entre Debito e Credito. Foi solicitado que o grupo Credito exibisse sempre o total, mas mantivesse a lista de transacoes expandivel e colapsavel para reduzir ruido visual.

## Decisao

Foi criado um componente client pequeno e isolado para controlar apenas o estado local do grupo Credito. O botao do cabecalho usa `aria-expanded`, preserva o total visivel e alterna a exibicao da lista sem alterar dados, schemas ou regras de criacao de transacao.

## Impacto

O grupo Credito inicia colapsado, mantendo o total gasto visivel. Ao clicar no cabecalho, as transacoes de credito aparecem; ao clicar novamente, a lista e ocultada. O grupo Debito permanece expandido como antes e o layout mobile segue usando blocos fluidos.

Foram executados:

- `npm run test -- src/features/transactions/components/transactions-list.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `npm run test`

## Arquivos criados

- `src/features/transactions/components/transactions-credit-group.tsx`
- `codex/history/historico-credito-colapsavel-2026-05-03-1805.md`

## Arquivos alterados

- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transactions-list.test.tsx`
