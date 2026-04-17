import "server-only";

import { findCategoryById } from "@/features/categories/repositories/category-repository";

export async function getCategoryForEditing(categoryId: string) {
  return findCategoryById(categoryId);
}
