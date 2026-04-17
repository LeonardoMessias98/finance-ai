# Feature Accounts - 2026-04-15 14:42

## Contexto

O projeto já possuía a modelagem inicial de `Account`, mas ainda não havia uma feature completa para listar, criar, editar e ativar/desativar contas financeiras.

## Decisão

A feature foi implementada em `src/features/accounts` com separação por:

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
- desativação no lugar de exclusão física

## Impacto

- a aplicação agora possui a primeira feature CRUD operacional de domínio
- contas inativas continuam preservadas para referência histórica
- a listagem mostra status e permite edição e toggle de atividade
- a base ficou pronta para futuros selects operacionais usando apenas contas ativas

## Regras importantes implementadas

- nome obrigatório
- tipo obrigatório e válido
- saldo inicial aceita zero
- desativação substitui exclusão física nesta feature
- listagem operacional futura deve usar apenas contas ativas por padrão

## Arquivos criados

- `src/features/accounts/actions/create-account-action.ts`
- `src/features/accounts/actions/toggle-account-status-action.ts`
- `src/features/accounts/actions/update-account-action.ts`
- `src/features/accounts/components/account-form.tsx`
- `src/features/accounts/components/account-status-toggle-button.tsx`
- `src/features/accounts/components/accounts-list.tsx`
- `src/features/accounts/components/accounts-page.tsx`
- `src/features/accounts/services/create-account-service.ts`
- `src/features/accounts/services/get-account-for-editing-service.ts`
- `src/features/accounts/services/list-accounts-for-management-service.ts`
- `src/features/accounts/services/list-operational-accounts-service.ts`
- `src/features/accounts/services/toggle-account-status-service.ts`
- `src/features/accounts/services/update-account-service.ts`
- `src/features/accounts/utils/account-formatters.ts`
- `src/features/accounts/utils/normalize-account-form-values.ts`
- `src/components/ui/select.tsx`
- `src/app/accounts/page.tsx`
- `codex/history/feature-accounts-2026-04-15-1442.md`

## Arquivos alterados

- `src/features/accounts/types/account.ts`
- `src/features/accounts/schemas/account-schema.ts`
- `src/features/accounts/repositories/account-repository.ts`
- `src/components/layout/app-header.tsx`
