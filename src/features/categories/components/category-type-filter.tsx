import Link from "next/link";

import { categoryTypeValues, type CategoryType } from "@/features/categories/types/category";
import { getCategoryTypeLabel } from "@/features/categories/utils/category-formatters";
import { cn } from "@/lib/utils";

type CategoryTypeFilterProps = {
  selectedType?: CategoryType;
};

export function CategoryTypeFilter({ selectedType }: CategoryTypeFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
          !selectedType ? "bg-primary text-primary-foreground" : "bg-background/70 text-foreground hover:bg-secondary"
        )}
        href="/categories"
      >
        Todas
      </Link>
      {categoryTypeValues.map((categoryType) => (
        <Link
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            selectedType === categoryType
              ? "bg-primary text-primary-foreground"
              : "bg-background/70 text-foreground hover:bg-secondary"
          )}
          href={`/categories?type=${categoryType}`}
          key={categoryType}
        >
          {getCategoryTypeLabel(categoryType)}
        </Link>
      ))}
    </div>
  );
}
