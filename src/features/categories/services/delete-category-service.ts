import "server-only";

import {
  countTransactionsByCategoryId,
  deleteCategory as deleteCategoryRecord,
  findCategoryById
} from "@/features/categories/repositories/category-repository";
import { CategoryHasTransactionsError } from "@/features/categories/services/category-errors";

export async function deleteCategory(categoryId: string) {
  const existingCategory = await findCategoryById(categoryId);

  if (!existingCategory) {
    return null;
  }

  const relatedTransactionsCount = await countTransactionsByCategoryId(categoryId);

  if (relatedTransactionsCount > 0) {
    throw new CategoryHasTransactionsError();
  }

  return deleteCategoryRecord(categoryId);
}
