import type { BudgetFormValues } from "@/features/budgets/schemas/budget-schema";
import type { Budget } from "@/features/budgets/types/budget";
import type { Category } from "@/features/categories/types/category";

export function getBudgetFormDefaultValues(
  budget?: Budget | null,
  defaultCompetencyMonth?: string
): BudgetFormValues {
  return {
    competencyMonth: budget?.competencyMonth ?? defaultCompetencyMonth ?? "",
    categoryId: budget?.categoryId ?? "",
    limitAmount: budget ? budget.limitAmount / 100 : 0
  };
}

export function getAvailableBudgetCategories(categories: Category[], selectedCategoryId?: string): Category[] {
  return categories.filter((category) => category.isActive || category.id === selectedCategoryId);
}
