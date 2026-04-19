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

## Regras de negócio

### Categorias
- Usuários diferentes podem ter categorias com o mesmo nome
- Um usuário não pode ter duas categorias com mesmo nome e tipo
- Categorias são validadas por usuário (multiusuário)

### Contas
- Usuários diferentes podem ter contas com o mesmo nome
- Um usuário não pode ter duas contas com mesmo nome e tipo

### Transações
- Vinculadas a contas e categorias do usuário
- Validações de saldo e regras de negócio por usuário

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
- `AUTH_JWT_SECRET`

Use uma URI completa, com usuário, senha e nome do banco. Exemplo:

```bash
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/finance-ai?retryWrites=true&w=majority
AUTH_JWT_SECRET=change-me-with-a-long-random-secret
```

Se a senha tiver caracteres especiais, faça URL encoding antes de salvar a URI.

Opcionalmente, o seed pode receber dados do usuario inicial:

```bash
SEED_USER_EMAIL=owner@finance-ai.local
SEED_USER_PASSWORD_HASH=8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
```

O hash acima corresponde a `123456`.

## Scripts administrativos

### Reset completo do banco

**Cuidado:** Este comando deleta TODOS os dados!

```bash
npm run reset:admin -- --confirm
```

Limpa todas as coleções e cria um usuário inicial. Útil para desenvolvimento e testes.

### Criar novo usuário

```bash
npm run user:create
```

Cria um novo usuário sem afetar dados existentes. Suporta prefixos customizados:

```bash
USER_PREFIX=ADMIN npm run user:create
```

Ver `ADMIN_RESET.md` para documentação completa.

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

Para limpar os registros atuais e recriar o usuário inicial com dados limpos:

```bash
npm run seed:reset
npm run seed:reset -- --with-sample-data
```

O script carrega variáveis locais via `@next/env` e usa `MONGODB_URI` para conectar no MongoDB. `.env.local` é o formato recomendado, mas `.env` também funciona.

Dados criados por padrão:

- um usuario inicial
- contas padrão
- categorias de receita
- categorias de despesa

Dados opcionais com `--with-sample-data`:

- transações de exemplo no mês atual
- um orçamento de exemplo
- uma meta de exemplo

Credenciais padrão do seed:

- email: `owner@finance-ai.local`
- senha: `123456`

Você pode sobrescrever esses valores com `SEED_USER_*`.

## Autenticacao

- sem signup publico
- login por email e senha
- a senha e transformada em SHA-256 no cliente antes do envio
- o servidor compara o hash recebido com `passwordHash` salvo no banco
- o login gera `access token` JWT com 1 hora de expiracao e `refresh token` persistido no MongoDB
- apenas uma sessao ativa por usuario; um novo login invalida a sessao anterior
- rotas financeiras exigem usuario autenticado
- dados financeiros sao sempre filtrados por `userId`

Decisao de produto sobre senha:

- o `SHA-256` recebido do front e salvo exatamente nesse formato
- isso foi adotado para reduzir atrito no MVP
- isso nao e a abordagem mais segura recomendada para autenticacao web e permanece como trade-off consciente do produto

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
- autenticação por email com sessão única
- isolamento multiusuário por `userId`
- suporte PWA com instalação em Android e iOS
- documentação operacional pronta para outros agentes

## PWA

- a aplicação expõe `manifest.webmanifest`
- ícones de instalação são servidos pelo App Router
- o `service worker` é registrado apenas em produção
- o cache do PWA é restrito a assets estáticos para não misturar conteúdo privado do usuário

Instalação:

- Android: use a opção de instalar app no Chrome ou navegador compatível
- iOS: use `Compartilhar` → `Adicionar à Tela de Início` no Safari

Observação:

- a instalação exige ambiente HTTPS em produção
