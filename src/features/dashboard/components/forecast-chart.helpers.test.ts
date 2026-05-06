import { describe, expect, it } from "vitest";

import { calculateProjectedAverageResult } from "@/features/dashboard/components/forecast-chart.helpers";
import type { DashboardForecastSeriesPoint } from "@/features/dashboard/types/dashboard-analytics";

const forecastPoints: DashboardForecastSeriesPoint[] = [
  {
    competencyMonth: "2026-06",
    shortLabel: "Jun/26",
    estimatedIncome: 500_000,
    estimatedExpense: 350_000,
    estimatedResult: 150_000
  },
  {
    competencyMonth: "2026-07",
    shortLabel: "Jul/26",
    estimatedIncome: 500_000,
    estimatedExpense: 400_001,
    estimatedResult: 99_999
  }
];

describe("calculateProjectedAverageResult", () => {
  it("returns the rounded average estimated result", () => {
    expect(calculateProjectedAverageResult(forecastPoints)).toBe(125_000);
  });

  it("returns zero without forecast points", () => {
    expect(calculateProjectedAverageResult([])).toBe(0);
  });
});
