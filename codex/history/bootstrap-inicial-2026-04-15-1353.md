# Bootstrap Inicial - 2026-04-15 13:53

## Contexto

O projeto já tinha uma fundação funcional, mas mais avançada do que o desejado para um bootstrap inicial. Era necessário reduzir a base para um starter enxuto, incluir stack de testes e padronizar a documentação para colaboração por IA.

## Decisão

Foi adotada uma abordagem de bootstrap simples:

- dashboard inicial vazio, sem regra de negócio financeira implementada
- conexão MongoDB central em `src/lib/mongoose.ts`, com cache explícito para ambiente Next.js
- layout compartilhado reutilizável em `src/components/layout`
- stack de testes configurada com Vitest, Testing Library e Playwright
- contexts e templates renomeados para arquivos canônicos e mais fáceis de consumir por agentes

## Impacto

- a base ficou pronta para evolução incremental sem remover funcionalidades depois
- o projeto passou a ter setup de testes desde o início
- a documentação ficou mais objetiva para onboarding de outros agentes
- a separação entre UI, infraestrutura e futuras regras de negócio permaneceu clara
- a feature `transactions` de exemplo foi removida para manter o bootstrap realmente inicial

## Arquivos criados

- `src/components/layout/app-header.tsx`
- `src/components/layout/app-shell.tsx`
- `src/components/layout/app-header.test.tsx`
- `src/hooks/.gitkeep`
- `src/types/.gitkeep`
- `codex/contexts/product-overview.md`
- `codex/contexts/business-rules.md`
- `codex/contexts/architecture-rules.md`
- `codex/contexts/code-conventions.md`
- `codex/contexts/prompting-guidelines.md`
- `codex/templates/history-template.md`
- `codex/templates/adr-template.md`
- `vitest.config.ts`
- `vitest.setup.ts`
- `playwright.config.ts`
- `tests/e2e/dashboard.spec.ts`
- `codex/history/bootstrap-inicial-2026-04-15-1353.md`

## Arquivos alterados

- `package.json`
- `package-lock.json`
- `.gitignore`
- `.env.example`
- `AGENTS.md`
- `README.md`
- `eslint.config.mjs`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/features/dashboard/components/dashboard-page.tsx`
- `src/lib/env.ts`
- `src/lib/mongoose.ts`
- `codex/prompts/task-checklist.md`

## Arquivos removidos

- `src/features/transactions/actions/create-transaction-action.ts`
- `src/features/transactions/components/create-transaction-form.tsx`
- `src/features/transactions/components/transaction-list.tsx`
- `src/features/transactions/components/transaction-summary-card.tsx`
- `src/features/transactions/repositories/transaction-model.ts`
- `src/features/transactions/repositories/transaction-repository.ts`
- `src/features/transactions/schemas/create-transaction-schema.ts`
- `src/features/transactions/services/create-transaction-service.ts`
- `src/features/transactions/services/get-transaction-overview-service.ts`
- `src/features/transactions/types/transaction.ts`
- `src/features/transactions/utils/normalize-create-transaction-input.ts`
- `src/features/transactions/utils/transaction-formatters.ts`
- `src/hooks/use-action-feedback.ts`
- `src/types/action-result.ts`
- `codex/contexts/01-product.md`
- `codex/contexts/02-architecture.md`
- `codex/contexts/03-workflow.md`
- `codex/templates/history-entry-template.md`
