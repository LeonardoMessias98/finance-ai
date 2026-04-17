# Architecture Rules

## Estrutura obrigatória

- `src/app` para rotas e composição
- `src/features` para organização por feature
- `src/components` para componentes compartilhados
- `src/lib` para infraestrutura
- `src/hooks` para hooks compartilhados
- `src/types` para tipos pequenos e globais

## Regras de separação

- não misturar UI com regra de negócio
- não misturar regra de negócio com acesso ao banco
- não criar backend separado
- não criar frontend separado
- não usar microserviços

## Infraestrutura

- a conexão com MongoDB deve ser centralizada em `src/lib/db/connect.ts`
- a conexão precisa ser reutilizada entre renders no ambiente Next.js
- os models Mongoose devem ficar em `src/lib/db/models`
- novas features devem adicionar apenas as camadas realmente necessárias
