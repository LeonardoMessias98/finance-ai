# Feature Budgets

## Contexto

Implementar a feature de orçamentos mensais por categoria para que o usuário defina limites de gasto e acompanhe o consumo por competência.

## Decisão

A feature seguiu o padrão existente do projeto, com `actions`, `services`, `repositories`, `schemas`, `types`, `utils` e componentes enxutos. O cálculo de consumo ficou isolado em utilitários, usando apenas despesas pagas da competência selecionada para evitar regra financeira espalhada na UI.

## Impacto

O app agora permite criar, listar e editar orçamentos mensais por categoria de despesa, com unicidade por `categoryId + competencyMonth`, progresso de consumo, valor gasto, valor limite, valor restante e alertas visuais a partir de 80% e 100%.

## Arquivos criados

- `src/features/budgets/actions/create-budget-action.ts`
- `src/features/budgets/actions/update-budget-action.ts`
- `src/features/budgets/components/budget-form.tsx`
- `src/features/budgets/components/budgets-list.tsx`
- `src/features/budgets/components/budgets-month-filter.tsx`
- `src/features/budgets/components/budgets-page.tsx`
- `src/features/budgets/services/budget-errors.ts`
- `src/features/budgets/services/create-budget-service.ts`
- `src/features/budgets/services/get-budget-for-editing-service.ts`
- `src/features/budgets/services/list-budgets-for-management-service.ts`
- `src/features/budgets/services/update-budget-service.ts`
- `src/features/budgets/utils/budget-consumption.ts`
- `src/features/budgets/utils/budget-consumption.test.ts`
- `src/features/budgets/utils/build-budgets-href.ts`
- `src/features/budgets/utils/get-current-competency-month.ts`
- `src/features/budgets/utils/normalize-budget-form-values.ts`
- `src/app/budgets/page.tsx`
- `codex/history/feature-budgets-2026-04-15-1530.md`

## Arquivos alterados

- `src/features/budgets/types/budget.ts`
- `src/features/budgets/schemas/budget-schema.ts`
- `src/features/budgets/repositories/budget-repository.ts`
- `src/components/layout/app-header.tsx`
