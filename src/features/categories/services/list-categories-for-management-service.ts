import "server-only";

import type { CategoryType } from "@/features/categories/types/category";
import { listCategories } from "@/features/categories/repositories/category-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function listCategoriesForManagement(filters?: {
  type?: CategoryType;
}) {
  const user = await requireAuthenticatedAppUser();

  return listCategories({
    userId: user.id,
    type: filters?.type
  });
}
