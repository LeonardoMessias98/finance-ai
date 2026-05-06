# Topbar Mobile Nova Transacao

## Contexto

No mobile, o botao "Nova transacao" ocupava muito espaco na Topbar e deixava a navegacao horizontal mais apertada.

## Decisão

O botao de nova transacao continua na Topbar e preserva a mesma acao global de abertura do modal. A apresentacao foi ajustada para exibir o icone `Plus` no mobile e manter o texto completo a partir do breakpoint `sm`, com `aria-label` para garantir nome acessivel no botao compacto.

## Impacto

A Topbar usa menos largura em telas pequenas sem alterar regra de negocio, persistencia ou fluxo de criacao de transacoes. Os testes do header cobrem o texto responsivo, o botao acessivel e o clique que aciona a criacao via modal global.

## Arquivos criados

- `codex/history/topbar-mobile-nova-transacao-2026-05-06.md`

## Arquivos alterados

- `src/components/layout/app-header.tsx`
- `src/components/layout/app-header.test.tsx`
