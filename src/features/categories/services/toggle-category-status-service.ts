import "server-only";

import { setCategoryActiveState } from "@/features/categories/repositories/category-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function toggleCategoryStatus(categoryId: string, isActive: boolean) {
  const user = await requireAuthenticatedAppUser();

  return setCategoryActiveState(categoryId, user.id, isActive);
}
