import { describe, expect, it } from "vitest";

import { calculateDashboardCreditTotals } from "@/features/dashboard/components/dashboard-summary-cards.helpers";
import type { DashboardCreditAccountSummary } from "@/features/dashboard/types/dashboard-financial-summary";

const creditAccountSummaries: DashboardCreditAccountSummary[] = [
  {
    accountId: "credit-account-1",
    accountName: "Cartão principal",
    accountType: "credit",
    isActive: true,
    spentAmount: 100_000,
    paidAmount: 40_000,
    openAmount: 60_000
  },
  {
    accountId: "credit-account-2",
    accountName: "Cartão antigo",
    accountType: "credit_card",
    isActive: true,
    spentAmount: 80_000,
    paidAmount: 20_000,
    openAmount: 60_000
  }
];

describe("calculateDashboardCreditTotals", () => {
  it("sums spent, paid and open credit amounts", () => {
    expect(calculateDashboardCreditTotals(creditAccountSummaries)).toEqual({
      spentAmount: 180_000,
      paidAmount: 60_000,
      openAmount: 120_000
    });
  });

  it("returns zeroed totals without credit summaries", () => {
    expect(calculateDashboardCreditTotals([])).toEqual({
      spentAmount: 0,
      paidAmount: 0,
      openAmount: 0
    });
  });
});
