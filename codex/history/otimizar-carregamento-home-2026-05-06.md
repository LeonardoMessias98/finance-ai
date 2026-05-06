# Otimizar carregamento da home

## Contexto

A tela inicial carregava todas as transacoes do usuario para montar resumo do mes, historico recente, navegacao mensal e analytics. Isso fazia o payload crescer com o historico completo.

## Decisao

O service da home passou a resolver o usuario autenticado uma vez e chamar repositories diretamente com filtros especificos para o dashboard.

As transacoes completas agora sao buscadas apenas para a janela necessaria do resumo e analytics. A navegacao mensal usa uma agregacao compacta de meses unicos, incluindo meses de pagamento de credito.

Tambem foi removido o calculo aninhado de resumo de credito por conta, substituido por uma passada unica sobre as transacoes do mes.

## Impacto

A home deixa de carregar o historico completo de transacoes para renderizar o dashboard. O frontend permanece sem acesso ao banco e os repositories continuam filtrando por `userId`.

## Arquivos criados

- `codex/history/otimizar-carregamento-home-2026-05-06.md`

## Arquivos alterados

- `src/features/dashboard/services/get-dashboard-financial-summary-service.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.ts`
- `src/features/dashboard/utils/build-dashboard-financial-summary.test.ts`
- `src/features/dashboard/utils/dashboard-month-navigation.ts`
- `src/features/dashboard/utils/dashboard-month-navigation.test.ts`
- `src/features/transactions/repositories/transaction-repository.ts`
