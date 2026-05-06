# Revisao geral de mobile, credito, familia, home e performance

## Contexto

A revisao validou as melhorias recentes de topbar mobile, pagamento de credito, navegacao familiar, navegacao mensal da home, organizacao frontend e otimizacoes de carregamento.

## Decisao

Foi mantida a arquitetura atual e corrigida uma lacuna na home: a navegacao horizontal de meses agora marca os meses com movimentacao ou referencia de fatura usando o indicador do `MonthScroller`.

Tambem foram conferidos:

- botao mobile de nova transacao com icone e `aria-label`;
- fluxo de pagamento de credito como despesa de debito;
- reducao do saldo devido do credito por pagamentos;
- navegacao mensal da familia;
- ausencia de `any` em `src` fora de testes;
- acesso ao MongoDB restrito a repositories, infraestrutura e seeds;
- queries pessoais preservando filtro por `userId`.

## Impacto

A home fica mais clara sem adicionar peso visual, destacando meses que possuem dados. Os testes de dashboard, topbar, MonthScroller, credito, historico e familia preservam os comportamentos revisados.

## Arquivos criados

- `codex/history/revisao-geral-mobile-credito-familia-home-performance-2026-05-06.md`

## Arquivos alterados

- `src/features/dashboard/components/dashboard-month-filter.tsx`
- `src/features/dashboard/components/dashboard-month-filter.test.tsx`
- `src/features/dashboard/components/dashboard-page.tsx`
- `src/features/dashboard/components/dashboard-summary-cards.test.tsx`
- `src/features/dashboard/types/dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
- `src/features/dashboard/utils/dashboard-month-navigation.ts`
- `src/features/dashboard/utils/dashboard-month-navigation.test.ts`
