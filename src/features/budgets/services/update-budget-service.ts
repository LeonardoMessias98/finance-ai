import "server-only";

import type { ParsedBudgetFormValues } from "@/features/budgets/schemas/budget-schema";
import {
  findBudgetByCategoryAndMonth,
  findBudgetById,
  updateBudget as updateBudgetRecord
} from "@/features/budgets/repositories/budget-repository";
import { findCategoryByIdForUser } from "@/features/categories/repositories/category-repository";
import { DuplicateBudgetError, InvalidBudgetCategoryError } from "@/features/budgets/services/budget-errors";
import { normalizeBudgetFormValues } from "@/features/budgets/utils/normalize-budget-form-values";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function updateBudget(budgetId: string, values: ParsedBudgetFormValues) {
  const user = await requireAuthenticatedAppUser();
  const existingBudget = await findBudgetById(budgetId, user.id);

  if (!existingBudget) {
    return null;
  }

  const normalizedValues = normalizeBudgetFormValues(values);
  const [category, duplicatedBudget] = await Promise.all([
    findCategoryByIdForUser(normalizedValues.categoryId, user.id),
    findBudgetByCategoryAndMonth({
      userId: user.id,
      categoryId: normalizedValues.categoryId,
      competencyMonth: normalizedValues.competencyMonth,
      excludeBudgetId: budgetId
    })
  ]);

  if (!category || category.type !== "expense") {
    throw new InvalidBudgetCategoryError();
  }

  if (duplicatedBudget) {
    throw new DuplicateBudgetError();
  }

  return updateBudgetRecord({
    id: budgetId,
    userId: user.id,
    competencyMonth: normalizedValues.competencyMonth,
    categoryId: normalizedValues.categoryId,
    limitAmount: normalizedValues.limitAmount,
    alertThresholds: existingBudget.alertThresholds && existingBudget.alertThresholds.length > 0
      ? existingBudget.alertThresholds
      : normalizedValues.alertThresholds
  });
}
