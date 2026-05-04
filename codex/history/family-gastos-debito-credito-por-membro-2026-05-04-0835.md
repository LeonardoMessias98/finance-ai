# Gastos de débito e crédito por membro na família

## Contexto

A tela `/family` precisava separar visualmente os gastos mensais de débito e crédito de cada membro, mantendo o isolamento por `userId` e permitindo consulta apenas aos membros visualizáveis da família do usuário autenticado.

## Decisão

O resumo familiar passou a expor `monthlyDebitExpense` e `monthlyCreditExpense` por membro e no consolidado familiar. A separação reutiliza o helper centralizado de agrupamento por tipo de conta, preservando `credit` e `credit_card` como crédito e tratando todos os demais tipos como débito/não crédito.

## Impacto

A tela familiar agora mostra gastos de débito, gastos de crédito e resultado de débito separadamente. Gastos no crédito permanecem apenas visuais e não entram no resultado líquido de débito, no saldo disponível ou nas regras pessoais de consulta.

## Arquivos criados

- `src/features/families/components/family-page.test.tsx`
- `codex/history/family-gastos-debito-credito-por-membro-2026-05-04-0835.md`

## Arquivos alterados

- `src/features/families/components/family-page.tsx`
- `src/features/families/services/get-family-financial-summary-service.ts`
- `src/features/families/services/get-family-financial-summary-service.test.ts`
- `src/features/families/types/family-financial-summary.ts`
