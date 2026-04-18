import "server-only";

import { Types } from "mongoose";

import type { ParsedBudgetFormValues } from "@/features/budgets/schemas/budget-schema";
import { createBudget as createBudgetRecord, findBudgetByCategoryAndMonth } from "@/features/budgets/repositories/budget-repository";
import { findCategoryByIdForUser } from "@/features/categories/repositories/category-repository";
import { DuplicateBudgetError, InvalidBudgetCategoryError } from "@/features/budgets/services/budget-errors";
import { normalizeBudgetFormValues } from "@/features/budgets/utils/normalize-budget-form-values";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function createBudget(values: ParsedBudgetFormValues) {
  const user = await requireAuthenticatedAppUser();

  // Ensure userId is a valid ObjectId
  if (!Types.ObjectId.isValid(user.id)) {
    throw new Error(`Invalid user ID: ${user.id}`);
  }

  const payload = normalizeBudgetFormValues(values);
  const [category, existingBudget] = await Promise.all([
    findCategoryByIdForUser(payload.categoryId, user.id),
    findBudgetByCategoryAndMonth({
      userId: user.id,
      categoryId: payload.categoryId,
      competencyMonth: payload.competencyMonth
    })
  ]);

  if (!category || category.type !== "expense") {
    throw new InvalidBudgetCategoryError();
  }

  if (existingBudget) {
    throw new DuplicateBudgetError();
  }

  return createBudgetRecord({
    userId: user.id,
    ...payload
  });
}
