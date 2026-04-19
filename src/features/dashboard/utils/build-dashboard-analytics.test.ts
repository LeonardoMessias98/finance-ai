import { describe, expect, it } from "vitest";

import { buildDashboardAnalytics, createEmptyDashboardAnalytics } from "@/features/dashboard/utils/build-dashboard-analytics";
import type { DashboardCategoryTotal } from "@/features/dashboard/types/dashboard-financial-summary";
import type { Transaction } from "@/features/transactions/types/transaction";

const allAppliedTransactions: Transaction[] = [
  {
    id: "transaction-1",
    userId: "user-1",
    description: "Salário fevereiro",
    amount: 100_000,
    type: "income",
    date: new Date("2026-02-05T12:00:00.000Z"),
    competencyMonth: "2026-02",
    accountId: "account-1",
    status: "received",
    isRecurring: true
  },
  {
    id: "transaction-2",
    userId: "user-1",
    description: "Mercado fevereiro",
    amount: 40_000,
    type: "expense",
    date: new Date("2026-02-08T12:00:00.000Z"),
    competencyMonth: "2026-02",
    categoryId: "category-food",
    accountId: "account-1",
    status: "paid",
    isRecurring: false
  },
  {
    id: "transaction-3",
    userId: "user-1",
    description: "Salário março",
    amount: 150_000,
    type: "income",
    date: new Date("2026-03-05T12:00:00.000Z"),
    competencyMonth: "2026-03",
    accountId: "account-1",
    status: "received",
    isRecurring: true
  },
  {
    id: "transaction-4",
    userId: "user-1",
    description: "Moradia março",
    amount: 70_000,
    type: "expense",
    date: new Date("2026-03-09T12:00:00.000Z"),
    competencyMonth: "2026-03",
    categoryId: "category-home",
    accountId: "account-1",
    status: "paid",
    isRecurring: false
  },
  {
    id: "transaction-5",
    userId: "user-1",
    description: "Salário abril",
    amount: 200_000,
    type: "income",
    date: new Date("2026-04-05T12:00:00.000Z"),
    competencyMonth: "2026-04",
    accountId: "account-1",
    status: "received",
    isRecurring: true
  },
  {
    id: "transaction-6",
    userId: "user-1",
    description: "Moradia abril",
    amount: 60_000,
    type: "expense",
    date: new Date("2026-04-06T12:00:00.000Z"),
    competencyMonth: "2026-04",
    categoryId: "category-home",
    accountId: "account-1",
    status: "paid",
    isRecurring: false
  },
  {
    id: "transaction-7",
    userId: "user-1",
    description: "Mercado abril",
    amount: 20_000,
    type: "expense",
    date: new Date("2026-04-10T12:00:00.000Z"),
    competencyMonth: "2026-04",
    categoryId: "category-food",
    accountId: "account-1",
    status: "paid",
    isRecurring: false
  },
  {
    id: "transaction-8",
    userId: "user-1",
    description: "Mercado abril extra",
    amount: 10_000,
    type: "expense",
    date: new Date("2026-04-15T12:00:00.000Z"),
    competencyMonth: "2026-04",
    categoryId: "category-food",
    accountId: "account-1",
    status: "paid",
    isRecurring: false
  }
];

const monthlyExpenseTransactions = allAppliedTransactions.filter(
  (transaction) => transaction.competencyMonth === "2026-04" && transaction.type === "expense"
);

const expenseTotalsByCategory: DashboardCategoryTotal[] = [
  {
    categoryId: "category-home",
    categoryName: "Moradia",
    totalAmount: 60_000,
    transactionCount: 1
  },
  {
    categoryId: "category-food",
    categoryName: "Mercado",
    totalAmount: 30_000,
    transactionCount: 2
  }
];

describe("buildDashboardAnalytics", () => {
  it("builds monthly expense insight, historical series and forecast from applied transactions", () => {
    const analytics = buildDashboardAnalytics({
      competencyMonth: "2026-04",
      allAppliedTransactions,
      monthlyExpenseTransactions,
      expenseTotalsByCategory
    });

    expect(analytics.expenseInsight).toEqual(
      expect.objectContaining({
        totalAmount: 90_000,
        transactionCount: 3,
        averagePreviousMonths: 55_000,
        averageWindowSize: 2,
        topCategoryName: "Moradia",
        topCategoryAmount: 60_000
      })
    );

    expect(analytics.expenseByCategory).toEqual([
      expect.objectContaining({
        categoryName: "Moradia",
        totalAmount: 60_000,
        shareOfTotal: 60_000 / 90_000
      }),
      expect.objectContaining({
        categoryName: "Mercado",
        totalAmount: 30_000,
        shareOfTotal: 30_000 / 90_000
      })
    ]);

    expect(analytics.monthlyHistory.map((point) => point.competencyMonth)).toEqual([
      "2025-11",
      "2025-12",
      "2026-01",
      "2026-02",
      "2026-03",
      "2026-04"
    ]);
    expect(analytics.monthlyHistory.at(-1)).toEqual(
      expect.objectContaining({
        competencyMonth: "2026-04",
        income: 200_000,
        expense: 90_000,
        result: 110_000
      })
    );

    expect(analytics.forecast).toEqual([
      expect.objectContaining({
        competencyMonth: "2026-05",
        estimatedIncome: 150_000,
        estimatedExpense: 66_667,
        estimatedResult: 83_333
      }),
      expect.objectContaining({
        competencyMonth: "2026-06",
        estimatedIncome: 150_000,
        estimatedExpense: 66_667,
        estimatedResult: 83_333
      }),
      expect.objectContaining({
        competencyMonth: "2026-07",
        estimatedIncome: 150_000,
        estimatedExpense: 66_667,
        estimatedResult: 83_333
      })
    ]);
    expect(analytics.forecastDescription).toContain("últimos 3 mês(es)");
  });

  it("creates an empty analytics state with zeroed forecast when there is no history", () => {
    const analytics = createEmptyDashboardAnalytics("2026-04");

    expect(analytics.expenseInsight.totalAmount).toBe(0);
    expect(analytics.monthlyHistory).toHaveLength(6);
    expect(analytics.forecast).toEqual([
      expect.objectContaining({
        competencyMonth: "2026-05",
        estimatedIncome: 0,
        estimatedExpense: 0
      }),
      expect.objectContaining({
        competencyMonth: "2026-06",
        estimatedIncome: 0,
        estimatedExpense: 0
      }),
      expect.objectContaining({
        competencyMonth: "2026-07",
        estimatedIncome: 0,
        estimatedExpense: 0
      })
    ]);
    expect(analytics.forecastDescription).toContain("previsão fica zerada");
  });
});
