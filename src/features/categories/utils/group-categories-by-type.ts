import type { Category, CategoryType } from "@/features/categories/types/category";

export function groupCategoriesByType(categories: Category[]): Record<CategoryType, Category[]> {
  return {
    income: categories.filter((category) => category.type === "income"),
    expense: categories.filter((category) => category.type === "expense"),
    transfer: categories.filter((category) => category.type === "transfer")
  };
}
