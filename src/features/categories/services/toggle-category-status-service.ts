import "server-only";

import { setCategoryActiveState } from "@/features/categories/repositories/category-repository";

export async function toggleCategoryStatus(categoryId: string, isActive: boolean) {
  return setCategoryActiveState(categoryId, isActive);
}
