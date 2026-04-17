# Configurar MongoDB - 2026-04-15 14:14

## Contexto

O projeto já possuía uma conexão MongoDB funcional, mas a infraestrutura estava distribuída entre `src/lib/env.ts` e `src/lib/mongoose.ts`, além de depender de `MONGODB_DB_NAME`. A tarefa exigia consolidar tudo em um helper único e simples, adequado para Next.js.

## Decisão

Foi criada uma infraestrutura central em `src/lib/db/connect.ts` com as seguintes características:

- leitura da variável `MONGODB_URI` diretamente no helper
- erro explícito quando a variável não existe
- cache global tipado para evitar múltiplas conexões em desenvolvimento
- retorno tipado com `Mongoose`
- pasta `src/lib/db/models` preparada para receber models

Também foi atualizado o `README.md` com instrução breve de uso e o `.env.example` passou a refletir apenas a variável obrigatória desta infraestrutura.

## Impacto

- toda a lógica de conexão ficou centralizada em um único ponto
- a base ficou mais simples para novos agentes
- a infraestrutura agora segue exatamente o caminho solicitado para conexão e models
- o projeto ficou pronto para adicionar models Mongoose sem espalhar configuração

## Arquivos criados

- `src/lib/db/connect.ts`
- `src/lib/db/models/.gitkeep`
- `codex/history/configurar-mongodb-2026-04-15-1414.md`

## Arquivos alterados

- `.env.example`
- `README.md`
- `codex/contexts/architecture-rules.md`
- `src/features/dashboard/components/dashboard-page.tsx`

## Arquivos removidos

- `src/lib/env.ts`
- `src/lib/mongoose.ts`
