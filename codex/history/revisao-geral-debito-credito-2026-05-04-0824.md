# Revisao Geral Debito Credito

## Contexto

Foi feita uma revisao geral da logica recente de debito e credito, incluindo historico, resumo mensal, saldo disponivel da home e tela de contas.

## Decisao

A implementacao existente foi mantida porque as regras principais ja estavam centralizadas em helpers e services. Foi adicionada cobertura direta para os labels de tipos de conta, garantindo que tipos legados nao credito aparecam como Debito e `credit`/`credit_card` aparecam como Credito.

## Impacto

A suite agora protege explicitamente a compatibilidade visual dos tipos antigos, alem das coberturas ja existentes para grupos expansivos, calculos de resumo, saldo disponivel e saldo atual por conta.

## Arquivos criados

- `src/features/accounts/utils/account-formatters.test.ts`
- `codex/history/revisao-geral-debito-credito-2026-05-04-0824.md`

## Arquivos alterados

- Nenhum arquivo de producao foi alterado nesta revisao.
