# Categorias de gastos familiares separadas por débito e crédito

## Contexto

O service da tela `/family` precisava retornar gastos por categoria em blocos separados de débito e crédito, mantendo crédito fora das saídas principais e disponível apenas como dado visual.

## Decisão

O resumo de cada membro passou a expor `expenseCategoryBreakdown`, com `debit` e `credit` contendo `totalExpenses` e `expensesByCategory`. Cada categoria carrega valor e percentual calculado com base no total do próprio grupo, evitando divisão por zero e usando `Sem categoria` como fallback seguro.

## Impacto

A UI familiar agora usa o novo contrato separado para renderizar gráficos de categoria de débito e crédito por membro. Receitas não entram nos agrupamentos e gastos de crédito seguem fora do cálculo principal de saída.

## Arquivos criados

- `codex/history/family-categorias-debito-credito-separadas-2026-05-04-0848.md`

## Arquivos alterados

- `src/features/families/components/family-category-expense-charts.tsx`
- `src/features/families/components/family-page.test.tsx`
- `src/features/families/services/get-family-financial-summary-service.ts`
- `src/features/families/services/get-family-financial-summary-service.test.ts`
- `src/features/families/types/family-financial-summary.ts`
