# Gráfico de gastos por categoria na visão familiar

## Contexto

A tela `/family` precisava mostrar, no final da página, em quais categorias cada membro da família mais gastou no mês selecionado, sem acessar banco pela UI e sem ampliar o escopo para novas entidades.

## Decisão

O resumo familiar passou a carregar `expenseCategories` por membro, com totais de débito e crédito separados por categoria. A tela renderiza um card por membro com gráfico de pizza e lista resumida das categorias, mantendo a busca de dados no fluxo service -> repository e respeitando apenas membros com permissão de visualização.

## Impacto

Usuários da visão familiar conseguem comparar a concentração de gastos por categoria por membro. O gráfico considera apenas transações `expense`; receitas são ignoradas, e membros sem gastos exibem estado vazio.

## Arquivos criados

- `src/features/families/components/family-category-expense-charts.tsx`
- `codex/history/family-grafico-gastos-categoria-por-membro-2026-05-04-0841.md`

## Arquivos alterados

- `src/features/families/components/family-page.tsx`
- `src/features/families/components/family-page.test.tsx`
- `src/features/families/services/get-family-financial-summary-service.ts`
- `src/features/families/services/get-family-financial-summary-service.test.ts`
- `src/features/families/types/family-financial-summary.ts`
