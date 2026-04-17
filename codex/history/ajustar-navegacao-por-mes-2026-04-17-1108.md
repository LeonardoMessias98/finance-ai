# Ajustar navegação por mês - 2026-04-17 11:08

## Contexto

O projeto já armazenava `competencyMonth` nas transações e em orçamentos, mas a navegação mensal ainda dependia basicamente de um seletor manual de mês. Faltava tornar a competência o eixo principal da experiência financeira, com troca simples entre meses e comportamento consistente entre home, listagem de transações e orçamento.

## Decisão

Foi consolidada uma navegação mensal explícita com três frentes:

- novos helpers em `src/lib/dates/competency-month.ts` para deslocar competência, calcular data padrão do mês selecionado e manter a regra de derivação a partir de `date`
- um componente compartilhado de navegação mensal em `src/components/filters/competency-month-switcher.tsx`
- atualização dos filtros de dashboard, transações e orçamento para suportar `mês anterior`, `mês atual`, `próximo mês` e seleção manual da competência

Também foi ajustado o formulário de transações para iniciar novas transações já dentro do mês selecionado, preservando `competencyMonth` como derivação padrão de `date`.

## Impacto

- a aplicação passou a tratar competência mensal como eixo principal da navegação financeira
- home, transações e orçamento conseguem navegar mês a mês sem perder o contexto principal
- filtros secundários de transações podem ser limpos sem resetar a competência selecionada
- novas transações abertas fora do mês corrente nascem com data coerente ao mês em análise
- a base ganhou testes adicionais para deslocamento de competência e data padrão por competência

## Arquivos criados

- `src/components/filters/competency-month-switcher.tsx`
- `src/features/dashboard/utils/build-dashboard-href.ts`
- `codex/history/ajustar-navegacao-por-mes-2026-04-17-1108.md`

## Arquivos alterados

- `src/lib/dates/competency-month.ts`
- `src/lib/dates/competency-month.test.ts`
- `src/features/dashboard/components/dashboard-month-filter.tsx`
- `src/features/budgets/components/budgets-month-filter.tsx`
- `src/features/transactions/components/transactions-filters.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transaction-form.tsx`
- `src/features/transactions/utils/normalize-transaction-form-values.ts`
