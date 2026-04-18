import "server-only";

import {
  countTransactionsByCategoryId,
  deleteCategory as deleteCategoryRecord,
  findCategoryByIdForUser
} from "@/features/categories/repositories/category-repository";
import { CategoryHasTransactionsError } from "@/features/categories/services/category-errors";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function deleteCategory(categoryId: string) {
  const user = await requireAuthenticatedAppUser();
  const existingCategory = await findCategoryByIdForUser(categoryId, user.id);

  if (!existingCategory) {
    return null;
  }

  const relatedTransactionsCount = await countTransactionsByCategoryId(categoryId, user.id);

  if (relatedTransactionsCount > 0) {
    throw new CategoryHasTransactionsError();
  }

  return deleteCategoryRecord(categoryId, user.id);
}
