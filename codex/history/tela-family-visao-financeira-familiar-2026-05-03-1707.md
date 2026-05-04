# Tela Family para visao financeira familiar

## Contexto

Usuarios de uma familia precisam visualizar uma consolidacao financeira dos membros, sem liberar edicao de dados de outros usuarios e sem remover filtros pessoais por `userId`.

## Decisao

Foi criada a rota `/family`, composta por page, Server Component e service.
O service primeiro valida a familia do usuario autenticado por participacao com `canView: true`.
Somente depois monta a lista de `userId`s permitidos e busca contas, categorias e transacoes usando os repositories pessoais existentes com filtro explicito por `userId`.

O resumo familiar reutiliza o builder do dashboard para cada membro e consolida:

- membros da familia
- saldo individual
- entradas do mes
- saidas do mes
- resultado mensal
- total consolidado
- ultimas transacoes por membro

## Impacto

A visualizacao familiar passa a existir sem criar permissao de edicao compartilhada.
Dados financeiros continuam isolados nas queries pessoais e sao agregados apenas no service familiar apos validacao de pertencimento.

## Arquivos criados

- `src/app/family/page.tsx`
- `src/features/families/components/family-page.tsx`
- `src/features/families/types/family-financial-summary.ts`
- `src/features/families/services/get-family-financial-summary-service.ts`
- `src/features/families/services/get-family-financial-summary-service.test.ts`
- `codex/history/tela-family-visao-financeira-familiar-2026-05-03-1707.md`

## Arquivos alterados

- `src/features/families/repositories/family-repository.ts`
- `src/features/families/repositories/family-repository.test.ts`
- `src/components/layout/app-header.tsx`
- `src/lib/auth/route-access.ts`
