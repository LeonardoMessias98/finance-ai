# Componente MonthScroller

## Contexto

A home passou a usar uma lista horizontal de meses. Para evitar duplicacao de layout e comportamento em futuras telas, a navegacao mensal precisava virar um componente reutilizavel.

## Decisão

Foi criado o componente client `MonthScroller`, com tipos, helpers e estilos separados. O componente recebe meses no formato `{ value, label, hasData? }`, destaca o mes selecionado com `aria-current`, usa scroll horizontal e dispara `onSelectMonth` ao clicar.

## Impacto

O dashboard passou a usar `MonthScroller` e manteve a navegacao por `competencyMonth` via search params. O componente tambem oferece indicador visual opcional para meses com dados.

## Arquivos criados

- `src/components/navigation/MonthScroller.tsx`
- `src/components/navigation/MonthScroller.types.ts`
- `src/components/navigation/MonthScroller.helpers.ts`
- `src/components/navigation/MonthScroller.styles.ts`
- `src/components/navigation/MonthScroller.test.tsx`
- `codex/history/componente-month-scroller-2026-05-06.md`

## Arquivos alterados

- `src/features/dashboard/components/dashboard-month-filter.tsx`
- `src/features/dashboard/components/dashboard-month-filter.test.tsx`
