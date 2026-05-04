# Entidade Family para visualizacao compartilhada

## Contexto

O projeto precisa representar familias para permitir visualizacao compartilhada sem alterar dados existentes e sem remover o isolamento por usuario.
Nesta etapa, familia nao concede edicao compartilhada sobre dados financeiros.

## Decisao

Foi criada a feature `families` com model, schemas, repository, services e actions.
A colecao `families` possui `name`, `ownerUserId`, `members`, `createdAt` e `updatedAt`.

Cada membro possui:

- `userId`
- `role` como `owner` ou `member`
- `canView`

O criador e persistido automaticamente como membro `owner` com `canView: true`.
A inclusao de membros exige que o usuario autenticado seja owner, que o usuario adicionado exista e que ainda nao participe da familia.
A leitura por familia usa filtro de participante com `canView: true`, preservando o isolamento por usuario.

## Impacto

A base passa a ter uma entidade simples de familia para visualizacao compartilhada futura.
Nao ha alteracao de dados financeiros existentes, migration ou mudanca no modelo atual de ownership por `userId`.

## Arquivos criados

- `src/features/families/types/family.ts`
- `src/features/families/schemas/family-schema.ts`
- `src/features/families/repositories/family-repository.ts`
- `src/features/families/repositories/family-repository.test.ts`
- `src/features/families/services/family-errors.ts`
- `src/features/families/services/create-family-service.ts`
- `src/features/families/services/add-family-member-service.ts`
- `src/features/families/services/get-family-for-view-service.ts`
- `src/features/families/services/family-services.test.ts`
- `src/features/families/actions/create-family-action.ts`
- `src/features/families/actions/add-family-member-action.ts`
- `src/lib/db/models/family-model.ts`
- `codex/history/entidade-family-visualizacao-compartilhada-2026-05-03-1704.md`

## Arquivos alterados

- Nenhum arquivo existente foi alterado para integrar familias a fluxos financeiros atuais.
