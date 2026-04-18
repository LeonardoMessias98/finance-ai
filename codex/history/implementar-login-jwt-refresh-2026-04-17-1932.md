# Implementar login JWT refresh

## Contexto

O projeto ja tinha a base de autenticacao montada, mas ainda faltava fechar o fluxo completo com interfaces explicitas para login, logout, refresh token e sessao atual, alem de alinhar a data de expiracao da sessao com o `exp` real do JWT.

## Decisão

Foram mantidas as Server Actions de login e logout para a UI, e adicionadas rotas HTTP explicitas em `src/app/api/auth` para completar o contrato de autenticacao. A leitura de sessao atual passou a ser derivada do `access token` validado, em vez de calcular `agora + 1h`, e as respostas para cliente passaram a serializar apenas os campos seguros da sessao.

## Impacto

O app agora oferece:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/session`

O login continua comparando o `passwordHash` SHA-256 recebido com o valor salvo no banco, gera `access token` JWT com 1 hora, persiste `refresh token`, registra `ip`, `location` e `userAgent` quando disponiveis, e invalida a sessao anterior do mesmo usuario. O refresh devolve sessao atualizada e a leitura da sessao atual passa a refletir a expiracao real do token.

## Arquivos criados

- `codex/history/implementar-login-jwt-refresh-2026-04-17-1932.md`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/session/route.ts`
- `src/features/auth/services/get-current-session-service.ts`
- `src/features/auth/utils/serialize-session.ts`
- `src/features/auth/utils/serialize-session.test.ts`

## Arquivos alterados

- `src/app/api/auth/refresh/route.ts`
- `src/features/auth/services/login-service.ts`
- `src/features/auth/types/auth.ts`
- `src/lib/auth/session-cookies.ts`
- `src/lib/auth/session.ts`
