# Feature Categories - 2026-04-15 14:44

## Contexto

O projeto já possuía a modelagem inicial de `Category`, mas ainda não havia uma feature operacional para listar, criar, editar e ativar/desativar categorias financeiras.

## Decisão

A feature foi implementada em `src/features/categories` com separação por:

- `actions`
- `components`
- `schemas`
- `services`
- `repositories`
- `types`
- `utils`

O fluxo usa:

- Server Actions para mutações
- React Hook Form com Zod para o formulário
- repositories Mongoose para persistência
- filtro simples por tipo via query string
- listagem agrupada por tipo

## Impacto

- a aplicação agora possui gerenciamento completo de categorias
- categorias inativas seguem preservadas, mas podem ser excluídas dos fluxos operacionais por padrão
- a base ficou pronta para futuros formulários de transação consumirem apenas categorias ativas
- a duplicidade exata de nome dentro do mesmo tipo passou a ser evitada com checagem de serviço e índice único composto

## Regras importantes implementadas

- nome obrigatório e não vazio
- tipo obrigatório entre `income`, `expense` e `transfer`
- categorias inativas podem ser reativadas sem perda de histórico
- listagem agrupada por tipo com filtro simples
- duplicidade de nome no mesmo tipo é bloqueada

## Arquivos criados

- `src/features/categories/actions/create-category-action.ts`
- `src/features/categories/actions/toggle-category-status-action.ts`
- `src/features/categories/actions/update-category-action.ts`
- `src/features/categories/components/categories-list.tsx`
- `src/features/categories/components/categories-page.tsx`
- `src/features/categories/components/category-form.tsx`
- `src/features/categories/components/category-status-toggle-button.tsx`
- `src/features/categories/components/category-type-filter.tsx`
- `src/features/categories/services/category-errors.ts`
- `src/features/categories/services/create-category-service.ts`
- `src/features/categories/services/get-category-for-editing-service.ts`
- `src/features/categories/services/list-categories-for-management-service.ts`
- `src/features/categories/services/list-operational-categories-service.ts`
- `src/features/categories/services/toggle-category-status-service.ts`
- `src/features/categories/services/update-category-service.ts`
- `src/features/categories/utils/category-formatters.ts`
- `src/features/categories/utils/group-categories-by-type.ts`
- `src/features/categories/utils/normalize-category-form-values.ts`
- `src/app/categories/page.tsx`
- `codex/history/feature-categories-2026-04-15-1444.md`

## Arquivos alterados

- `src/features/categories/types/category.ts`
- `src/features/categories/schemas/category-schema.ts`
- `src/features/categories/repositories/category-repository.ts`
- `src/lib/db/models/category-model.ts`
- `src/components/layout/app-header.tsx`
