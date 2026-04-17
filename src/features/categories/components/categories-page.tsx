import { AppShell } from "@/components/layout/app-shell";
import { CategoriesList } from "@/features/categories/components/categories-list";
import { CategoryForm } from "@/features/categories/components/category-form";
import { CategoryTypeFilter } from "@/features/categories/components/category-type-filter";
import { getCategoryForEditing } from "@/features/categories/services/get-category-for-editing-service";
import { listCategoriesForManagement } from "@/features/categories/services/list-categories-for-management-service";
import type { CategoryType } from "@/features/categories/types/category";

type CategoriesPageProps = {
  editingCategoryId?: string;
  selectedType?: CategoryType;
};

export async function CategoriesPage({ editingCategoryId, selectedType }: CategoriesPageProps) {
  const [categories, editingCategory] = await Promise.all([
    listCategoriesForManagement({
      type: selectedType
    }),
    editingCategoryId ? getCategoryForEditing(editingCategoryId) : Promise.resolve(null)
  ]);

  const hasEditingError = Boolean(editingCategoryId) && !editingCategory;

  return (
    <AppShell>
      <section className="space-y-6 pt-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Categorias</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categoria{categories.length === 1 ? "" : "s"} na visão atual
          </p>
        </div>

        {hasEditingError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            A categoria selecionada para edição não foi encontrada. A página voltou ao modo de criação.
          </div>
        ) : null}

        <CategoryTypeFilter selectedType={selectedType} />

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <CategoriesList
            categories={categories}
            editingCategoryId={editingCategory?.id}
            selectedType={selectedType}
          />
          <CategoryForm category={editingCategory} defaultType={selectedType} />
        </div>
      </section>
    </AppShell>
  );
}
