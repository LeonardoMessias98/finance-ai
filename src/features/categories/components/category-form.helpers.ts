import type { CategoryFormValues } from "@/features/categories/schemas/category-schema";
import type { Category } from "@/features/categories/types/category";

export function getCategoryFormDefaultValues(category?: Category | null, defaultType?: string): CategoryFormValues {
  return {
    name: category?.name ?? "",
    type: category?.type ?? (defaultType === "income" || defaultType === "expense" ? defaultType : "expense"),
    isActive: category?.isActive ?? true,
    color: category?.color ?? "",
    icon: category?.icon ?? ""
  };
}
