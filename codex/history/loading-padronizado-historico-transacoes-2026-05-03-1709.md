# Loading padronizado no historico de transacoes

## Contexto

O historico de transacoes usava uma tela de carregamento grande com skeletons, visualmente pesada para um estado temporario.
A tarefa pediu um loading compartilhado, discreto, com animacao e label opcional.

## Decisao

Foi criado o componente compartilhado `LoadingSpinner` em `src/components/ui/loading-spinner.tsx`.
O componente usa Tailwind, `LoaderCircle` com `animate-spin`, suporta dark mode via tokens existentes e aceita label opcional.

O loading da rota `/transactions` passou a usar o componente em um bloco pequeno da pagina, sem modal e sem bloquear a tela inteira.

## Impacto

O historico passa a usar um estado de carregamento mais simples e reutilizavel.
O componente pode ser usado por outras telas com ou sem label.

## Arquivos criados

- `src/components/ui/loading-spinner.tsx`
- `src/components/ui/loading-spinner.test.tsx`
- `src/app/transactions/loading.test.tsx`
- `codex/history/loading-padronizado-historico-transacoes-2026-05-03-1709.md`

## Arquivos alterados

- `src/app/transactions/loading.tsx`
