import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardSummaryCards } from "@/features/dashboard/components/dashboard-summary-cards";
import type { DashboardFinancialSummary } from "@/features/dashboard/types/dashboard-financial-summary";

const summary: DashboardFinancialSummary = {
  competencyMonth: "2026-05",
  monthNavigationMonths: ["2026-05"],
  monthNavigationDataMonths: ["2026-05"],
  totalCurrentBalance: 10_000,
  monthlyIncome: 5_000,
  monthlyExpense: 2_000,
  monthlyResult: 3_000,
  accountBalances: [],
  creditAccountSummaries: [
    {
      accountId: "credit-account",
      accountName: "Cartão",
      accountType: "credit",
      isActive: true,
      spentAmount: 4_000,
      paidAmount: 1_500,
      openAmount: 2_500
    }
  ],
  incomeTotalsByCategory: [],
  expenseTotalsByCategory: [],
  latestTransactions: [],
  analytics: {
    expenseInsight: {
      totalAmount: 0,
      transactionCount: 0,
      averagePreviousMonths: null,
      averageWindowSize: 0
    },
    expenseByCategory: [],
    monthlyHistory: [],
    forecast: [],
    forecastDescription: ""
  }
};

describe("DashboardSummaryCards", () => {
  it("explains that credit does not affect available balance until invoice payment", () => {
    render(<DashboardSummaryCards summary={summary} />);

    expect(screen.getByText("Crédito não altera o saldo disponível até a fatura ser paga.")).toBeInTheDocument();
  });
});
