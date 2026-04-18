import "server-only";

import type { CategoryType } from "@/features/categories/types/category";
import { listCategories } from "@/features/categories/repositories/category-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

// Transaction forms should default to active categories only.
export async function listOperationalCategories(filters?: {
  type?: CategoryType;
}) {
  const user = await requireAuthenticatedAppUser();

  return listCategories({
    userId: user.id,
    type: filters?.type,
    isActive: true
  });
}
