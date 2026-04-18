# MongoDB Duplicate Key Error Fix

**Data:** 17 de abril de 2026 - 16h00

## Contexto

Foi reportado um erro de chave duplicada no MongoDB ao tentar criar categorias:

```
[MongoServerError: E11000 duplicate key error collection: test.categories index: type_1_name_1 collation: { locale: "en", caseLevel: false, caseFirst: "off", strength: 2, numericOrdering: false, alternate: "non-ignorable", maxVariable: "punct", normalization: false, backwards: false, version: "57.1" } dup key: { type: "CollationKey(0x39432d454131010a)", name: "CollationKey(0x4d293f294b394501428807)" }]
```

## Diagnóstico

### Problema identificado

1. **Categoria órfã no banco:** Uma categoria "Salário" existia com `userId: undefined`, criada provavelmente durante seed anterior sem usuário válido.

2. **Inconsistência de collation:** O seed usava `locale: "pt"` na busca de categorias existentes, mas o índice único usava `locale: "en"`, causando diferenças na comparação case-insensitive.

### Análise técnica

- O índice único composto `{ userId: 1, type: 1, name: 1 }` com collation `locale: "en", strength: 2` previne duplicatas por usuário.
- A validação no service `createCategory` usa `findCategoryByNameAndType` com collation `locale: "en"`.
- O seed `ensureCategorySeed` usava collation `locale: "pt"`, causando inconsistência.

## Solução implementada

### 1. Remoção de categoria inválida

Script de debug identificou e removeu categoria com `userId: undefined`:

```javascript
const invalidCategory = await CategoryModel.findOne({ userId: { $exists: false } });
if (invalidCategory) {
  await CategoryModel.deleteOne({ _id: invalidCategory._id });
}
```

### 2. Correção de collation no seed

Alterada collation de `locale: "pt"` para `locale: "en"` em `ensureCategorySeed` para manter consistência com o índice único.

### 3. Re-seed do banco

Executado `npm run seed` para recriar categorias com `userId` correto.

## Resultado

- ✅ Todas as categorias agora têm `userId` válido
- ✅ Collation consistente entre índice, validação e seed
- ✅ Criação de categorias funciona sem erros de duplicata
- ✅ Validação de duplicatas funciona corretamente

## Arquivos alterados

- `src/lib/db/seeds/seed-initial-database.ts` - Correção de collation para `locale: "en"`

## Teste

Após correção:
- Seed executado com sucesso: 13 categorias criadas
- Todas as categorias têm `userId` válido
- Validação de duplicatas funciona na aplicação

## Lição aprendida

1. Sempre verificar integridade de dados após mudanças no seed
2. Manter collation consistente entre índices, queries e validações
3. Usar scripts de debug para investigar problemas de dados