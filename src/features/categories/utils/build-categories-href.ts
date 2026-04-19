import type { CategoryType } from "@/features/categories/types/category";

type BuildCategoriesHrefInput = {
  categoryId?: string;
  create?: boolean;
  type?: CategoryType;
};

export function buildCategoriesHref(input: BuildCategoriesHrefInput = {}): string {
  const searchParams = new URLSearchParams();

  if (input.categoryId) {
    searchParams.set("categoryId", input.categoryId);
  }

  if (input.type) {
    searchParams.set("type", input.type);
  }

  if (input.create) {
    searchParams.set("create", "1");
  }

  const queryString = searchParams.toString();

  return queryString.length > 0 ? `/categories?${queryString}` : "/categories";
}
