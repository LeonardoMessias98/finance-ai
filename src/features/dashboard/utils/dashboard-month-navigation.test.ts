import { describe, expect, it } from "vitest";

import {
  buildDashboardMonthNavigationDataMonths,
  buildDashboardMonthNavigationMonths,
  formatDashboardMonthNavigationLabel,
  listDashboardDataCompetencyMonths
} from "@/features/dashboard/utils/dashboard-month-navigation";
import type { Transaction } from "@/features/transactions/types/transaction";

function createTransaction(input: {
  id: string;
  competencyMonth: string;
  creditPaymentMonth?: string;
}): Transaction {
  return {
    id: input.id,
    userId: "user-1",
    description: input.id,
    amount: 10_000,
    type: "expense",
    date: new Date(`${input.competencyMonth}-10T12:00:00.000Z`),
    competencyMonth: input.competencyMonth,
    creditPaymentMonth: input.creditPaymentMonth,
    accountId: "account-1",
    status: "paid",
    isRecurring: false
  };
}

describe("dashboard-month-navigation", () => {
  it("formats short month labels", () => {
    expect(formatDashboardMonthNavigationLabel("2026-04")).toBe("Abril/26");
    expect(formatDashboardMonthNavigationLabel("2026-06")).toBe("Junho/26");
  });

  it("shows months with movement and credit invoice months", () => {
    expect(
      buildDashboardMonthNavigationMonths({
        competencyMonth: "2026-05",
        transactions: [
          createTransaction({
            id: "march-movement",
            competencyMonth: "2026-03"
          }),
          createTransaction({
            id: "credit-invoice",
            competencyMonth: "2026-07",
            creditPaymentMonth: "2026-08"
          })
        ]
      })
    ).toEqual(["2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"]);
  });

  it("falls back to months around the selected month without movement", () => {
    expect(
      buildDashboardMonthNavigationMonths({
        competencyMonth: "2026-05",
        transactions: []
      })
    ).toEqual(["2026-03", "2026-04", "2026-05", "2026-06", "2026-07"]);
  });

  it("lists only months that have movement or credit invoice reference", () => {
    expect(
      buildDashboardMonthNavigationDataMonths([
        createTransaction({
          id: "march-movement",
          competencyMonth: "2026-03"
        }),
        createTransaction({
          id: "credit-invoice",
          competencyMonth: "2026-07",
          creditPaymentMonth: "2026-08"
        })
      ])
    ).toEqual(["2026-03", "2026-07", "2026-08"]);
  });

  it("lists only the dashboard data window needed for current summaries and analytics", () => {
    expect(listDashboardDataCompetencyMonths("2026-05")).toEqual([
      "2025-12",
      "2026-01",
      "2026-02",
      "2026-03",
      "2026-04",
      "2026-05"
    ]);
  });
});
