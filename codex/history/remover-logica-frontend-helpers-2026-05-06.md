# Remover logica de dominio dos componentes frontend

## Contexto

A revisao buscou reduzir calculos financeiros e regras de agrupamento dentro de componentes React, mantendo o frontend mais focado em renderizar dados preparados.

## Decisao

Foram criados helpers especificos para:

- totalizar valores de credito no resumo do dashboard;
- agrupar transacoes recentes por debito e credito com compatibilidade para `credit_card`;
- calcular o resultado medio projetado do grafico de previsao;
- preparar a comparacao visual de gasto mensal;
- calcular dados auxiliares do grafico de pizza de categorias.

## Impacto

Os componentes principais do dashboard e o grafico compartilhado ficaram sem `reduce` ou regras de tipo de conta diretamente no `.tsx`. A regra visual final foi preservada e os helpers receberam testes unitarios.

## Arquivos criados

- `src/components/ui/category-expense-pie-chart.helpers.ts`
- `src/components/ui/category-expense-pie-chart.helpers.test.ts`
- `src/components/ui/category-expense-pie-chart.types.ts`
- `src/features/dashboard/components/dashboard-latest-transactions.helpers.ts`
- `src/features/dashboard/components/dashboard-latest-transactions.helpers.test.ts`
- `src/features/dashboard/components/dashboard-summary-cards.helpers.ts`
- `src/features/dashboard/components/dashboard-summary-cards.helpers.test.ts`
- `src/features/dashboard/components/forecast-chart.helpers.ts`
- `src/features/dashboard/components/forecast-chart.helpers.test.ts`
- `src/features/dashboard/components/monthly-expense-card.helpers.ts`
- `src/features/dashboard/components/monthly-expense-card.helpers.test.ts`

## Arquivos alterados

- `src/components/ui/category-expense-pie-chart.tsx`
- `src/features/dashboard/components/dashboard-latest-transactions.tsx`
- `src/features/dashboard/components/dashboard-summary-cards.tsx`
- `src/features/dashboard/components/forecast-chart.tsx`
- `src/features/dashboard/components/monthly-expense-card.tsx`
