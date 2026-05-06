import { cn } from "@/lib/utils";

export const dashboardSummaryCardsStyles = {
  container: "space-y-4",
  summaryGrid: "grid gap-4 pt-5 sm:grid-cols-3",
  stat: "space-y-1",
  label: "text-sm text-muted-foreground",
  incomeValue: "text-2xl font-semibold text-income",
  expenseValue: "text-2xl font-semibold text-destructive",
  foregroundValue: "text-2xl font-semibold text-foreground",
  creditContent: "space-y-4 pt-5",
  creditHint: "text-xs leading-relaxed text-muted-foreground",
  creditGrid: "grid gap-4 sm:grid-cols-3"
};

export function getDashboardResultClassName(resultAmount: number): string {
  return cn(
    "text-2xl font-semibold",
    resultAmount > 0 ? "text-income" : resultAmount < 0 ? "text-destructive" : "text-foreground"
  );
}
