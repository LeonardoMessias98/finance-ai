import { describe, expect, it } from "vitest";

import type { Account } from "@/features/accounts/types/account";
import { buildCreditPaymentSummary } from "@/features/transactions/utils/build-credit-payment-summary";
import type { Transaction } from "@/features/transactions/types/transaction";

const accounts: Account[] = [
  {
    id: "debit-account",
    userId: "user-1",
    name: "Conta débito",
    type: "debit",
    initialBalance: 0,
    isActive: true
  },
  {
    id: "credit-account",
    userId: "user-1",
    name: "Cartão atual",
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
];

const transactions: Transaction[] = [
  {
    id: "credit-transaction-1",
    userId: "user-1",
    description: "Compra de cartas 1/3",
    amount: 40_000,
    type: "expense",
    date: new Date("2026-05-03T12:00:00.000Z"),
    competencyMonth: "2026-05",
    creditPaymentMonth: "2026-06",
    categoryId: "category-1",
    accountId: "credit-account",
    status: "paid",
    isRecurring: false
  },
  {
    id: "credit-transaction-2",
    userId: "user-1",
    description: "Mercado",
    amount: 30_000,
    type: "expense",
    date: new Date("2026-05-04T12:00:00.000Z"),
    competencyMonth: "2026-05",
    creditPaymentMonth: "2026-06",
    categoryId: "category-1",
    accountId: "credit-account",
    status: "paid",
    isRecurring: false
  },
  {
    id: "legacy-credit-transaction",
    userId: "user-1",
    description: "Farmácia antiga",
    amount: 12_000,
    type: "expense",
    date: new Date("2026-06-01T12:00:00.000Z"),
    competencyMonth: "2026-06",
    categoryId: "category-1",
    accountId: "legacy-credit-account",
    status: "paid",
    isRecurring: false
  },
  {
    id: "debit-transaction",
    userId: "user-1",
    description: "Conta de luz",
    amount: 20_000,
    type: "expense",
    date: new Date("2026-05-05T12:00:00.000Z"),
    competencyMonth: "2026-05",
    categoryId: "category-1",
    accountId: "debit-account",
    status: "paid",
    isRecurring: false
  },
  {
    id: "other-month-credit-transaction",
    userId: "user-1",
    description: "Outra fatura",
    amount: 10_000,
    type: "expense",
    date: new Date("2026-05-06T12:00:00.000Z"),
    competencyMonth: "2026-05",
    creditPaymentMonth: "2026-07",
    categoryId: "category-1",
    accountId: "credit-account",
    status: "paid",
    isRecurring: false
  }
];

describe("buildCreditPaymentSummary", () => {
  it("calculates the invoice total by month", () => {
    const summary = buildCreditPaymentSummary({
      accounts,
      transactions,
      creditPaymentMonth: "2026-06"
    });

    expect(summary.totalAmount).toBe(82_000);
  });

  it("groups invoice transactions by credit account", () => {
    const summary = buildCreditPaymentSummary({
      accounts,
      transactions,
      creditPaymentMonth: "2026-06"
    });

    expect(summary.accountGroups).toEqual([
      expect.objectContaining({
        accountId: "legacy-credit-account",
        accountName: "Cartão antigo",
        totalAmount: 12_000
      }),
      expect.objectContaining({
        accountId: "credit-account",
        accountName: "Cartão atual",
        totalAmount: 70_000
      })
    ]);
  });

  it("lists invoice transactions", () => {
    const summary = buildCreditPaymentSummary({
      accounts,
      transactions,
      creditPaymentMonth: "2026-06"
    });

    expect(summary.transactions.map((transaction) => transaction.description)).toEqual([
      "Compra de cartas 1/3",
      "Mercado",
      "Farmácia antiga"
    ]);
    expect(summary.transactions.some((transaction) => transaction.id === "debit-transaction")).toBe(false);
    expect(summary.transactions.some((transaction) => transaction.id === "other-month-credit-transaction")).toBe(false);
  });

  it("handles legacy credit transactions without creditPaymentMonth", () => {
    const summary = buildCreditPaymentSummary({
      accounts,
      transactions,
      creditPaymentMonth: "2026-06"
    });

    expect(summary.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "legacy-credit-transaction",
          creditPaymentMonth: undefined,
          competencyMonth: "2026-06"
        })
      ])
    );
  });
});
