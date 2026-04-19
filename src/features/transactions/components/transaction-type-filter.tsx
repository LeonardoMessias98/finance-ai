import { FilterChipGroup } from "@/components/filters/filter-chip-group";
import type { FilterChipOption } from "@/components/filters/filter-chip-group.types";
import type { TransactionType } from "@/features/transactions/types/transaction";

type TransactionTypeFilterProps = {
  selectedType?: TransactionType;
  buildHref: (type?: TransactionType) => string;
};

const filterOptions: Array<{
  label: string;
  value?: TransactionType;
}> = [
  {
    label: "Todas"
  },
  {
    label: "Receitas",
    value: "income"
  },
  {
    label: "Despesas",
    value: "expense"
  }
];

export function TransactionTypeFilter({ selectedType, buildHref }: TransactionTypeFilterProps) {
  const options: ReadonlyArray<FilterChipOption<TransactionType>> = filterOptions.map((option) => ({
    href: buildHref(option.value),
    label: option.label,
    value: option.value
  }));

  return (
    <FilterChipGroup options={options} selectedValue={selectedType} />
  );
}
