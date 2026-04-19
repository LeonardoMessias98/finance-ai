import "server-only";

import { findAccountByIdForUser } from "@/features/accounts/repositories/account-repository";
import { findCategoryByIdForUser } from "@/features/categories/repositories/category-repository";
import { getCategoryTypeLabel } from "@/features/categories/utils/category-formatters";
import { createTransactionFieldError } from "@/features/transactions/services/transaction-errors";
import type { UpdateTransactionInput } from "@/features/transactions/types/transaction";

type TransactionRelationInput = Pick<UpdateTransactionInput, "type" | "accountId" | "categoryId">;

export async function assertTransactionRelations(input: TransactionRelationInput, userId: string): Promise<void> {
  const [sourceAccount, category] = await Promise.all([
    findAccountByIdForUser(input.accountId, userId),
    input.categoryId ? findCategoryByIdForUser(input.categoryId, userId) : Promise.resolve(null)
  ]);

  if (!sourceAccount) {
    throw createTransactionFieldError("accountId", "A conta de origem selecionada não foi encontrada.");
  }

  if (!input.categoryId) {
    throw createTransactionFieldError("categoryId", "Selecione uma categoria.");
  }

  if (!category) {
    throw createTransactionFieldError("categoryId", "A categoria selecionada não foi encontrada.");
  }

  if (category.type !== input.type) {
    throw createTransactionFieldError(
      "categoryId",
      `A categoria selecionada precisa ser do tipo ${getCategoryTypeLabel(input.type).toLowerCase()}.`
    );
  }
}
