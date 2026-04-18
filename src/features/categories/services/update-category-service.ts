import "server-only";

import type { ParsedCategoryFormValues } from "@/features/categories/schemas/category-schema";
import {
  findCategoryByNameAndType,
  updateCategory as updateCategoryRecord
} from "@/features/categories/repositories/category-repository";
import { DuplicateCategoryError } from "@/features/categories/services/category-errors";
import { normalizeCategoryFormValues } from "@/features/categories/utils/normalize-category-form-values";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function updateCategory(categoryId: string, values: ParsedCategoryFormValues) {
  const user = await requireAuthenticatedAppUser();
  const payload = normalizeCategoryFormValues(values);
  const duplicatedCategory = await findCategoryByNameAndType({
    userId: user.id,
    name: payload.name,
    type: payload.type,
    excludeCategoryId: categoryId
  });

  if (duplicatedCategory) {
    throw new DuplicateCategoryError();
  }

  return updateCategoryRecord({
    id: categoryId,
    userId: user.id,
    ...payload
  });
}
