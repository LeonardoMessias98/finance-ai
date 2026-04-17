# Simplificar Form de Transacao

## Contexto

O fluxo de criacao de transacoes ainda exigia decisoes demais logo na abertura do formulario, com campos avancados e mensagens extras disputando atencao com o basico do lancamento.

## Decisão

Reorganizei o formulario para priorizar `tipo`, `valor`, `descricao`, `data`, `categoria` e `conta`, movendo `competencyMonth`, `status`, `parcelas`, `observacao` e `recorrencia` para uma secao opcional. Tambem adicionei defaults mais agressivos para conta, categoria unica e destino unico em transferencias, com foco inicial em `valor`.

## Impacto

O fluxo ficou mais proximo do uso de uma planilha pessoal: menos ruído visual, menos cliques para o caso comum e melhor navegacao por teclado. A pagina de transacoes passou a destacar o formulario primeiro e manter o resumo mensal mais compacto, sem perder validacao nem feedback claro de erro.

## Arquivos criados

- `src/features/transactions/utils/transaction-form-defaults.ts`
- `src/features/transactions/utils/transaction-form-defaults.test.ts`
- `codex/history/simplificar-form-transacao-2026-04-17-1134.md`

## Arquivos alterados

- `src/features/transactions/components/transaction-form.tsx`
- `src/features/transactions/components/transactions-page.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transactions-filters.tsx`
