# Reset Administrativo - Finance AI

## Objetivo

Scripts administrativos seguros para gerenciar banco de dados e usuários.

- **`reset:admin`** - Reset completo: limpa banco + cria usuário inicial
- **`user:create`** - Cria novo usuário sem afetar dados existentes

## ⚠️ Cuidado

**O script `reset:admin` deleta TODOS os dados do banco!** Use com cuidado.

## O que é deletado (apenas `reset:admin`)

- ✗ Usuários (exceto o novo usuário criado)
- ✗ Contas bancárias
- ✗ Categorias
- ✗ Transações
- ✗ Orçamentos
- ✗ Metas
- ✗ Refresh tokens

---

## Pré-requisitos (ambos scripts)

Ensure `.env` has these variables:

```bash
MONGODB_URI="your-mongodb-connection-string"
SEED_USER_FIRST_NAME="Leonardo"
SEED_USER_LAST_NAME="Messias"
SEED_USER_BIRTH_DATE="1998-10-16"        # YYYY-MM-DD format
SEED_USER_EMAIL="messiasleonardo98@gmail.com"
SEED_USER_PASSWORD_SHA256="hash_here"    # SHA-256 hash (64 chars hex)
```

---

## Reset Completo (`npm run reset:admin`)

### Segurança

- ✓ Rejeita execução em produção por padrão
- ✓ Requer flag `--confirm` para evitar execução acidental
- ✓ Não hardcoda dados sensíveis (vem de env vars)
- ✓ Valida todas as variáveis de ambiente antes de começar

### Uso

**Desenvolvimento (recomendado):**

```bash
npm run reset:admin -- --confirm
```

**Produção (EMERGÊNCIA apenas):**

```bash
FORCE_RESET_PRODUCTION=true npm run reset:admin -- --confirm
```

### Fluxo

1. Valida segurança (não é produção ou `FORCE_RESET_PRODUCTION=true`)
2. Valida variáveis de ambiente
3. Conecta ao banco de dados
4. Limpa todas as coleções
5. Cria usuário inicial
6. Desconecta

### Saída esperada

```
======================================================================
RESET ADMINISTRATIVO - Finance AI
======================================================================

📡 Conectando ao banco de dados...
✓ Conectado com sucesso

🗑️  Limpando coleções do banco...
✓ Coleções limpas:
   - Usuários: 1 deletados
   - Contas: 5 deletadas
   - Categorias: 10 deletadas
   - Transações: 50 deletadas
   - Orçamentos: 3 deletados
   - Metas: 2 deletadas
   - Refresh tokens: 2 deletados

👤 Criando usuário inicial...
✓ Usuário inicial criado:
   - Nome: Leonardo Messias
   - Email: messiasleonardo98@gmail.com
   - ID: 507f1f77bcf86cd799439011

======================================================================
✅ Reset concluído com sucesso!
======================================================================
```

---

## Criar Novo Usuário (`npm run user:create`)

### Segurança

- ✓ Valida todas as variáveis de ambiente
- ✓ Rejeita email duplicado
- ✓ Sem dados sensíveis no código

### Uso básico

```bash
npm run user:create
```

### Uso com prefixo customizado

Para criar múltiplos usuários com diferentes env vars:

```bash
# Criar usuário "admin"
SEED_USER_FIRST_NAME="Admin" \
SEED_USER_LAST_NAME="User" \
SEED_USER_BIRTH_DATE="2000-01-01" \
SEED_USER_EMAIL="admin@finance-ai.local" \
SEED_USER_PASSWORD_SHA256="hash_here" \
npm run user:create
```

Ou com prefixo de env vars:

```bash
# Definir em .env
ADMIN_USER_FIRST_NAME="Admin"
ADMIN_USER_LAST_NAME="User"
ADMIN_USER_BIRTH_DATE="2000-01-01"
ADMIN_USER_EMAIL="admin@finance-ai.local"
ADMIN_USER_PASSWORD_SHA256="hash_here"

# Executar
USER_PREFIX=ADMIN npm run user:create
```

### Saída esperada

```
======================================================================
CRIAR NOVO USUÁRIO - Finance AI
======================================================================

Ambiente: development
Prefixo env vars: SEED_USER

📡 Conectando ao banco de dados...
✓ Conectado com sucesso

📖 Lendo dados do usuário (SEED_USER_*)...
✓ Dados validados

👤 Criando usuário...
✓ Usuário criado com sucesso:
   - Nome: Leonardo Messias
   - Email: messiasleonardo98@gmail.com
   - ID: 507f1f77bcf86cd799439011

======================================================================
✅ Usuário criado com sucesso!
======================================================================
```

---

## Troubleshooting

### "Variáveis de ambiente ausentes"

Verifique se todas as 6 variáveis estão no `.env`:
- `MONGODB_URI`
- `SEED_USER_FIRST_NAME`
- `SEED_USER_LAST_NAME`
- `SEED_USER_BIRTH_DATE` (formato YYYY-MM-DD)
- `SEED_USER_EMAIL`
- `SEED_USER_PASSWORD_SHA256`

### "Data de nascimento inválida"

Use formato YYYY-MM-DD (ex: 1998-10-16)

### "Erro ao conectar"

Verifique:
- `MONGODB_URI` está correto
- Mongo está acessível
- Credenciais estão corretas

### "Email já existe"

Quando usar `user:create`, o email deve ser único. Altere `SEED_USER_EMAIL` ou use prefixo diferente:

```bash
USER_PREFIX=BACKUP npm run user:create
```

## Diferenças vs seed normal

| Aspecto | `reset:admin` | `user:create` | `seed` |
|---------|--------------|---------------|-------|
| Deleta dados | ✓ Completo | ✗ Não | ✓ Apenas com `--reset` |
| Cria usuário | ✓ Sempre | ✓ Sempre | ✓ Sempre |
| Cria dados de exemplo | ✗ Não | ✗ Não | ✓ Com `--with-sample-data` |
| Segurança produção | ✓ Bloqueia | ~ Aviso | ✗ Não bloqueia |
| Confirmação | ✓ `--confirm` | ✗ Automático | ✗ Automático |

## Dados sensíveis

Nenhum dos scripts faz logging de:
- Emails
- Senhas/hashes
- MongoDB URI
- Credenciais

Todas as variáveis sensíveis vêm do `.env` e não são exibidas.

## CI/CD Integration

Para CI/CD pipelines (quando `NODE_ENV=test`):

```bash
# Reset completo
npm run reset:admin -- --confirm

# Criar novo usuário
npm run user:create
```

O script detecta falta de TTY e não aguarda confirmação interativa.
