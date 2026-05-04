# Historico Debito Colapsavel

## Contexto

A tela de historico ja separava transacoes em grupos de Debito e Credito, com o grupo de Credito expansivel e colapsavel. A necessidade era aplicar o mesmo comportamento ao grupo Debito sem alterar dados existentes, regras de criacao de transacoes ou comportamento mobile.

## Decisao

O componente colapsavel do grupo de Credito foi generalizado para aceitar rotulo e valor de resumo. O wrapper especifico de Credito foi mantido para preservar o comportamento e a microcopy existente, enquanto o grupo Debito passou a usar o mesmo componente com resumo de Resultado.

## Impacto

O historico agora mostra o grupo Debito colapsado por padrao, mantendo o resultado sempre visivel no cabecalho e exibindo a lista apenas ao expandir. O grupo Credito continua colapsavel, com total sempre visivel e lista acessivel ao expandir.

## Arquivos criados

- `codex/history/historico-debito-colapsavel-2026-05-04-0807.md`

## Arquivos alterados

- `src/features/transactions/components/transactions-credit-group.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transactions-list.test.tsx`
