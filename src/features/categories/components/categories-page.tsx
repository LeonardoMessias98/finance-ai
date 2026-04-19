import { AuthenticatedAppShell } from "@/components/layout/authenticated-app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { MobileOnlyModalShell } from "@/components/ui/mobile-only-modal-shell";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/ui/status-banner";
import { CategoriesList } from "@/features/categories/components/categories-list";
import { CategoryForm } from "@/features/categories/components/category-form";
import { CategoryTypeFilter } from "@/features/categories/components/category-type-filter";
import { getCategoryForEditing } from "@/features/categories/services/get-category-for-editing-service";
import { listCategoriesForManagement } from "@/features/categories/services/list-categories-for-management-service";
import type { CategoryType } from "@/features/categories/types/category";
import { buildCategoriesHref } from "@/features/categories/utils/build-categories-href";
import Link from "next/link";

type CategoriesPageProps = {
  editingCategoryId?: string;
  isCreateModalOpen?: boolean;
  selectedType?: CategoryType;
};

export async function CategoriesPage({
  editingCategoryId,
  isCreateModalOpen = false,
  selectedType
}: CategoriesPageProps) {
  const [categories, editingCategory] = await Promise.all([
    listCategoriesForManagement({
      type: selectedType
    }),
    editingCategoryId ? getCategoryForEditing(editingCategoryId) : Promise.resolve(null)
  ]);

  const hasEditingError = Boolean(editingCategoryId) && !editingCategory;
  const returnHref = buildCategoriesHref({
    type: selectedType
  });
  const createHref = buildCategoriesHref({
    create: true,
    type: selectedType
  });
  const isMobileModalOpen = isCreateModalOpen || Boolean(editingCategory);

  return (
    <AuthenticatedAppShell>
      <PageSection>
        <PageHeader
          actions={
            <Button asChild className="lg:hidden" type="button">
              <Link href={createHref}>Nova categoria</Link>
            </Button>
          }
          description={`${categories.length} categoria${categories.length === 1 ? "" : "s"} na visão atual`}
          title="Categorias"
        />

        {hasEditingError ? (
          <StatusBanner
            message="A categoria selecionada para edição não foi encontrada. A página voltou ao modo de criação."
            variant="error"
          />
        ) : null}

        <CategoryTypeFilter selectedType={selectedType} />

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <CategoriesList
            categories={categories}
            editingCategoryId={editingCategory?.id}
            selectedType={selectedType}
          />
          <div className="hidden lg:block">
            <CategoryForm
              category={editingCategory}
              defaultType={selectedType}
              returnHref={returnHref}
            />
          </div>
        </div>

        {isMobileModalOpen ? (
          <MobileOnlyModalShell
            closeHref={returnHref}
            mobileFullscreen
            title={editingCategory ? "Editar categoria" : "Nova categoria"}
          >
            <CategoryForm
              category={editingCategory}
              closeOnSuccess
              defaultType={selectedType}
              returnHref={returnHref}
              showCard={false}
            />
          </MobileOnlyModalShell>
        ) : null}
      </PageSection>
    </AuthenticatedAppShell>
  );
}
