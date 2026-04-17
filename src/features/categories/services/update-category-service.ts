import "server-only";

import type { ParsedCategoryFormValues } from "@/features/categories/schemas/category-schema";
import {
  findCategoryByNameAndType,
  updateCategory as updateCategoryRecord
} from "@/features/categories/repositories/category-repository";
import { DuplicateCategoryError } from "@/features/categories/services/category-errors";
import { normalizeCategoryFormValues } from "@/features/categories/utils/normalize-category-form-values";

export async function updateCategory(categoryId: string, values: ParsedCategoryFormValues) {
  const payload = normalizeCategoryFormValues(values);
  const duplicatedCategory = await findCategoryByNameAndType({
    name: payload.name,
    type: payload.type,
    excludeCategoryId: categoryId
  });

  if (duplicatedCategory) {
    throw new DuplicateCategoryError();
  }

  return updateCategoryRecord({
    id: categoryId,
    ...payload
  });
}
