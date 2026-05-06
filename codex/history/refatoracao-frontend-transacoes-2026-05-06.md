# Refatoracao Frontend Transacoes

## Contexto

Alguns componentes criticos do frontend estavam acumulando composicao, helpers, tipos e classes no mesmo arquivo. O caso mais relevante era `transactions-list.tsx`, acima de 300 linhas, seguido por `transactions-page.tsx`.

## Decisão

Foi feita uma refatoracao focada na tela de historico de transacoes. A lista foi quebrada em componentes menores e recebeu arquivos separados para types, helpers e styles. A pagina de transacoes passou a delegar o resumo mensal e as acoes do header para componentes proprios.

## Impacto

Os arquivos principais de frontend do escopo ficaram abaixo de 150 linhas, sem alterar regra de negocio, dados existentes ou a API publica dos componentes. Os testes existentes de lista e pagina continuam cobrindo o comportamento renderizado.

## Arquivos criados

- `src/features/transactions/components/transaction-card.tsx`
- `src/features/transactions/components/transaction-date-groups.tsx`
- `src/features/transactions/components/transactions-list.helpers.ts`
- `src/features/transactions/components/transactions-list.styles.ts`
- `src/features/transactions/components/transactions-list.types.ts`
- `src/features/transactions/components/transactions-monthly-summary.tsx`
- `src/features/transactions/components/transactions-page-header-actions.tsx`
- `src/features/transactions/components/transactions-page.helpers.ts`
- `src/features/transactions/components/transactions-page.types.ts`
- `codex/history/refatoracao-frontend-transacoes-2026-05-06.md`

## Arquivos alterados

- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transactions-page.tsx`
