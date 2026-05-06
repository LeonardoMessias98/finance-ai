import type { CategoryExpensePieChartItem } from "@/components/ui/category-expense-pie-chart.types";

export const categoryExpensePieChartSliceColors = [
  "hsl(var(--primary))",
  "hsl(var(--income))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
  "hsl(var(--muted-foreground))"
];

export const categoryExpensePieChartPercentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0
});

export function calculateCategoryExpenseTotal(data: CategoryExpensePieChartItem[]): number {
  return data.reduce((sum, item) => sum + item.amount, 0);
}

export function getCategoryExpenseSliceColor(index: number): string {
  return categoryExpensePieChartSliceColors[index % categoryExpensePieChartSliceColors.length];
}

export function buildCategoryExpensePieGradient(data: CategoryExpensePieChartItem[]): string {
  let currentDegree = 0;
  const slices = data.map((item, index) => {
    const nextDegree = currentDegree + item.percentage * 360;
    const slice = `${getCategoryExpenseSliceColor(index)} ${currentDegree}deg ${nextDegree}deg`;

    currentDegree = nextDegree;

    return slice;
  });

  return `conic-gradient(${slices.join(", ")})`;
}
