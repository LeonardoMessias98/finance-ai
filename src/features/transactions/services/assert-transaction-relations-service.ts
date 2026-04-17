import "server-only";

import { findAccountById } from "@/features/accounts/repositories/account-repository";
import { findCategoryById } from "@/features/categories/repositories/category-repository";
import { getCategoryTypeLabel } from "@/features/categories/utils/category-formatters";
import { createTransactionFieldError } from "@/features/transactions/services/transaction-errors";
import type { UpdateTransactionInput } from "@/features/transactions/types/transaction";

type TransactionRelationInput = Pick<
  UpdateTransactionInput,
  "type" | "accountId" | "destinationAccountId" | "categoryId"
>;

export async function assertTransactionRelations(input: TransactionRelationInput): Promise<void> {
  const [sourceAccount, destinationAccount, category] = await Promise.all([
    findAccountById(input.accountId),
    input.destinationAccountId ? findAccountById(input.destinationAccountId) : Promise.resolve(null),
    input.categoryId ? findCategoryById(input.categoryId) : Promise.resolve(null)
  ]);

  if (!sourceAccount) {
    throw createTransactionFieldError("accountId", "A conta de origem selecionada não foi encontrada.");
  }

  if (input.type === "transfer") {
    if (input.destinationAccountId && !destinationAccount) {
      throw createTransactionFieldError("destinationAccountId", "A conta de destino selecionada não foi encontrada.");
    }

    if (input.categoryId) {
      if (!category) {
        throw createTransactionFieldError("categoryId", "A categoria selecionada não foi encontrada.");
      }

      if (category.type !== "transfer") {
        throw createTransactionFieldError(
          "categoryId",
          `Transferências só podem usar categorias do tipo ${getCategoryTypeLabel("transfer").toLowerCase()}.`
        );
      }
    }

    return;
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
