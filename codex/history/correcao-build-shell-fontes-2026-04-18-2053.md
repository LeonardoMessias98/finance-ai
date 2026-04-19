# Contexto

O build da aplicação passou a falhar após a refatoração de UX. Havia dois pontos envolvidos: o `AppShell` ficou acoplado a elementos autenticados usados por uma `error.tsx` client-side, e o layout raiz dependia de `next/font/google`, o que introduzia fetch de fonte em tempo de build.

## Decisão

Separei o shell autenticado do shell compartilhado. O `AppShell` ficou neutro, apenas como estrutura visual reutilizável, enquanto o novo `AuthenticatedAppShell` passou a concentrar header, keep-alive de sessão e o provider do modal global de transação. Em paralelo, removi a dependência de `Inter` via Google Fonts e substituí por uma stack local definida em CSS.

## Impacto

O build voltou a ser determinístico e compatível com ambientes sem acesso externo para fontes. A correção também eliminou o acoplamento indevido entre uma boundary client-side e partes autenticadas do shell, reduzindo o risco de novos erros de compilação relacionados a client/server boundaries.

Na prática, a aplicação preserva o mesmo comportamento visual principal, mantém o modal global de transação nas telas autenticadas e passa a ter um layout base mais seguro para `loading.tsx` e `error.tsx`.

## Arquivos criados

- `src/components/layout/authenticated-app-shell.tsx`

## Arquivos alterados

- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/layout/app-shell.tsx`
- `src/features/transactions/components/open-transaction-modal-button.tsx`
- `src/features/transactions/hooks/use-global-transaction-modal.ts`
