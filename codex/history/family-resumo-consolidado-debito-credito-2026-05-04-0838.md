# Resumo consolidado familiar com débito e crédito separados

## Contexto

O resumo geral da tela `/family` precisava deixar explícita a separação entre movimentações de débito e gastos de crédito, sem misturar crédito no saldo disponível familiar nem nas saídas principais.

## Decisão

O contrato do resumo familiar passou a expor `monthlyDebitIncome`, além dos campos já existentes de gastos em débito e crédito. O serviço consolida entradas, saídas e resultado líquido a partir das transações de contas débito/não crédito, enquanto gastos em `credit` e `credit_card` continuam em um total visual separado.

## Impacto

A tela `/family` agora exibe no consolidado: saldo familiar, entradas de débito, gastos de débito, gastos de crédito e resultado de débito. Pagamentos de fatura feitos como despesa em conta débito seguem entrando nas saídas de débito.

## Arquivos criados

- `codex/history/family-resumo-consolidado-debito-credito-2026-05-04-0838.md`

## Arquivos alterados

- `src/features/families/components/family-page.tsx`
- `src/features/families/components/family-page.test.tsx`
- `src/features/families/services/get-family-financial-summary-service.ts`
- `src/features/families/services/get-family-financial-summary-service.test.ts`
- `src/features/families/types/family-financial-summary.ts`
