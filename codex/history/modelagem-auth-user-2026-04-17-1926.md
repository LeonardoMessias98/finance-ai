# Modelagem Auth User

## Contexto

O projeto ja tinha autenticacao em andamento, mas a modelagem de `User` e `RefreshToken` ainda precisava ser fechada com um contrato mais explicito para campos, tipos, schemas, repositories e indices.

## Decisão

Foi mantido o padrao camelCase do projeto para `userId` no codigo e no MongoDB, em vez de introduzir `user_id` apenas nesta feature. A modelagem de `RefreshToken` foi expandida para incluir metadados de sessao (`ip`, `location`, `userAgent`, `updatedAt`), e os tipos de entidade foram centralizados em um arquivo proprio da feature.

## Impacto

`User` agora aceita `lastLoginIp` como campo opcional de modelagem e segue com indice unico por email. `RefreshToken` passa a registrar metadados completos do acesso, manter TTL por `expiresAt`, expor tipo e schema proprios e permitir revogacao rastreavel por usuario e sessao. Os repositories passam a validar input com Zod antes de persistir.

## Arquivos criados

- `codex/history/modelagem-auth-user-2026-04-17-1926.md`
- `src/features/auth/schemas/refresh-token-schema.ts`
- `src/features/auth/schemas/refresh-token-schema.test.ts`
- `src/features/auth/schemas/user-schema.test.ts`
- `src/features/auth/types/entities.ts`

## Arquivos alterados

- `src/features/auth/repositories/refresh-token-repository.ts`
- `src/features/auth/repositories/user-repository.ts`
- `src/features/auth/schemas/user-schema.ts`
- `src/features/auth/services/login-service.ts`
- `src/lib/auth/request-context.ts`
- `src/lib/auth/session-cookies.ts`
- `src/lib/db/models/refresh-token-model.ts`
- `src/lib/db/models/user-model.ts`
