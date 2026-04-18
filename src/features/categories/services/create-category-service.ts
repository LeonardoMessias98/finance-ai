import "server-only";

import { Types } from "mongoose";

import type { ParsedCategoryFormValues } from "@/features/categories/schemas/category-schema";
import {
  createCategory as createCategoryRecord,
  findCategoryByNameAndType
} from "@/features/categories/repositories/category-repository";
import { DuplicateCategoryError } from "@/features/categories/services/category-errors";
import { normalizeCategoryFormValues } from "@/features/categories/utils/normalize-category-form-values";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function createCategory(values: ParsedCategoryFormValues) {
  const user = await requireAuthenticatedAppUser();

  // Ensure userId is a valid ObjectId
  if (!Types.ObjectId.isValid(user.id)) {
    throw new Error(`Invalid user ID: ${user.id}`);
  }

  const payload = normalizeCategoryFormValues(values);
  const duplicatedCategory = await findCategoryByNameAndType({
    userId: user.id,
    name: payload.name,
    type: payload.type
  });

  if (duplicatedCategory) {
    throw new DuplicateCategoryError();
  }

  return createCategoryRecord({
    userId: user.id,
    ...payload
  });
}
