# Criar tela login

## Contexto

A aplicacao precisava de uma tela de login coerente com a direcao visual do produto: dark mode, minimalista, elegante e centrada no formulario, sem abrir escopo para signup.

## Decisão

Foi mantida a estrutura server-side da rota `/login`, mas a tela foi refinada para uma composicao mais enxuta e focada. O layout agora usa uma area curta de contexto visual e um bloco principal dedicado ao formulario, com melhor hierarquia, superficies discretas e feedbacks mais claros de erro e loading.

## Impacto

O fluxo de entrada fica mais objetivo, com navegacao por teclado preservada, estados de erro mais legiveis, placeholders claros e indicacoes visuais de campo invalido. Tambem foi adicionado um teste de componente cobrindo validacoes basicas do formulario para evitar regressao nos erros de email e senha.

## Arquivos criados

- `codex/history/criar-tela-login-2026-04-17-1933.md`
- `src/features/auth/components/login-form.test.tsx`

## Arquivos alterados

- `src/app/login/page.tsx`
- `src/features/auth/components/login-form.tsx`
