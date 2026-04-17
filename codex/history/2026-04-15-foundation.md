# Foundation Setup - 2026-04-15

## Contexto

O diretório inicial estava vazio. Foi necessário criar a fundação completa do projeto respeitando a stack obrigatória, a arquitetura por feature e as regras de separação entre UI, regra de negócio e acesso ao banco.

## Decisão

Foi criada uma aplicação Next.js com App Router e TypeScript, usando Tailwind CSS e componentes no padrão shadcn/ui. A primeira feature implementada foi `transactions`, porque ela estabelece um fluxo real e reutilizável de ponta a ponta:

- formulário com React Hook Form e Zod
- mutação com Server Action
- regra de negócio em `services`
- persistência em MongoDB Atlas via Mongoose
- dashboard server-side como composição de leitura

Também foram criados `AGENTS.md`, contextos em `codex/contexts`, checklist em `codex/prompts` e template em `codex/templates` para facilitar continuidade por outros agentes.

## Impacto

- existe uma base full stack pronta para expansão incremental
- a separação por camadas ficou explícita desde o primeiro fluxo
- o projeto já possui documentação operacional para agentes de IA
- a UI inicial já comunica o posicionamento do produto sem depender de backend separado
- o app lida de forma graciosa com ausência de configuração do MongoDB até que as variáveis sejam preenchidas

## Arquivos criados

- `package.json`
- `package-lock.json`
- `.gitignore`
- `.env.example`
- `next.config.ts`
- `tsconfig.json`
- `next-env.d.ts`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `components.json`
- `eslint.config.mjs`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/lib/utils.ts`
- `src/lib/env.ts`
- `src/lib/mongoose.ts`
- `src/types/action-result.ts`
- `src/hooks/use-action-feedback.ts`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/badge.tsx`
- `src/features/dashboard/components/dashboard-page.tsx`
- `src/features/transactions/types/transaction.ts`
- `src/features/transactions/schemas/create-transaction-schema.ts`
- `src/features/transactions/utils/normalize-create-transaction-input.ts`
- `src/features/transactions/utils/transaction-formatters.ts`
- `src/features/transactions/repositories/transaction-model.ts`
- `src/features/transactions/repositories/transaction-repository.ts`
- `src/features/transactions/services/create-transaction-service.ts`
- `src/features/transactions/services/get-transaction-overview-service.ts`
- `src/features/transactions/actions/create-transaction-action.ts`
- `src/features/transactions/components/create-transaction-form.tsx`
- `src/features/transactions/components/transaction-summary-card.tsx`
- `src/features/transactions/components/transaction-list.tsx`
- `README.md`
- `AGENTS.md`
- `codex/contexts/01-product.md`
- `codex/contexts/02-architecture.md`
- `codex/contexts/03-workflow.md`
- `codex/prompts/task-checklist.md`
- `codex/templates/history-entry-template.md`
- `codex/history/2026-04-15-foundation.md`

## Arquivos alterados

Nenhum. Todos os arquivos desta tarefa foram criados do zero.
