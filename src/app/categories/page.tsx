import { CategoriesPage } from "@/features/categories/components/categories-page";
import { categoryTypeValues, type CategoryType } from "@/features/categories/types/category";

type CategoriesRoutePageProps = {
  searchParams?: Promise<{
    categoryId?: string | string[];
    type?: string | string[];
  }>;
};

function isCategoryType(value: string): value is CategoryType {
  return categoryTypeValues.includes(value as CategoryType);
}

export default async function CategoriesRoutePage({ searchParams }: CategoriesRoutePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const editingCategoryId =
    typeof resolvedSearchParams.categoryId === "string" ? resolvedSearchParams.categoryId : undefined;
  const selectedType =
    typeof resolvedSearchParams.type === "string" && isCategoryType(resolvedSearchParams.type)
      ? resolvedSearchParams.type
      : undefined;

  return <CategoriesPage editingCategoryId={editingCategoryId} selectedType={selectedType} />;
}
