# ObjectId Conversion Bug Fix

**Data:** 17 de abril de 2026 - 15h00

## Contexto

Após implementar os scripts administrativos, foi identificado um bug crítico onde a criação de contas, categorias, transações, orçamentos e metas falhava com o erro:

```
TypeError: Cannot read properties of undefined (reading 'toString')
    at mapAccountDocument (account-repository.ts:15:29)
```

O erro ocorria porque o campo `userId` do documento criado estava `undefined`, causando falha na função `document.userId.toString()`.

## Decisão

**Problema identificado:** O Mongoose não estava convertendo automaticamente strings de ObjectId válidas para objetos `ObjectId` no momento da criação de documentos.

**Solução implementada:** Modificar todos os repositories de criação para converter explicitamente o campo `userId` de string para `ObjectId` antes de passar para o `Model.create()`.

### Código alterado:

```typescript
// Antes (não funcionava)
const document = await Model.create(payload);

// Depois (funciona)
const documentData = {
  ...payload,
  userId: new Types.ObjectId(payload.userId)
};
const document = await Model.create(documentData);
```

### Services corrigidos com validação adicional:

Adicionada validação em todos os services para garantir que `user.id` é um ObjectId válido:

```typescript
if (!Types.ObjectId.isValid(user.id)) {
  throw new Error(`Invalid user ID: ${user.id}`);
}
```

## Impacto

### Positivo

- ✅ Criação de contas, categorias, transações, orçamentos e metas agora funciona
- ✅ Validação robusta de ObjectId em tempo de execução
- ✅ Prevenção de bugs similares no futuro

### Considerações

- Repositories agora fazem conversão explícita de tipos
- Services têm validação adicional de ObjectId
- Mudança é backward-compatible (strings válidas continuam funcionando)

## Arquivos alterados

### Repositories (conversão ObjectId):

- `src/features/accounts/repositories/account-repository.ts`
- `src/features/categories/repositories/category-repository.ts`
- `src/features/transactions/repositories/transaction-repository.ts`
- `src/features/budgets/repositories/budget-repository.ts`
- `src/features/goals/repositories/goal-repository.ts`

### Services (validação ObjectId):

- `src/features/accounts/services/create-account-service.ts`
- `src/features/categories/services/create-category-service.ts`
- `src/features/transactions/services/create-transaction-service.ts`
- `src/features/budgets/services/create-budget-service.ts`
- `src/features/goals/services/create-goal-service.ts`

## Teste

O bug foi corrigido e a criação de entidades agora funciona corretamente através da interface web.

## Lição aprendida

Sempre converter explicitamente strings para ObjectId quando trabalhando com campos de referência no Mongoose, especialmente em operações de criação.