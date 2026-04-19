# Contexto

A home do `finance-ai` já mostrava saldo, resumo do mês e transações recentes, mas ainda faltava uma leitura visual do comportamento financeiro ao longo do tempo. A tarefa pediu uma nova seção abaixo de `Recentes`, com foco em gasto mensal, concentração por categoria, evolução histórica e uma previsão simples dos próximos meses.

## Decisão

Mantive a solução dentro da feature `dashboard`, sem criar uma feature paralela de analytics. O builder atual do resumo passou a compor um bloco `analytics` com dados preparados no servidor, usando um utilitário dedicado para histórico, categorias e previsão.

Para evitar dependência extra de biblioteca de gráficos, implementei gráficos leves com SVG server-side. A previsão usa uma heurística simples e explícita no código: média aritmética dos últimos até 3 meses com movimentação aplicada.

## Impacto

A tela inicial ganhou uma seção visual nova logo abaixo de `Recentes`, com:

- card de gasto do mês
- barras por categoria de despesa
- linha de entradas e saídas dos últimos meses
- linha tracejada com previsão simples para os próximos meses

O cálculo ficou centralizado em helpers pequenos e reutilizáveis, preservando a separação entre UI e agregação de dados. A home agora também usa o histórico completo do usuário no servidor para montar essas leituras sem empurrar lógica para o componente da página.

## Arquivos criados

- `src/features/dashboard/components/dashboard-analytics-section.tsx`
- `src/features/dashboard/components/dashboard-line-chart.tsx`
- `src/features/dashboard/components/expense-by-category-chart.tsx`
- `src/features/dashboard/components/forecast-chart.tsx`
- `src/features/dashboard/components/monthly-balance-line-chart.tsx`
- `src/features/dashboard/components/monthly-expense-card.tsx`
- `src/features/dashboard/types/dashboard-analytics.ts`
- `src/features/dashboard/utils/build-dashboard-analytics.test.ts`
- `src/features/dashboard/utils/build-dashboard-analytics.ts`

## Arquivos alterados

- `src/features/dashboard/components/dashboard-page.tsx`
- `src/features/dashboard/services/get-dashboard-financial-summary-service.ts`
- `src/features/dashboard/types/dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.ts`
