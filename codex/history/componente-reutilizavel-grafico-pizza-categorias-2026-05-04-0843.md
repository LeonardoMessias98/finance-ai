# Componente reutilizável de gráfico de pizza por categoria

## Contexto

O gráfico de gastos por categoria da visão familiar precisava ser extraído para um componente reutilizável, sem adicionar dependências de gráficos ao projeto.

## Decisão

Foi criado `CategoryExpensePieChart` em `src/components/ui`, usando uma solução simples com `conic-gradient`, Tailwind e os tokens visuais existentes. O componente recebe título, dados, mensagem vazia e descrição opcional, renderizando gráfico, legenda, valores formatados e percentuais.

## Impacto

A tela `/family` passou a reutilizar o componente compartilhado e manteve a informação secundária de débito/crédito por categoria. O componente lida com estado vazio e pode ser usado por outras telas que precisem exibir despesas por categoria.

## Arquivos criados

- `src/components/ui/category-expense-pie-chart.tsx`
- `src/components/ui/category-expense-pie-chart.test.tsx`
- `codex/history/componente-reutilizavel-grafico-pizza-categorias-2026-05-04-0843.md`

## Arquivos alterados

- `src/features/families/components/family-category-expense-charts.tsx`
- `src/features/families/components/family-page.test.tsx`
