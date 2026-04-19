import { describe, expect, it } from "vitest";

import { buildDashboardFinancialSummary } from "@/features/dashboard/utils/build-dashboard-financial-summary";
import type { Account } from "@/features/accounts/types/account";
import type { Category } from "@/features/categories/types/category";
import type { Transaction } from "@/features/transactions/types/transaction";

const accounts: Account[] = [
  {
    id: "account-1",
    userId: "user-1",
    name: "Conta principal",
    type: "checking",
    initialBalance: 10_000,
    isActive: true
  },
  {
    id: "account-2",
    userId: "user-1",
    name: "Reserva",
    type: "savings",
    initialBalance: 5_000,
    isActive: true
  }
];

const categories: Category[] = [
  {
    id: "category-income",
    userId: "user-1",
    name: "Salário",
    type: "income",
    isActive: true
  },
  {
    id: "category-expense",
    userId: "user-1",
    name: "Mercado",
    type: "expense",
    isActive: true
  }
];

const transactions: Transaction[] = [
  {
    id: "transaction-1",
    userId: "user-1",
    description: "Salário abril",
    amount: 3_000,
    type: "income",
    date: new Date("2026-04-10T12:00:00.000Z"),
    competencyMonth: "2026-04",
    categoryId: "category-income",
    accountId: "account-1",
    status: "received",
    isRecurring: true
  },
  {
    id: "transaction-2",
    userId: "user-1",
    description: "Mercado abril",
    amount: 1_000,
    type: "expense",
    date: new Date("2026-04-11T12:00:00.000Z"),
    competencyMonth: "2026-04",
    categoryId: "category-expense",
    accountId: "account-1",
    status: "paid",
    isRecurring: false
  },
  {
    id: "transaction-3",
    userId: "user-1",
    description: "Freela abril",
    amount: 2_000,
    type: "income",
    date: new Date("2026-04-12T12:00:00.000Z"),
    competencyMonth: "2026-04",
    categoryId: "category-income",
    accountId: "account-2",
    status: "received",
    isRecurring: false
  },
  {
    id: "transaction-4",
    userId: "user-1",
    description: "Mercado planejado",
    amount: 700,
    type: "expense",
    date: new Date("2026-04-13T12:00:00.000Z"),
    competencyMonth: "2026-04",
    categoryId: "category-expense",
    accountId: "account-1",
    status: "planned",
    isRecurring: false
  },
  {
    id: "transaction-5",
    userId: "user-1",
    description: "Mercado março",
    amount: 500,
    type: "expense",
    date: new Date("2026-03-15T12:00:00.000Z"),
    competencyMonth: "2026-03",
    categoryId: "category-expense",
    accountId: "account-2",
    status: "paid",
    isRecurring: false
  }
];

describe("buildDashboardFinancialSummary", () => {
  it("builds balances, totals and latest transactions only from the selected competency month", () => {
    const summary = buildDashboardFinancialSummary({
      accounts,
      categories,
      transactions,
      competencyMonth: "2026-04"
    });

    expect(summary.totalCurrentBalance).toBe(19_000);
    expect(summary.monthlyIncome).toBe(5_000);
    expect(summary.monthlyExpense).toBe(1_000);
    expect(summary.monthlyResult).toBe(4_000);

    expect(summary.accountBalances).toEqual([
      expect.objectContaining({
        accountId: "account-1",
        currentBalance: 12_000
      }),
      expect.objectContaining({
        accountId: "account-2",
        currentBalance: 7_000
      })
    ]);

    expect(summary.incomeTotalsByCategory).toEqual([
      expect.objectContaining({
        categoryId: "category-income",
        totalAmount: 5_000,
        transactionCount: 2
      })
    ]);

    expect(summary.expenseTotalsByCategory).toEqual([
      expect.objectContaining({
        categoryId: "category-expense",
        totalAmount: 1_000,
        transactionCount: 1
      })
    ]);

    expect(summary.latestTransactions).toHaveLength(4);
    expect(summary.latestTransactions[0]).toEqual(
      expect.objectContaining({
        id: "transaction-4",
        accountName: "Conta principal"
      })
    );
    expect(summary.latestTransactions.some((transaction) => transaction.id === "transaction-5")).toBe(false);
  });

  it("filters only the latest transactions list when a type is selected", () => {
    const summary = buildDashboardFinancialSummary({
      accounts,
      categories,
      transactions,
      competencyMonth: "2026-04",
      latestTransactionsType: "income"
    });

    expect(summary.monthlyIncome).toBe(5_000);
    expect(summary.monthlyExpense).toBe(1_000);
    expect(summary.latestTransactions).toHaveLength(2);
    expect(summary.latestTransactions[0]).toEqual(
      expect.objectContaining({
        id: "transaction-3",
        type: "income"
      })
    );
  });
});
