import { describe, expect, it } from "vitest";

import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import { buildMonthlyExpenseComparison } from "@/features/dashboard/components/monthly-expense-card.helpers";
import type { DashboardExpenseInsight } from "@/features/dashboard/types/dashboard-analytics";

function createExpenseInsight(overrides: Partial<DashboardExpenseInsight> = {}): DashboardExpenseInsight {
  return {
    totalAmount: 120_000,
    transactionCount: 3,
    averagePreviousMonths: 100_000,
    averageWindowSize: 3,
    ...overrides
  };
}

describe("buildMonthlyExpenseComparison", () => {
  it("returns the delta against previous month average", () => {
    expect(buildMonthlyExpenseComparison(createExpenseInsight())).toEqual({
      averageDelta: 20_000,
      averageDeltaText: `Acima da média recente em ${formatAccountBalanceFromCents(20_000)}`,
      averageLabel: "Média dos 3 mês(es) anteriores",
      averageValueText: formatAccountBalanceFromCents(100_000)
    });
  });

  it("returns an empty-state comparison without previous data", () => {
    expect(buildMonthlyExpenseComparison(createExpenseInsight({ averagePreviousMonths: null }))).toEqual({
      averageDelta: null,
      averageDeltaText: null,
      averageLabel: "Sem base anterior suficiente",
      averageValueText: "Ainda sem histórico"
    });
  });
});
