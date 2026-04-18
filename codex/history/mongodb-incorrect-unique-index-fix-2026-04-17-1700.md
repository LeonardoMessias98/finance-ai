# MongoDB Incorrect Unique Index Fix

**Data:** 17 de abril de 2026 - 17h00

## Contexto

Foi identificado que o erro de chave duplicada persistia mesmo após correções anteriores. O problema era que havia um índice único incorreto na coleção `categories` que impedia usuários diferentes de terem categorias com o mesmo nome.

## Diagnóstico

### Problema identificado

Análise dos índices da coleção `categories` revelou:

```
Índices encontrados:
1. _id_: {"_id":1}
2. type_1_isActive_1_name_1: {"type":1,"isActive":1,"name":1}
3. type_1_name_1: {"type":1,"name":1} ← PROBLEMÁTICO
   Collation: {"locale":"en", "strength":2}
   Unique: true
4. userId_1_type_1_isActive_1_name_1: {"userId":1,"type":1,"isActive":1,"name":1}
5. userId_1_type_1_name_1: {"userId":1,"type":1,"name":1} ← CORRETO
   Collation: {"locale":"en", "strength":2}
   Unique: true
```

O índice `type_1_name_1` (único) impedia que qualquer categoria com mesmo `type` e `name` fosse criada, independente do usuário. Isso violava a regra de negócio de que usuários diferentes podem ter categorias com o mesmo nome.

### Causa raiz

O índice incorreto pode ter sido criado:
- Durante desenvolvimento anterior
- Por mudanças no schema do Mongoose
- Por migração incompleta de índices

## Solução implementada

### 1. Inspeção de índices

Script identificou o índice problemático `type_1_name_1` que era único apenas em `(type, name)`.

### 2. Remoção do índice incorreto

```javascript
await collection.dropIndex("type_1_name_1");
```

### 3. Verificação dos índices corretos

Confirmado que o índice correto `userId_1_type_1_name_1` (único) permanece ativo, permitindo categorias com mesmo nome para usuários diferentes.

## Resultado

- ✅ Usuários diferentes podem criar categorias com mesmo nome
- ✅ Índice único correto permanece: `(userId, type, name)`
- ✅ Validação de duplicatas funciona por usuário
- ✅ Seed e criação manual funcionam corretamente

## Arquivos criados/modificados

- Nenhum arquivo de código modificado (problema era no banco de dados)
- Índice `type_1_name_1` removido da coleção `categories`

## Teste

**Antes da correção:**
```
E11000 duplicate key error collection: test.categories index: type_1_name_1
```

**Depois da correção:**
- Usuário A: categoria "salário" ✅
- Usuário B: categoria "salário" ✅ (agora possível)

## Lição aprendida

1. Sempre inspecionar índices do MongoDB quando houver erros de chave duplicada
2. Índices únicos devem refletir corretamente as regras de negócio
3. Scripts de inspeção de índices são essenciais para debugging de bancos de dados