import "server-only";

import { findCategoryByIdForUser } from "@/features/categories/repositories/category-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function getCategoryForEditing(categoryId: string) {
  const user = await requireAuthenticatedAppUser();

  return findCategoryByIdForUser(categoryId, user.id);
}
