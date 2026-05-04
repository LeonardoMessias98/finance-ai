# Filtros do historico em modal

## Contexto

A tela de historico mantinha filtros fixos na sidebar em telas grandes e modal apenas no mobile.
A tarefa pediu uma experiencia unica com botao `Filtros`, modal responsivo, aplicacao e limpeza por search params.

## Decisao

A tela principal passou a exibir apenas o botao `Filtros`.
Quando existem filtros ativos de tipo, conta ou categoria, o botao mostra a contagem no formato `Filtros (N)`.

O modal existente foi mantido com o padrao visual do projeto e continua usando search params (`filters=open`).
A acao `Aplicar` continua usando formulario `GET` para `/transactions`.
A acao `Limpar` preserva apenas a competencia atual e remove os demais filtros.

## Impacto

O historico fica menos apertado e sem sidebar fixa.
O comportamento por URL foi preservado, incluindo abertura do modal e filtros aplicados por query string.

## Arquivos criados

- `src/features/transactions/components/transactions-page.test.tsx`
- `codex/history/filtros-historico-em-modal-2026-05-03-1713.md`

## Arquivos alterados

- `src/features/transactions/components/transactions-page.tsx`
- `src/features/transactions/components/transactions-filters.tsx`
