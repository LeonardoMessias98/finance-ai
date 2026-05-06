import { describe, expect, it } from "vitest";

import {
  buildCategoryExpensePieGradient,
  calculateCategoryExpenseTotal,
  getCategoryExpenseSliceColor
} from "@/components/ui/category-expense-pie-chart.helpers";
import type { CategoryExpensePieChartItem } from "@/components/ui/category-expense-pie-chart.types";

const chartData: CategoryExpensePieChartItem[] = [
  {
    categoryName: "Alimentação",
    amount: 80_000,
    percentage: 0.8
  },
  {
    categoryName: "Transporte",
    amount: 20_000,
    percentage: 0.2
  }
];

describe("categoryExpensePieChart helpers", () => {
  it("calculates the total amount", () => {
    expect(calculateCategoryExpenseTotal(chartData)).toBe(100_000);
  });

  it("builds the pie gradient from category percentages", () => {
    expect(buildCategoryExpensePieGradient(chartData)).toBe(
      "conic-gradient(hsl(var(--primary)) 0deg 288deg, hsl(var(--income)) 288deg 360deg)"
    );
  });

  it("cycles slice colors", () => {
    expect(getCategoryExpenseSliceColor(5)).toBe("hsl(var(--primary))");
  });
});
