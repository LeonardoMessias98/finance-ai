# Competência mensal nas transações - 2026-04-17 11:00

## Contexto

As transações já possuíam `competencyMonth`, mas o comportamento ainda era parcial: o dashboard fixava o mês atual, a listagem de transações aceitava competência opcional e a lógica de mês estava duplicada em mais de um ponto.

## Decisão

Foi centralizada a lógica de competência mensal em `src/lib/dates/competency-month.ts`, cobrindo validação de formato, mês atual do projeto, derivação a partir de `Date` e derivação a partir de `date` do formulário.

Também foram aplicadas mudanças de comportamento:

- transações passam a abrir e listar sempre dentro de uma competência selecionada
- o formulário deriva `competencyMonth` de `date` por padrão, mantendo ajuste manual quando necessário
- o dashboard passou a aceitar mês via query string e a resumir apenas a competência selecionada
- ações de transação agora revalidam dashboard e orçamento, além da listagem

## Impacto

- a competência mensal virou eixo explícito de navegação e resumo
- dashboard, resumo financeiro e orçamento passaram a operar com mês selecionado
- a listagem de transações fica previsível por competência, inclusive no estado inicial sem filtros extras
- a base reduz duplicação de regex e helpers de data

## Arquivos criados

- `src/lib/dates/competency-month.ts`
- `src/lib/dates/competency-month.test.ts`
- `src/features/dashboard/components/dashboard-month-filter.tsx`
- `codex/history/competencia-mensal-transacoes-2026-04-17-1100.md`

## Arquivos alterados

- `src/app/page.tsx`
- `src/app/transactions/page.tsx`
- `src/app/budgets/page.tsx`
- `src/features/dashboard/components/dashboard-page.tsx`
- `src/features/dashboard/components/dashboard-summary-cards.tsx`
- `src/features/dashboard/components/dashboard-account-balances.tsx`
- `src/features/dashboard/components/dashboard-latest-transactions.tsx`
- `src/features/dashboard/services/get-dashboard-financial-summary-service.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
- `src/features/dashboard/utils/get-current-competency-month.ts`
- `src/features/transactions/components/transaction-form.tsx`
- `src/features/transactions/components/transactions-page.tsx`
- `src/features/transactions/components/transactions-filters.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/actions/create-transaction-action.ts`
- `src/features/transactions/actions/update-transaction-action.ts`
- `src/features/transactions/actions/delete-transaction-action.ts`
- `src/features/transactions/schemas/transaction-schema.ts`
- `src/features/transactions/utils/build-installment-transactions.ts`
- `src/features/budgets/components/budgets-page.tsx`
- `src/features/budgets/schemas/budget-schema.ts`
- `src/features/budgets/utils/get-current-competency-month.ts`
