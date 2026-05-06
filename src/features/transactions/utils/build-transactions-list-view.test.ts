import { describe, expect, it } from "vitest";

import type { Account } from "@/features/accounts/types/account";
import type { Category } from "@/features/categories/types/category";
import type { Transaction } from "@/features/transactions/types/transaction";
import { buildTransactionsListView } from "@/features/transactions/utils/build-transactions-list-view";

const accounts: Account[] = [
  {
    id: "debit-account",
    userId: "user-1",
    name: "Conta",
    type: "debit",
    initialBalance: 0,
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
];

const categories: Category[] = [
  {
    id: "expense-category",
    userId: "user-1",
    name: "Mercado",
    type: "expense",
    isActive: true
  }
];

function createTransaction(input: {
  id: string;
  accountId: string;
  amount: number;
  date: string;
  paymentForCreditAccountId?: string;
}): Transaction {
  return {
    id: input.id,
    userId: "user-1",
    description: input.id,
    amount: input.amount,
    type: "expense",
    date: new Date(input.date),
    competencyMonth: "2026-05",
    categoryId: "expense-category",
    accountId: input.accountId,
    paymentForCreditAccountId: input.paymentForCreditAccountId,
    status: "paid",
    isRecurring: false
  };
}

describe("buildTransactionsListView", () => {
  it("prepares debit and credit groups with totals and date groups", () => {
    const view = buildTransactionsListView({
      accounts,
      categories,
      transactions: [
        createTransaction({
          id: "debit-payment",
          accountId: "debit-account",
          amount: 20_000,
          date: "2026-05-04T12:00:00.000Z",
          paymentForCreditAccountId: "credit-account"
        }),
        createTransaction({
          id: "credit-expense",
          accountId: "credit-account",
          amount: 30_000,
          date: "2026-05-05T12:00:00.000Z"
        })
      ]
    });

    expect(view.find((group) => group.key === "debit")).toEqual(
      expect.objectContaining({
        summaryAmount: -20_000,
        dateGroups: [
          expect.objectContaining({
            key: "2026-05-04",
            transactions: [
              expect.objectContaining({
                sourceAccount: expect.objectContaining({ id: "debit-account" }),
                paymentCreditAccount: expect.objectContaining({ id: "credit-account" }),
                category: expect.objectContaining({ id: "expense-category" })
              })
            ]
          })
        ]
      })
    );
    expect(view.find((group) => group.key === "credit")).toEqual(
      expect.objectContaining({
        summaryAmount: 30_000,
        dateGroups: [
          expect.objectContaining({
            key: "2026-05-05"
          })
        ]
      })
    );
  });
});
