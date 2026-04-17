import { describe, expect, it } from "vitest";

import { calculateBudgetListItem } from "@/features/budgets/utils/budget-consumption";
import type { Budget } from "@/features/budgets/types/budget";

const budget: Budget = {
  id: "budget-1",
  competencyMonth: "2026-04",
  categoryId: "category-1",
  limitAmount: 10_000,
  alertThresholds: [80, 100]
};

describe("calculateBudgetListItem", () => {
  it("marks a budget as warning after 80 percent", () => {
    const result = calculateBudgetListItem({
      budget,
      categoryName: "Mercado",
      categoryIsActive: true,
      spentAmount: 8_500
    });

    expect(result.usedPercentage).toBe(85);
    expect(result.remainingAmount).toBe(1_500);
    expect(result.consumptionStatus).toBe("warning");
  });

  it("marks a budget as exceeded above 100 percent", () => {
    const result = calculateBudgetListItem({
      budget,
      categoryName: "Mercado",
      categoryIsActive: true,
      spentAmount: 12_500
    });

    expect(result.usedPercentage).toBe(125);
    expect(result.remainingAmount).toBe(-2_500);
    expect(result.progressPercentage).toBe(100);
    expect(result.consumptionStatus).toBe("exceeded");
  });
});
