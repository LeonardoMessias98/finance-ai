import Link from "next/link";
import { FolderTree, PencilLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryStatusToggleButton } from "@/features/categories/components/category-status-toggle-button";
import type { Category, CategoryType } from "@/features/categories/types/category";
import { getCategoryTypeLabel } from "@/features/categories/utils/category-formatters";
import { groupCategoriesByType } from "@/features/categories/utils/group-categories-by-type";
import { cn } from "@/lib/utils";

type CategoriesListProps = {
  categories: Category[];
  editingCategoryId?: string;
  selectedType?: CategoryType;
};

function CategoryGroup({
  categories,
  editingCategoryId,
  selectedType,
  type
}: {
  categories: Category[];
  editingCategoryId?: string;
  selectedType?: CategoryType;
  type: CategoryType;
}) {
  return (
    <Card className="border-primary/10 bg-card/85">
      <CardHeader className="space-y-1">
        <CardTitle className="font-display text-3xl">{getCategoryTypeLabel(type)}</CardTitle>
        <CardDescription>
          {categories.length === 0
            ? "Nenhuma categoria cadastrada neste tipo."
            : `${categories.length} categoria(s) cadastrada(s) neste grupo.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-background/60 px-5 py-8 text-center text-sm text-muted-foreground">
            Crie a primeira categoria deste tipo usando o formulário ao lado.
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                className={cn(
                  "grid gap-4 rounded-[1.5rem] border border-border/80 bg-background/70 p-4 lg:grid-cols-[1fr_auto]",
                  editingCategoryId === category.id ? "border-primary/40 bg-primary/5" : ""
                )}
                key={category.id}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
                    style={{
                      backgroundColor: category.color ?? "hsl(156 54% 27%)"
                    }}
                  >
                    <FolderTree className="h-5 w-5" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">{category.name}</p>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>{getCategoryTypeLabel(category.type)}</span>
                      {category.icon ? <span>Ícone {category.icon}</span> : null}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-start gap-3 lg:justify-end">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/categories?categoryId=${category.id}${selectedType ? `&type=${selectedType}` : ""}`}>
                      <PencilLine className="h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                  <CategoryStatusToggleButton categoryId={category.id} isActive={category.isActive} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CategoriesList({ categories, editingCategoryId, selectedType }: CategoriesListProps) {
  const groupedCategories = groupCategoriesByType(categories);

  const typesToRender: CategoryType[] = selectedType ? [selectedType] : ["income", "expense", "transfer"];

  return (
    <div className="space-y-6">
      {typesToRender.map((categoryType) => (
        <CategoryGroup
          categories={groupedCategories[categoryType]}
          editingCategoryId={editingCategoryId}
          key={categoryType}
          selectedType={selectedType}
          type={categoryType}
        />
      ))}
    </div>
  );
}
