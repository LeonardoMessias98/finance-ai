import { cn } from "@/lib/utils";

export const monthScrollerStyles = {
  navigation: "-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0",
  list: "flex min-w-max items-center gap-2 py-1",
  dataIndicator: "mt-1 h-1.5 w-1.5 rounded-full bg-current"
};

export function getMonthButtonClassName(isSelected: boolean): string {
  return cn(
    "inline-flex min-w-[5.5rem] flex-col items-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
    isSelected
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
  );
}
