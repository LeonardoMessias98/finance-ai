# Reset Admin & User Creation Scripts

**Data:** 17 de abril de 2026 - 14h40

## Contexto

O projeto precisava de scripts administrativos seguros para gerenciar banco de dados em desenvolvimento:

1. **`reset:admin`** - Reset completo: limpa todos os dados + cria usuário inicial
2. **`user:create`** - Criar novos usuários sem afetar dados existentes

A principal necessidade era separar a lógica de criação de usuários do reset, para permitir reutilização futura.

## Decisão

Criamos uma arquitetura modular:

### 1. Utilitário compartilhado (`scripts/lib/user-creation.ts`)

Funções reutilizáveis:
- `parseBirthDateInput()` - Parse de data YYYY-MM-DD
- `createUser()` - Criar usuário com validação Zod
- `readUserInputFromEnv()` - Ler dados de env vars com prefixo customizável

### 2. Script de reset (`scripts/reset-admin.ts`)

- Valida segurança (rejeita produção por padrão)
- Requer flag `--confirm`
- Limpa todas as 7 coleções
- Cria usuário inicial usando o utilitário

### 3. Script de criação de usuário (`scripts/create-user.ts`)

- Cria usuário sem afetar dados
- Suporta múltiplos prefixos de env vars
- Reutiliza lógica de `user-creation.ts`
- Rejeita email duplicado

### Segurança

- ✓ Sem dados sensíveis hardcoded
- ✓ Validação Zod em toda entrada
- ✓ Rejeita produção onde apropriado
- ✓ Mensagens de erro descritivas

## Impacto

### Positivo

- ✅ Separação clara de responsabilidades
- ✅ Reutilizável para futuros scripts
- ✅ Fácil criar múltiplos usuários com prefixos diferentes
- ✅ CI/CD pode criar usuários programaticamente
- ✅ Manutenibilidade: mudanças em um lugar afetam todos scripts

### Considerações

- Validação de env vars ocorre em tempo de criação (não no startup)
- Prefixo de env vars permite criar usuários diferentes
- Arquivo `scripts/lib/` novo requer update em .gitignore se necessário

## Arquivos criados

- `scripts/lib/user-creation.ts` - Utilitário compartilhado para criação de usuários
- `scripts/create-user.ts` - Script para criar novo usuário
- `ADMIN_RESET.md` - Documentação completa com exemplos

## Arquivos alterados

- `scripts/reset-admin.ts` - Refatorado para usar utilitário
- `package.json` - Adicionado comando `user:create`

## Como usar

### Reset completo
```bash
npm run reset:admin -- --confirm
```

### Criar novo usuário
```bash
npm run user:create
```

### Criar usuário com prefixo customizado
```bash
USER_PREFIX=ADMIN npm run user:create
```

## Próximos passos (opcional)

- Adicionar script para listar usuários existentes
- Integrar com CI/CD pipeline
- Adicionar script para deletar usuário específico
- Adicionar logging de auditoria
