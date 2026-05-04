# Melhorar usabilidade visual do historico de transacoes

## Contexto

O historico de transacoes precisava ficar mais facil de ler, com hierarquia visual melhor, entradas e saidas mais claras e comportamento mais confortavel no mobile.

## Decisao

A listagem de transacoes foi reorganizada visualmente sem alterar regra de negocio, services, repositories ou acesso a banco.
As transacoes agora sao agrupadas por data e renderizadas em cards responsivos, com:

- descricao em destaque
- valor destacado por tipo de transacao
- conta e categoria como informacoes secundarias
- status em badge
- acoes separadas do conteudo principal
- layout sem tabela ou colunas apertadas em mobile

## Impacto

A tela de historico fica mais escaneavel e menos poluida, principalmente em telas menores.
Entradas e saidas ficam visualmente distintas, mas os dados e filtros existentes permanecem iguais.

## Arquivos criados

- `src/features/transactions/components/transactions-list.test.tsx`
- `codex/history/melhorar-usabilidade-historico-transacoes-2026-05-03-1711.md`

## Arquivos alterados

- `src/features/transactions/components/transactions-list.tsx`
