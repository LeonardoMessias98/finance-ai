import { FilterChipGroup } from "@/components/filters/filter-chip-group";
import type { FilterChipOption } from "@/components/filters/filter-chip-group.types";
import { categoryTypeValues, type CategoryType } from "@/features/categories/types/category";
import { buildCategoriesHref } from "@/features/categories/utils/build-categories-href";
import { getCategoryTypeLabel } from "@/features/categories/utils/category-formatters";

type CategoryTypeFilterProps = {
  selectedType?: CategoryType;
};

export function CategoryTypeFilter({ selectedType }: CategoryTypeFilterProps) {
  const options: ReadonlyArray<FilterChipOption<CategoryType>> = [
    {
      href: buildCategoriesHref(),
      label: "Todas"
    },
    ...categoryTypeValues.map((categoryType) => ({
      href: buildCategoriesHref({
        type: categoryType
      }),
      label: getCategoryTypeLabel(categoryType),
      value: categoryType
    }))
  ];

  return (
    <FilterChipGroup options={options} selectedValue={selectedType} />
  );
}
