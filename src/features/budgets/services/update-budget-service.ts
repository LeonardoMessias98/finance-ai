import "server-only";

import type { ParsedBudgetFormValues } from "@/features/budgets/schemas/budget-schema";
import {
  findBudgetByCategoryAndMonth,
  findBudgetById,
  updateBudget as updateBudgetRecord
} from "@/features/budgets/repositories/budget-repository";
import { findCategoryById } from "@/features/categories/repositories/category-repository";
import { DuplicateBudgetError, InvalidBudgetCategoryError } from "@/features/budgets/services/budget-errors";
import { normalizeBudgetFormValues } from "@/features/budgets/utils/normalize-budget-form-values";

export async function updateBudget(budgetId: string, values: ParsedBudgetFormValues) {
  const existingBudget = await findBudgetById(budgetId);

  if (!existingBudget) {
    return null;
  }

  const normalizedValues = normalizeBudgetFormValues(values);
  const [category, duplicatedBudget] = await Promise.all([
    findCategoryById(normalizedValues.categoryId),
    findBudgetByCategoryAndMonth({
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
    competencyMonth: normalizedValues.competencyMonth,
    categoryId: normalizedValues.categoryId,
    limitAmount: normalizedValues.limitAmount,
    alertThresholds: existingBudget.alertThresholds && existingBudget.alertThresholds.length > 0
      ? existingBudget.alertThresholds
      : normalizedValues.alertThresholds
  });
}
