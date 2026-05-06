# Revisão da tela familiar com débito, crédito e gráficos

## Contexto

A tela `/family` precisava ser revisada após as mudanças de separação entre débito e crédito, cards por membro e gráficos de gastos por categoria.

## Decisão

Foi feita uma revisão direcionada do service e da UI. As regras existentes foram preservadas e a cobertura foi ampliada para garantir que pagamento de fatura criado como transação de débito entre nas saídas principais, enquanto gastos de crédito seguem apenas visuais. Também foi adicionado teste para estados vazios de transações recentes e gráficos por categoria.

## Impacto

A tela familiar mantém saldo disponível e saídas principais sem misturar crédito, preserva consultas por `userId` dos membros permitidos e cobre melhor os casos de vazio e pagamento de fatura.

## Arquivos criados

- `codex/history/revisao-family-debito-credito-graficos-2026-05-04-1408.md`

## Arquivos alterados

- `src/features/families/components/family-page.test.tsx`
- `src/features/families/services/get-family-financial-summary-service.test.ts`
