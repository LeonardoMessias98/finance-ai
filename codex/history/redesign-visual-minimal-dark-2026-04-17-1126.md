# Redesign visual minimal dark - 2026-04-17 11:26

## Contexto

A interface ainda carregava uma identidade visual clara, promocional e com excesso de informação para um produto de uso pessoal. A tarefa exigia reposicionar o app como uma evolução silenciosa de uma planilha pessoal, com dark mode por padrão, foco no saldo atual, visão rápida do mês e lançamento de transações com pouco atrito.

## Decisão

O redesign foi concentrado em poucos pontos estruturais:

- tema global escuro com tokens reutilizáveis e paleta alinhada ao briefing
- tipografia unificada com `Inter` via `next/font/google`
- simplificação dos componentes base (`Card`, `Button`, `Input`, `Select`, `Textarea`, `Badge`)
- header minimalista, sem badges tecnológicas e com CTA direto para nova transação
- revisão das telas principais para remover hero sections corporativas, excesso de cards e textos decorativos

Na home, a hierarquia passou a ser:

1. saldo atual em destaque
2. resumo do mês
3. transações recentes
4. ações principais para criar transação e ver histórico

## Impacto

- a aplicação passa a abrir em dark mode consistente e mais silencioso visualmente
- a navegação principal ficou mais direta para uso pessoal recorrente
- home e telas operacionais ganharam menos blocos decorativos e mais foco em decisão
- o visual ficou centralizado em tokens e componentes compartilhados, reduzindo divergência entre telas

## Arquivos criados

- `codex/history/redesign-visual-minimal-dark-2026-04-17-1126.md`

## Arquivos alterados

- `src/app/layout.tsx`
- `src/app/globals.css`
- `tailwind.config.ts`
- `src/app/transactions/error.tsx`
- `src/components/layout/app-shell.tsx`
- `src/components/layout/app-header.tsx`
- `src/components/layout/app-header.test.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/badge.tsx`
- `src/features/dashboard/components/dashboard-page.tsx`
- `src/features/dashboard/components/dashboard-summary-cards.tsx`
- `src/features/dashboard/components/dashboard-latest-transactions.tsx`
- `src/features/dashboard/components/dashboard-month-filter.tsx`
- `src/features/transactions/components/transactions-page.tsx`
- `src/features/transactions/components/transactions-filters.tsx`
- `src/features/transactions/components/transactions-list.tsx`
- `src/features/transactions/components/transaction-form.tsx`
- `src/features/budgets/components/budgets-page.tsx`
- `src/features/budgets/components/budget-form.tsx`
- `src/features/accounts/components/accounts-page.tsx`
- `src/features/accounts/components/account-form.tsx`
- `src/features/categories/components/categories-page.tsx`
- `src/features/categories/components/category-form.tsx`
- `src/features/goals/components/goals-page.tsx`
- `src/features/goals/components/goal-form.tsx`
