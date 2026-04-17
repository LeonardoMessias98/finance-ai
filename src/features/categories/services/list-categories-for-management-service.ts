import "server-only";

import type { CategoryType } from "@/features/categories/types/category";
import { listCategories } from "@/features/categories/repositories/category-repository";

export async function listCategoriesForManagement(filters?: {
  type?: CategoryType;
}) {
  return listCategories({
    type: filters?.type
  });
}
