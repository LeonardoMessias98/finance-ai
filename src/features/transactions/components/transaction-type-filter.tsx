import Link from "next/link";

import type { TransactionType } from "@/features/transactions/types/transaction";
import { cn } from "@/lib/utils";

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
  },
  {
    label: "Transferências",
    value: "transfer"
  }
];

export function TransactionTypeFilter({ selectedType, buildHref }: TransactionTypeFilterProps) {
  return (
    <div className="overflow-x-auto scrollbar-custom">
      <div className="flex min-w-max items-center gap-2">
        {filterOptions.map((option) => (
          <Link
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              selectedType === option.value || (!selectedType && !option.value)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
            href={buildHref(option.value)}
            key={option.value ?? "all"}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
