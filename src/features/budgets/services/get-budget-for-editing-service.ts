import "server-only";

import { findBudgetById } from "@/features/budgets/repositories/budget-repository";

export async function getBudgetForEditing(budgetId: string) {
  return findBudgetById(budgetId);
}
