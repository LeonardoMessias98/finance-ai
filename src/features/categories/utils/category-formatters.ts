import type { CategoryType } from "@/features/categories/types/category";

const categoryTypeLabelMap: Record<CategoryType, string> = {
  income: "Receita",
  expense: "Despesa",
  transfer: "Transferência"
};

export function getCategoryTypeLabel(categoryType: CategoryType): string {
  return categoryTypeLabelMap[categoryType];
}
