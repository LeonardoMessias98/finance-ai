import type { Transaction } from "@/features/transactions/types/transaction";
import { cn } from "@/lib/utils";

export function getStatusBadgeClassName(status: Transaction["status"]): string {
  if (status === "overdue") {
    return "bg-destructive/10 text-destructive";
  }

  if (status === "planned") {
    return "border border-border bg-secondary text-muted-foreground";
  }

  return "bg-primary/12 text-primary";
}

export function getTransactionCardClassName(isEditing: boolean): string {
  return cn(
    "rounded-2xl border border-border bg-background/70 p-4 transition-colors sm:p-5",
    isEditing ? "border-primary/40 bg-primary/5" : ""
  );
}

export const transactionCardStyles = {
  layout: "grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start",
  main: "min-w-0 space-y-3",
  headingRow: "flex items-start gap-3",
  typeDot: "mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full",
  content: "min-w-0 space-y-2",
  badges: "flex flex-wrap items-center gap-2",
  title: "break-words text-base font-semibold leading-snug text-foreground sm:text-lg",
  meta: "flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
  notes: "pl-5 text-sm leading-relaxed text-muted-foreground sm:pl-6",
  aside: "flex flex-col gap-3 border-t border-border/70 pt-4 md:min-w-[11rem] md:items-end md:border-t-0 md:pt-0",
  amount: "text-xl font-semibold leading-none",
  installmentNotice: "text-sm text-muted-foreground",
  actions: "flex flex-wrap gap-2 md:justify-end",
  disabledEdit: "rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground",
  editIcon: "h-4 w-4"
};

export const transactionDateGroupsStyles = {
  empty: "rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground",
  section: "space-y-3",
  header: "flex items-center gap-3",
  title: "text-sm font-medium text-muted-foreground",
  divider: "h-px flex-1 bg-border/80",
  list: "space-y-3"
};

export const transactionsListStyles = {
  header: "space-y-1",
  title: "text-xl",
  emptyContainer: "space-y-4",
  emptyState: "rounded-xl bg-secondary",
  groups: "space-y-6",
  monthlySummaryGrid: "grid gap-4 pt-6 sm:grid-cols-3",
  monthlyStat: "space-y-1",
  monthlyLabel: "text-sm text-muted-foreground",
  monthlyIncome: "text-2xl font-semibold text-income",
  monthlyExpense: "text-2xl font-semibold text-destructive"
};

export const transactionsAccountKindGroupStyles = {
  section: "space-y-4",
  toggle:
    "flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-left transition-colors hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  title: "text-base font-semibold text-foreground",
  summary: "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground",
  summaryValue: "text-foreground",
  icon: "h-4 w-4 transition-transform",
  description: "px-1 text-xs leading-relaxed text-muted-foreground",
  content: "space-y-5"
};

export function getMonthlyResultClassName(resultAmount: number): string {
  return cn("text-2xl font-semibold", resultAmount >= 0 ? "text-income" : "text-destructive");
}
