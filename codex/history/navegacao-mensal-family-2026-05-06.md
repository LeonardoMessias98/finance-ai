# Navegacao Mensal Family

## Contexto

A tela `/family` ja recebia `competencyMonth` por search params e usava essa competencia no resumo financeiro, mas nao oferecia controles visiveis para navegar entre meses.

## Decisão

Foi adicionada uma navegacao mensal na tela de familia usando o mesmo `CompetencyMonthSwitcher` usado em outras telas. A URL segue o padrao `/family?competencyMonth=YYYY-MM`, com links para mes anterior, mes atual e proximo mes, alem do campo `type="month"`.

## Impacto

O mes selecionado fica visivel e passa a ser navegavel diretamente na tela. Como o service de familia ja recebe `competencyMonth`, a mesma selecao continua afetando resumo familiar, gastos de debito, gastos de credito e graficos por categoria sem alterar dados existentes ou isolamento por `userId`.

## Arquivos criados

- `src/features/families/components/family-month-filter.tsx`
- `src/features/families/components/family-member-card.tsx`
- `src/features/families/utils/build-family-href.ts`
- `codex/history/navegacao-mensal-family-2026-05-06.md`

## Arquivos alterados

- `src/features/families/components/family-page.tsx`
- `src/features/families/components/family-page.test.tsx`
