import { redirect } from "next/navigation";

import { CategoriesPage } from "@/features/categories/components/categories-page";
import { categoryTypeValues, type CategoryType } from "@/features/categories/types/category";
import { getOptionalAuthenticatedAppUser } from "@/lib/auth/session";
import { isTruthySearchParam } from "@/lib/search-params";

type CategoriesRoutePageProps = {
  searchParams?: Promise<{
    categoryId?: string | string[];
    create?: string | string[];
    type?: string | string[];
  }>;
};

function isCategoryType(value: string): value is CategoryType {
  return categoryTypeValues.includes(value as CategoryType);
}

export default async function CategoriesRoutePage({ searchParams }: CategoriesRoutePageProps) {
  const user = await getOptionalAuthenticatedAppUser();

  if (!user) {
    redirect("/login?next=/categories");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const editingCategoryId =
    typeof resolvedSearchParams.categoryId === "string" ? resolvedSearchParams.categoryId : undefined;
  const selectedType =
    typeof resolvedSearchParams.type === "string" && isCategoryType(resolvedSearchParams.type)
      ? resolvedSearchParams.type
      : undefined;
  const isCreateModalOpen = isTruthySearchParam(resolvedSearchParams.create);

  return (
    <CategoriesPage
      editingCategoryId={editingCategoryId}
      isCreateModalOpen={isCreateModalOpen}
      selectedType={selectedType}
    />
  );
}
