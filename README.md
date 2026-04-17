# Finance AI

Base inicial do projeto `finance-ai`, preparada para desenvolvimento rápido com IA.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- MongoDB Atlas
- Mongoose
- Zod
- React Hook Form
- Vitest
- Testing Library
- Playwright

## Objetivo

Deixar o projeto pronto para crescer sem atrito:

- estrutura clara por feature
- regras simples para manutenção por agentes de IA
- conexão central com MongoDB Atlas via Mongoose
- base de testes pronta desde o bootstrap
- dashboard inicial vazio para evolução incremental

## Estrutura

```text
src/
  app/
  components/
    layout/
  components/
    ui/
  features/
    dashboard/
  hooks/
  lib/
  types/
codex/
  contexts/
  history/
  prompts/
  templates/
AGENTS.md
README.md
vitest.config.ts
vitest.setup.ts
playwright.config.ts
tests/
  e2e/
```

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo local de ambiente:

```bash
cp .env.example .env.local
```

Se preferir, o CLI tambem consegue ler `.env`, mas `.env.local` continua sendo o caminho recomendado para ambiente local.

3. Configure:

- `MONGODB_URI`

Use uma URI completa, com usuario, senha e nome do banco. Exemplo:

```bash
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/finance-ai?retryWrites=true&w=majority"
```

Se a senha tiver caracteres especiais, faca URL encoding antes de salvar a URI.

4. Rode a aplicação:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run seed
npm run test:e2e
npm run test:e2e:install
```

## Seed inicial

O projeto inclui um seed idempotente para popular contas e categorias padrao sem duplicar registros existentes.

Comando base:

```bash
npm run seed
```

Para incluir dados opcionais de exemplo para desenvolvimento rapido:

```bash
npm run seed -- --with-sample-data
```

O script carrega variaveis locais via `@next/env` e usa `MONGODB_URI` para conectar no MongoDB. `.env.local` e o formato recomendado, mas `.env` tambem funciona.

Dados criados por padrao:

- contas padrao
- categorias de receita
- categorias de despesa
- categoria de transferencia interna

Dados opcionais com `--with-sample-data`:

- transacoes de exemplo no mes atual
- um orcamento de exemplo
- uma meta de exemplo

## Testes

- `Vitest` e `Testing Library` ficam prontos para testes unitários e de componente
- `Playwright` fica pronto para testes end-to-end
- Se for a primeira execução de E2E, rode `npm run test:e2e:install` para baixar os navegadores

## Regras de arquitetura

- uma única aplicação Next.js
- organização por feature em `src/features`
- componentes compartilhados em `src/components`
- infraestrutura compartilhada em `src/lib`
- conexão com MongoDB centralizada e reutilizável
- código simples, com tipos explícitos e sem `any`

## MongoDB

A conexão com MongoDB fica centralizada em [src/lib/db/connect.ts](/home/messias/work/finance-ai/src/lib/db/connect.ts). O helper reutiliza a instância do Mongoose em desenvolvimento para evitar múltiplas conexões no hot reload do Next.js.

Uso básico:

```ts
import { connectToDatabase } from "@/lib/db/connect";

export async function loadSomething() {
  await connectToDatabase();
  // depois disso, use seus models em src/lib/db/models
}
```

Estrutura preparada:

- `src/lib/db/connect.ts`: conexão central
- `src/lib/db/models`: diretório reservado para models Mongoose
- `src/lib/db/seeds`: datasets e executor do seed inicial

## Estado atual

- layout base pronto
- dashboard inicial vazio
- conexão MongoDB pronta para uso
- stack de testes configurada
- documentação operacional criada para outros agentes
