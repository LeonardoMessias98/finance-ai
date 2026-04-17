import "server-only";

import type { ParsedBudgetFormValues } from "@/features/budgets/schemas/budget-schema";
import { createBudget as createBudgetRecord, findBudgetByCategoryAndMonth } from "@/features/budgets/repositories/budget-repository";
import { findCategoryById } from "@/features/categories/repositories/category-repository";
import { DuplicateBudgetError, InvalidBudgetCategoryError } from "@/features/budgets/services/budget-errors";
import { normalizeBudgetFormValues } from "@/features/budgets/utils/normalize-budget-form-values";

export async function createBudget(values: ParsedBudgetFormValues) {
  const payload = normalizeBudgetFormValues(values);
  const [category, existingBudget] = await Promise.all([
    findCategoryById(payload.categoryId),
    findBudgetByCategoryAndMonth({
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

  return createBudgetRecord(payload);
}
