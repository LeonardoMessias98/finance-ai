# Auth Strategy

## Objetivo

Garantir autenticacao simples e isolamento multiusuario sem criar backend separado nem espalhar regra de sessao pelo projeto.

## Implementacao atual

O projeto usa autenticacao propria dentro do App Router:

- login por `email` + `passwordHash`
- hash `SHA-256` calculado no cliente antes do envio
- validacao server-side comparando com `passwordHash` salvo no MongoDB
- `access token` JWT assinado com `AUTH_JWT_SECRET` e expiracao de 1 hora
- `refresh token` opaco salvo no MongoDB com TTL em `expiresAt`
- apenas uma sessao ativa por usuario

## Estrutura

- `src/features/auth`: schemas, repositories, services, actions e componentes de autenticacao
- `src/lib/auth/jwt.ts`: emissao e verificacao do JWT
- `src/lib/auth/session-cookies.ts`: criacao, refresh e revogacao de sessao
- `src/lib/auth/session.ts`: leitura server-side do usuario autenticado
- `src/app/api/auth/refresh/route.ts`: renovacao silenciosa da sessao
- `src/app/login/page.tsx`: tela de login

## Modelagem

Entidades de autenticacao:

- `users`
- `refresh_tokens`

Campos do usuario:

- `firstName`
- `lastName`
- `birthDate`
- `email`
- `passwordHash`
- `lastLoginIp`
- `lastLoginLocation` opcional
- `activeSessionId` opcional
- `createdAt`
- `updatedAt`

Campos do refresh token:

- `userId`
- `sessionId`
- `tokenHash`
- `expiresAt`
- `revokedAt` opcional
- `createdAt`

## Isolamento de dados

Todas as entidades financeiras atuais possuem `userId`:

- `accounts`
- `categories`
- `transactions`
- `budgets`
- `goals`

Regra obrigatoria:

- repositories nunca devem listar, ler, editar ou excluir registros sem filtrar por `userId`
- services resolvem o usuario autenticado na borda server-side e propagam apenas `userId`
- repositories nao leem cookie nem sessao diretamente

## Regras de sessao

- nao existe signup publico
- login invalida qualquer sessao anterior do mesmo usuario
- refresh token anterior e revogado ao fazer novo login
- refresh token expirado pode ser removido automaticamente pelo TTL index
- logout revoga a sessao ativa e limpa os cookies

## Rotas protegidas

As rotas financeiras principais exigem autenticacao:

- `/`
- `/accounts`
- `/categories`
- `/transactions`
- `/budgets`
- `/goals`

`/login` permanece publica.

## Diretrizes para evolucao

- manter a autenticacao resolvida na borda server-side
- continuar propagando apenas `userId` para as camadas de dominio
- se surgir necessidade real de provedores externos ou fluxo mais complexo, reavaliar `Auth.js`
- nao reintroduzir queries globais em entidades pessoais
