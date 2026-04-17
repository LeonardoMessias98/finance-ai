import type { ParsedBudgetFormValues } from "@/features/budgets/schemas/budget-schema";
import type { CreateBudgetInput } from "@/features/budgets/types/budget";

export const defaultBudgetAlertThresholds = [80, 100] as const;

export function normalizeBudgetFormValues(
  values: ParsedBudgetFormValues
): CreateBudgetInput & { alertThresholds: number[] } {
  return {
    competencyMonth: values.competencyMonth,
    categoryId: values.categoryId,
    limitAmount: Math.round(values.limitAmount * 100),
    alertThresholds: [...defaultBudgetAlertThresholds]
  };
}
