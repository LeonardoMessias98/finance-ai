import Link from "next/link";

import type { FilterChipOption } from "@/components/filters/filter-chip-group.types";
import { cn } from "@/lib/utils";

type FilterChipGroupProps<TValue extends string> = {
  options: ReadonlyArray<FilterChipOption<TValue>>;
  selectedValue?: TValue;
};

function isSelectedOption<TValue extends string>(
  optionValue: TValue | undefined,
  selectedValue: TValue | undefined
): boolean {
  if (typeof optionValue === "undefined") {
    return typeof selectedValue === "undefined";
  }

  return optionValue === selectedValue;
}

export function FilterChipGroup<TValue extends string>({
  options,
  selectedValue
}: FilterChipGroupProps<TValue>) {
  return (
    <div className="overflow-x-auto scrollbar-custom">
      <div className="flex min-w-max items-center gap-2">
        {options.map((option) => {
          const isSelected = isSelectedOption(option.value, selectedValue);

          return (
            <Link
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
              href={option.href}
              key={option.value ?? "all"}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
