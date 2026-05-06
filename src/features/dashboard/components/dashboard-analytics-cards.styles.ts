import { cn } from "@/lib/utils";

export const dashboardAnalyticsCardsStyles = {
  headerCompact: "space-y-2",
  headerSpacious: "space-y-4",
  title: "text-xl",
  content: "space-y-5",
  forecastContent: "space-y-4",
  totalBlock: "space-y-2",
  totalValue: "text-3xl font-semibold tracking-tight text-foreground",
  mutedText: "text-sm text-muted-foreground",
  metricPanel: "rounded-xl border border-border bg-secondary/70 p-4",
  metricLabel: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
  metricValue: "mt-2 text-lg font-semibold text-foreground",
  metricHint: "mt-1 text-sm text-muted-foreground",
  legend: "flex flex-wrap gap-4 text-sm",
  legendItem: "flex items-center gap-2",
  legendDot: "inline-block h-2.5 w-2.5 rounded-full"
};

export function getDeltaClassName(value: number): string {
  return cn("mt-1 text-sm", value > 0 ? "text-destructive" : value < 0 ? "text-income" : "text-muted-foreground");
}

export function getProjectedResultClassName(value: number): string {
  return cn("mt-2 text-lg font-semibold", value > 0 ? "text-income" : value < 0 ? "text-destructive" : "text-foreground");
}
