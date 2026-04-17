import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
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

  const activeCategories = categories.filter((category) => category.isActive);
  const inactiveCategories = categories.filter((category) => !category.isActive);
  const hasEditingError = Boolean(editingCategoryId) && !editingCategory;

  return (
    <AppShell>
      <section className="space-y-6">
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

        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardContent className="space-y-2 pt-5">
              <p className="text-sm text-muted-foreground">Na visão atual</p>
              <p className="text-2xl font-semibold text-foreground">{categories.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 pt-5">
              <p className="text-sm text-muted-foreground">Ativas</p>
              <p className="text-2xl font-semibold text-foreground">{activeCategories.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 pt-5">
              <p className="text-sm text-muted-foreground">Inativas</p>
              <p className="text-2xl font-semibold text-muted-foreground">{inactiveCategories.length}</p>
            </CardContent>
          </Card>
        </div>

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
