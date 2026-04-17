import "server-only";

import type { ParsedCategoryFormValues } from "@/features/categories/schemas/category-schema";
import {
  createCategory as createCategoryRecord,
  findCategoryByNameAndType
} from "@/features/categories/repositories/category-repository";
import { DuplicateCategoryError } from "@/features/categories/services/category-errors";
import { normalizeCategoryFormValues } from "@/features/categories/utils/normalize-category-form-values";

export async function createCategory(values: ParsedCategoryFormValues) {
  const payload = normalizeCategoryFormValues(values);
  const duplicatedCategory = await findCategoryByNameAndType({
    name: payload.name,
    type: payload.type
  });

  if (duplicatedCategory) {
    throw new DuplicateCategoryError();
  }

  return createCategoryRecord(payload);
}
