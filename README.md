# Finance AI

`finance-ai` é uma ferramenta pessoal de controle financeiro inspirada no uso de planilhas.

A direção do produto não é a de uma plataforma financeira complexa. O foco é abrir rápido, ver saldo, consultar transações e registrar novos lançamentos com pouco atrito.

## Direção do produto

- foco principal em saldo e transações
- navegação financeira guiada por mês
- interface minimalista
- dark mode por padrão
- tipografia com `Inter`
- remoção contínua de excessos visuais e informacionais
- prioridade para velocidade de uso no MVP

## Escopo atual do MVP

O MVP deve parecer uma planilha pessoal bem resolvida:

- home centrada em saldo atual, resumo do mês e transações recentes
- histórico mensal com filtros simples
- criação rápida de transação
- módulos auxiliares como contas, categorias, orçamentos e metas com peso secundário

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

## Estrutura

```text
src/
  app/
  components/
    layout/
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

Se preferir, o CLI também consegue ler `.env`, mas `.env.local` continua sendo o caminho recomendado para ambiente local.

3. Configure:

- `MONGODB_URI`

Use uma URI completa, com usuário, senha e nome do banco. Exemplo:

```bash
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/finance-ai?retryWrites=true&w=majority"
```

Se a senha tiver caracteres especiais, faça URL encoding antes de salvar a URI.

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

O projeto inclui um seed idempotente para popular contas e categorias padrão sem duplicar registros existentes.

Comando base:

```bash
npm run seed
```

Para incluir dados opcionais de exemplo para desenvolvimento rápido:

```bash
npm run seed -- --with-sample-data
```

O script carrega variáveis locais via `@next/env` e usa `MONGODB_URI` para conectar no MongoDB. `.env.local` é o formato recomendado, mas `.env` também funciona.

Dados criados por padrão:

- contas padrão
- categorias de receita
- categorias de despesa
- categoria de transferência interna

Dados opcionais com `--with-sample-data`:

- transações de exemplo no mês atual
- um orçamento de exemplo
- uma meta de exemplo

## Testes

- `Vitest` e `Testing Library` ficam prontos para testes unitários e de componente
- `Playwright` fica pronto para testes end-to-end
- se for a primeira execução de E2E, rode `npm run test:e2e:install` para baixar os navegadores

## Regras de arquitetura

- uma única aplicação Next.js
- organização por feature em `src/features`
- componentes compartilhados em `src/components`
- infraestrutura compartilhada em `src/lib`
- conexão com MongoDB centralizada e reutilizável
- código simples, com tipos explícitos e sem `any`

## MongoDB

A conexão com MongoDB fica centralizada em [connect.ts](/home/messias/work/finance-ai/src/lib/db/connect.ts). O helper reutiliza a instância do Mongoose em desenvolvimento para evitar múltiplas conexões no hot reload do Next.js.

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

- interface dark mode minimalista
- fonte `Inter` aplicada globalmente
- saldo e transações como centro da experiência
- navegação por competência mensal
- criação de transação simplificada
- documentação operacional pronta para outros agentes
