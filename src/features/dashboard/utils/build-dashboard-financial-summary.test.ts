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

  it("keeps dashboard totals correct when month navigation uses compact transaction references", () => {
    const summary = buildDashboardFinancialSummary({
      accounts,
      categories,
      transactions,
      monthNavigationTransactions: [
        {
          competencyMonth: "2025-12"
        },
        {
          competencyMonth: "2026-06",
          creditPaymentMonth: "2026-07"
        }
      ],
      competencyMonth: "2026-04"
    });

    expect(summary.totalCurrentBalance).toBe(19_000);
    expect(summary.monthlyIncome).toBe(5_000);
    expect(summary.monthlyExpense).toBe(1_000);
    expect(summary.monthlyResult).toBe(4_000);
    expect(summary.monthNavigationMonths).toEqual([
      "2025-12",
      "2026-02",
      "2026-03",
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07"
    ]);
    expect(summary.monthNavigationDataMonths).toEqual(["2025-12", "2026-06", "2026-07"]);
  });

  it("includes debit accounts in the available balance", () => {
    const summary = buildDashboardFinancialSummary({
      accounts: [
        {
          id: "debit-account",
          userId: "user-1",
          name: "Conta débito",
          type: "debit",
          initialBalance: 10_000,
          isActive: true
        }
      ],
      categories,
      transactions: [
        {
          id: "income-1",
          userId: "user-1",
          description: "Entrada",
          amount: 5_000,
          type: "income",
          date: new Date("2026-04-10T12:00:00.000Z"),
          competencyMonth: "2026-04",
          categoryId: "category-income",
          accountId: "debit-account",
          status: "received",
          isRecurring: false
        },
        {
          id: "expense-1",
          userId: "user-1",
          description: "Saída",
          amount: 2_000,
          type: "expense",
          date: new Date("2026-04-11T12:00:00.000Z"),
          competencyMonth: "2026-04",
          categoryId: "category-expense",
          accountId: "debit-account",
          status: "paid",
          isRecurring: false
        }
      ],
      competencyMonth: "2026-04"
    });

    expect(summary.totalCurrentBalance).toBe(13_000);
  });

  it("reduces available balance with paid expense in debit account", () => {
    const summary = buildDashboardFinancialSummary({
      accounts: [
        {
          id: "debit-account",
          userId: "user-1",
          name: "Conta débito",
          type: "debit",
          initialBalance: 10_000,
          isActive: true
        }
      ],
      categories,
      transactions: [
        {
          id: "debit-expense",
          userId: "user-1",
          description: "Despesa no débito",
          amount: 3_000,
          type: "expense",
          date: new Date("2026-04-11T12:00:00.000Z"),
          competencyMonth: "2026-04",
          categoryId: "category-expense",
          accountId: "debit-account",
          status: "paid",
          isRecurring: false
        }
      ],
      competencyMonth: "2026-04"
    });

    expect(summary.totalCurrentBalance).toBe(7_000);
    expect(summary.accountBalances).toEqual([
      expect.objectContaining({
        accountId: "debit-account",
        currentBalance: 7_000
      })
    ]);
  });

  it("treats legacy non-credit accounts as debit balance accounts", () => {
    const summary = buildDashboardFinancialSummary({
      accounts: [
        {
          id: "checking-account",
          userId: "user-1",
          name: "Conta antiga",
          type: "checking",
          initialBalance: 10_000,
          isActive: true
        },
        {
          id: "investment-account",
          userId: "user-1",
          name: "Investimento antigo",
          type: "investment",
          initialBalance: 20_000,
          isActive: true
        }
      ],
      categories,
      transactions: [],
      competencyMonth: "2026-04"
    });

    expect(summary.totalCurrentBalance).toBe(30_000);
    expect(summary.accountBalances.map((account) => account.accountId)).toEqual([
      "checking-account",
      "investment-account"
    ]);
  });

  it("does not include credit and legacy credit_card accounts in available balance", () => {
    const summary = buildDashboardFinancialSummary({
      accounts: [
        {
          id: "credit-account",
          userId: "user-1",
          name: "Cartão novo",
          type: "credit",
          initialBalance: 50_000,
          isActive: true
        },
        {
          id: "legacy-credit-account",
          userId: "user-1",
          name: "Cartão antigo",
          type: "credit_card",
          initialBalance: 30_000,
          isActive: true
        }
      ],
      categories,
      transactions: [],
      competencyMonth: "2026-04"
    });

    expect(summary.totalCurrentBalance).toBe(0);
    expect(summary.accountBalances).toEqual([]);
    expect(summary.creditAccountSummaries.map((account) => account.accountId)).toEqual([
      "legacy-credit-account",
      "credit-account"
    ]);
  });

  it("keeps credit expenses out of the home available balance", () => {
    const summary = buildDashboardFinancialSummary({
      accounts: [
        {
          id: "debit-account",
          userId: "user-1",
          name: "Conta débito",
          type: "debit",
          initialBalance: 10_000,
          isActive: true
        },
        {
          id: "credit-account",
          userId: "user-1",
          name: "Cartão",
          type: "credit",
          initialBalance: 0,
          isActive: true
        }
      ],
      categories,
      transactions: [
        {
          id: "credit-expense",
          userId: "user-1",
          description: "Compra no cartão",
          amount: 4_000,
          type: "expense",
          date: new Date("2026-04-10T12:00:00.000Z"),
          competencyMonth: "2026-04",
          categoryId: "category-expense",
          accountId: "credit-account",
          status: "paid",
          isRecurring: false
        },
        {
          id: "credit-payment",
          userId: "user-1",
          description: "Pagamento do cartão",
          amount: 1_500,
          type: "expense",
          date: new Date("2026-04-12T12:00:00.000Z"),
          competencyMonth: "2026-04",
          categoryId: "category-expense",
          accountId: "debit-account",
          paymentForCreditAccountId: "credit-account",
          status: "paid",
          isRecurring: false
        }
      ],
      competencyMonth: "2026-04"
    });

    expect(summary.totalCurrentBalance).toBe(8_500);
    expect(summary.monthlyExpense).toBe(1_500);
    expect(summary.monthlyResult).toBe(-1_500);
    expect(summary.creditAccountSummaries).toEqual([
      expect.objectContaining({
        accountId: "credit-account",
        spentAmount: 4_000,
        paidAmount: 1_500,
        openAmount: 2_500
      })
    ]);
  });

  it("does not reduce available balance or monthly expense with a credit expense", () => {
    const summary = buildDashboardFinancialSummary({
      accounts: [
        {
          id: "debit-account",
          userId: "user-1",
          name: "Conta débito",
          type: "debit",
          initialBalance: 10_000,
          isActive: true
        },
        {
          id: "credit-account",
          userId: "user-1",
          name: "Cartão",
          type: "credit",
          initialBalance: 0,
          isActive: true
        }
      ],
      categories,
      transactions: [
        {
          id: "credit-expense",
          userId: "user-1",
          description: "Compra no cartão",
          amount: 4_000,
          type: "expense",
          date: new Date("2026-04-10T12:00:00.000Z"),
          competencyMonth: "2026-04",
          categoryId: "category-expense",
          accountId: "credit-account",
          status: "paid",
          isRecurring: false
        }
      ],
      competencyMonth: "2026-04"
    });

    expect(summary.totalCurrentBalance).toBe(10_000);
    expect(summary.monthlyExpense).toBe(0);
    expect(summary.monthlyResult).toBe(0);
    expect(summary.accountBalances).toEqual([
      expect.objectContaining({
        accountId: "debit-account",
        currentBalance: 10_000
      })
    ]);
    expect(summary.creditAccountSummaries).toEqual([
      expect.objectContaining({
        accountId: "credit-account",
        spentAmount: 4_000,
        openAmount: 4_000
      })
    ]);
  });

  it("reduces available balance when credit invoice payment leaves a debit account", () => {
    const summary = buildDashboardFinancialSummary({
      accounts: [
        {
          id: "debit-account",
          userId: "user-1",
          name: "Conta débito",
          type: "debit",
          initialBalance: 10_000,
          isActive: true
        },
        {
          id: "credit-account",
          userId: "user-1",
          name: "Cartão",
          type: "credit",
          initialBalance: 0,
          isActive: true
        }
      ],
      categories,
      transactions: [
        {
          id: "credit-payment",
          userId: "user-1",
          description: "Pagamento da fatura",
          amount: 3_000,
          type: "expense",
          date: new Date("2026-04-12T12:00:00.000Z"),
          competencyMonth: "2026-04",
          categoryId: "category-expense",
          accountId: "debit-account",
          paymentForCreditAccountId: "credit-account",
          status: "paid",
          isRecurring: false
        }
      ],
      competencyMonth: "2026-04"
    });

    expect(summary.totalCurrentBalance).toBe(7_000);
    expect(summary.accountBalances).toEqual([
      expect.objectContaining({
        accountId: "debit-account",
        currentBalance: 7_000
      })
    ]);
    expect(summary.creditAccountSummaries).toEqual([
      expect.objectContaining({
        accountId: "credit-account",
        paidAmount: 3_000
      })
    ]);
  });

  it("keeps legacy credit_card expenses out of available balance", () => {
    const summary = buildDashboardFinancialSummary({
      accounts: [
        {
          id: "debit-account",
          userId: "user-1",
          name: "Conta débito",
          type: "debit",
          initialBalance: 10_000,
          isActive: true
        },
        {
          id: "legacy-credit-account",
          userId: "user-1",
          name: "Cartão antigo",
          type: "credit_card",
          initialBalance: 50_000,
          isActive: true
        }
      ],
      categories,
      transactions: [
        {
          id: "legacy-credit-expense",
          userId: "user-1",
          description: "Compra no cartão antigo",
          amount: 4_000,
          type: "expense",
          date: new Date("2026-04-10T12:00:00.000Z"),
          competencyMonth: "2026-04",
          categoryId: "category-expense",
          accountId: "legacy-credit-account",
          status: "paid",
          isRecurring: false
        }
      ],
      competencyMonth: "2026-04"
    });

    expect(summary.totalCurrentBalance).toBe(10_000);
    expect(summary.monthlyExpense).toBe(0);
    expect(summary.monthlyResult).toBe(0);
    expect(summary.accountBalances.map((account) => account.accountId)).toEqual(["debit-account"]);
    expect(summary.creditAccountSummaries).toEqual([
      expect.objectContaining({
        accountId: "legacy-credit-account",
        spentAmount: 4_000,
        openAmount: 4_000
      })
    ]);
  });

  it("keeps credit transactions visible in latest transactions without changing available balance", () => {
    const summary = buildDashboardFinancialSummary({
      accounts: [
        {
          id: "debit-account",
          userId: "user-1",
          name: "Conta débito",
          type: "debit",
          initialBalance: 10_000,
          isActive: true
        },
        {
          id: "credit-account",
          userId: "user-1",
          name: "Cartão",
          type: "credit",
          initialBalance: 0,
          isActive: true
        },
        {
          id: "legacy-credit-account",
          userId: "user-1",
          name: "Cartão antigo",
          type: "credit_card",
          initialBalance: 0,
          isActive: true
        }
      ],
      categories,
      transactions: [
        {
          id: "debit-expense",
          userId: "user-1",
          description: "Mercado débito",
          amount: 2_000,
          type: "expense",
          date: new Date("2026-04-10T12:00:00.000Z"),
          competencyMonth: "2026-04",
          categoryId: "category-expense",
          accountId: "debit-account",
          status: "paid",
          isRecurring: false
        },
        {
          id: "credit-expense",
          userId: "user-1",
          description: "Compra crédito",
          amount: 4_000,
          type: "expense",
          date: new Date("2026-04-11T12:00:00.000Z"),
          competencyMonth: "2026-04",
          categoryId: "category-expense",
          accountId: "credit-account",
          status: "paid",
          isRecurring: false
        },
        {
          id: "legacy-credit-expense",
          userId: "user-1",
          description: "Compra cartão antigo",
          amount: 3_000,
          type: "expense",
          date: new Date("2026-04-12T12:00:00.000Z"),
          competencyMonth: "2026-04",
          categoryId: "category-expense",
          accountId: "legacy-credit-account",
          status: "paid",
          isRecurring: false
        }
      ],
      competencyMonth: "2026-04"
    });

    expect(summary.totalCurrentBalance).toBe(8_000);
    expect(summary.monthlyExpense).toBe(2_000);
    expect(summary.monthlyResult).toBe(-2_000);
    expect(summary.latestTransactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "debit-expense",
          accountType: "debit"
        }),
        expect.objectContaining({
          id: "credit-expense",
          accountType: "credit"
        }),
        expect.objectContaining({
          id: "legacy-credit-expense",
          accountType: "credit_card"
        })
      ])
    );
  });
});
