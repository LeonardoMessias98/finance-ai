import "server-only";

import { findBudgetById } from "@/features/budgets/repositories/budget-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function getBudgetForEditing(budgetId: string) {
  const user = await requireAuthenticatedAppUser();

  return findBudgetById(budgetId, user.id);
}
