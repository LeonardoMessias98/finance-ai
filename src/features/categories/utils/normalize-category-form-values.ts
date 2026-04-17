import type { ParsedCategoryFormValues } from "@/features/categories/schemas/category-schema";
import type { CreateCategoryInput } from "@/features/categories/types/category";

function normalizeOptionalValue(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

export function normalizeCategoryFormValues(values: ParsedCategoryFormValues): CreateCategoryInput {
  return {
    name: values.name.trim(),
    type: values.type,
    isActive: values.isActive,
    color: normalizeOptionalValue(values.color),
    icon: normalizeOptionalValue(values.icon)
  };
}
