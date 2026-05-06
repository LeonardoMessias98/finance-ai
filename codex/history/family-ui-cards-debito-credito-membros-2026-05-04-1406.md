# Cards familiares com resumo de débito e crédito

## Contexto

A tela `/family` precisava deixar mais clara a leitura por membro, separando visualmente resumo de débito e resumo de crédito sem alterar regras de negócio ou dados existentes.

## Decisão

Os cards de membros foram reorganizados em dois blocos internos: Débito e Crédito. O bloco de débito mostra saldo disponível, entradas, gastos e resultado. O bloco de crédito mostra gastos de crédito e uma microcopy curta explicando que crédito é apenas visualização até a fatura ser paga no débito.

## Impacto

A tela fica mais legível em mobile e desktop, mantendo o visual minimalista e a seção final de gráficos por categoria. Os testes de UI cobrem renderização de cards por membro, totais de débito/crédito, texto explicativo e a seção de categorias.

## Arquivos criados

- `codex/history/family-ui-cards-debito-credito-membros-2026-05-04-1406.md`

## Arquivos alterados

- `src/features/families/components/family-page.tsx`
- `src/features/families/components/family-page.test.tsx`
