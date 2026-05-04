# Revisao geral de credito, familia e historico

## Contexto

Foi solicitada uma revisao das mudancas recentes de contas de credito, entidade Family e historico de transacoes, com foco em preservar dados existentes, manter isolamento por `userId`, validar regras fora da UI e confirmar a substituicao do loading/modal e dos filtros do historico.

## Decisao

A revisao confirmou que as regras centrais ficaram em helpers, schemas, services e repositories conforme a arquitetura atual. Nao foram feitas alteracoes de banco, migrations, limpeza de dados ou ajustes destrutivos.

## Impacto

As validacoes de credito continuam cobrindo `credit` e `credit_card`, contas nao credito continuam compativeis como debito, transacoes pessoais seguem filtradas por `userId`, e a visao familiar consulta apenas membros permitidos depois de validar a participacao do usuario autenticado. A tela de historico usa o loading compartilhado e mantem filtros em modal com search params.

Foram executados:

- `npm run test`
- `npm run typecheck`
- `npm run lint`

## Arquivos criados

- `codex/history/revisao-credit-family-historico-2026-05-03-1716.md`

## Arquivos alterados

- Nenhum arquivo de produto foi alterado nesta revisao.
