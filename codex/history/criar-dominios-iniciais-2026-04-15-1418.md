# Criar Domínios Iniciais - 2026-04-15 14:18

## Contexto

O projeto ainda não possuía modelagem persistente para os principais domínios financeiros. Era necessário criar a base inicial de entidades com tipagem, schemas, models Mongoose e repositories básicos, mantendo a organização por domínio e a conexão de banco centralizada.

## Decisão

Foram modelados os domínios `Account`, `Category`, `Transaction`, `Budget` e `Goal` com a seguinte separação:

- `src/features/<dominio>/types`
- `src/features/<dominio>/schemas`
- `src/features/<dominio>/repositories`
- `src/lib/db/models`

As validações de entrada ficaram em Zod, os models Mongoose receberam índices relevantes e o domínio `Transaction` ganhou regras adicionais para evitar inconsistências comuns entre transferências, categorias, contas de destino, status e parcelas.

## Impacto

- o projeto agora possui base persistente para os principais módulos financeiros
- a separação entre domínio e infraestrutura continua clara
- novas services e actions podem reutilizar repositories já tipados
- as regras principais de integridade já estão capturadas no nível de schema e model

## Arquivos criados

- `src/lib/db/object-id.ts`
- `src/features/accounts/types/account.ts`
- `src/features/accounts/schemas/account-schema.ts`
- `src/features/accounts/repositories/account-repository.ts`
- `src/features/categories/types/category.ts`
- `src/features/categories/schemas/category-schema.ts`
- `src/features/categories/repositories/category-repository.ts`
- `src/features/transactions/types/transaction.ts`
- `src/features/transactions/schemas/transaction-schema.ts`
- `src/features/transactions/repositories/transaction-repository.ts`
- `src/features/budgets/types/budget.ts`
- `src/features/budgets/schemas/budget-schema.ts`
- `src/features/budgets/repositories/budget-repository.ts`
- `src/features/goals/types/goal.ts`
- `src/features/goals/schemas/goal-schema.ts`
- `src/features/goals/repositories/goal-repository.ts`
- `src/lib/db/models/account-model.ts`
- `src/lib/db/models/category-model.ts`
- `src/lib/db/models/transaction-model.ts`
- `src/lib/db/models/budget-model.ts`
- `src/lib/db/models/goal-model.ts`
- `codex/history/criar-dominios-iniciais-2026-04-15-1418.md`

## Arquivos alterados

- nenhum
