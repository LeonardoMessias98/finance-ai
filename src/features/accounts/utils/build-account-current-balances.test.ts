import { describe, expect, it } from "vitest";

import type { Account, AccountType } from "@/features/accounts/types/account";
import { buildAccountsWithCurrentBalances } from "@/features/accounts/utils/build-account-current-balances";
import type { Transaction } from "@/features/transactions/types/transaction";

function createAccount(id: string, type: AccountType, initialBalance = 0): Account {
  return {
    id,
    userId: "user-1",
    name: id,
    type,
    initialBalance,
    isActive: true
  };
}

function createTransaction(input: {
  id: string;
  accountId: string;
  amount: number;
  type: Transaction["type"];
  status: Transaction["status"];
  paymentForCreditAccountId?: string;
}): Transaction {
  return {
    id: input.id,
    userId: "user-1",
    description: input.id,
    amount: input.amount,
    type: input.type,
    date: new Date("2026-05-04T12:00:00.000Z"),
    competencyMonth: "2026-05",
    accountId: input.accountId,
    paymentForCreditAccountId: input.paymentForCreditAccountId,
    status: input.status,
    isRecurring: false
  };
}

describe("buildAccountsWithCurrentBalances", () => {
  it("calculates current balance for debit accounts", () => {
    const accounts = [createAccount("debit-account", "debit", 10_000)];
    const transactions = [
      createTransaction({
        id: "income",
        accountId: "debit-account",
        amount: 5_000,
        type: "income",
        status: "received"
      }),
      createTransaction({
        id: "expense",
        accountId: "debit-account",
        amount: 2_000,
        type: "expense",
        status: "paid"
      })
    ];

    expect(buildAccountsWithCurrentBalances(accounts, transactions)[0]?.currentBalance).toBe(13_000);
  });

  it("treats legacy checking accounts as debit accounts", () => {
    const accounts = [createAccount("checking-account", "checking", 10_000)];
    const transactions = [
      createTransaction({
        id: "expense",
        accountId: "checking-account",
        amount: 2_000,
        type: "expense",
        status: "paid"
      })
    ];

    expect(buildAccountsWithCurrentBalances(accounts, transactions)[0]?.currentBalance).toBe(8_000);
  });

  it("shows a negative current balance for credit accounts with expenses", () => {
    const accounts = [createAccount("credit-account", "credit")];
    const transactions = [
      createTransaction({
        id: "credit-expense",
        accountId: "credit-account",
        amount: 50_000,
        type: "expense",
        status: "paid"
      })
    ];

    expect(buildAccountsWithCurrentBalances(accounts, transactions)[0]?.currentBalance).toBe(-50_000);
  });

  it("subtracts associated paid invoice payments from credit debt", () => {
    const accounts = [createAccount("debit-account", "debit", 100_000), createAccount("credit-account", "credit")];
    const transactions = [
      createTransaction({
        id: "credit-expense",
        accountId: "credit-account",
        amount: 50_000,
        type: "expense",
        status: "paid"
      }),
      createTransaction({
        id: "credit-payment",
        accountId: "debit-account",
        amount: 20_000,
        type: "expense",
        status: "paid",
        paymentForCreditAccountId: "credit-account"
      })
    ];

    expect(buildAccountsWithCurrentBalances(accounts, transactions)[1]?.currentBalance).toBe(-30_000);
  });

  it("shows a negative current balance for legacy credit_card accounts", () => {
    const accounts = [createAccount("legacy-credit-account", "credit_card")];
    const transactions = [
      createTransaction({
        id: "legacy-credit-expense",
        accountId: "legacy-credit-account",
        amount: 50_000,
        type: "expense",
        status: "paid"
      })
    ];

    expect(buildAccountsWithCurrentBalances(accounts, transactions)[0]?.currentBalance).toBe(-50_000);
  });
});
