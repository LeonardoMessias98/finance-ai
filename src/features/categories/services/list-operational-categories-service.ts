import "server-only";

import type { CategoryType } from "@/features/categories/types/category";
import { listCategories } from "@/features/categories/repositories/category-repository";

// Transaction forms should default to active categories only.
export async function listOperationalCategories(filters?: {
  type?: CategoryType;
}) {
  return listCategories({
    type: filters?.type,
    isActive: true
  });
}
