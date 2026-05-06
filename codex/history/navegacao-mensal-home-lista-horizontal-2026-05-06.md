# Navegacao Mensal Home Lista Horizontal

## Contexto

A tela inicial usava controles de mes com anterior, atual, proximo e campo de selecao. Esse fluxo funcionava, mas deixava a experiencia mais poluida em telas pequenas.

## Decisão

A navegacao mensal da home foi substituida por uma lista horizontal com scroll. A lista destaca a competencia ativa e cada mes aponta para a mesma rota com `competencyMonth` em search params. Os meses exibidos sao montados a partir de movimentacoes e meses de fatura (`creditPaymentMonth`), com fallback de meses ao redor da competencia selecionada quando nao ha dados.

## Impacto

A home fica mais compacta no mobile sem alterar dados existentes ou quebrar o padrao de competencia mensal. O dashboard continua usando o mesmo resumo financeiro, agora com `monthNavigationMonths` para orientar a navegacao visual.

## Arquivos criados

- `src/features/dashboard/components/dashboard-month-filter.test.tsx`
- `src/features/dashboard/utils/dashboard-month-navigation.ts`
- `src/features/dashboard/utils/dashboard-month-navigation.test.ts`
- `codex/history/navegacao-mensal-home-lista-horizontal-2026-05-06.md`

## Arquivos alterados

- `src/features/dashboard/components/dashboard-page.tsx`
- `src/features/dashboard/components/dashboard-month-filter.tsx`
- `src/features/dashboard/components/dashboard-summary-cards.test.tsx`
- `src/features/dashboard/types/dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.ts`
