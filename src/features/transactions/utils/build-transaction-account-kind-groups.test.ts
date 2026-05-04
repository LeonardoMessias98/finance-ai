import { describe, expect, it } from "vitest";

import type { Account, AccountType } from "@/features/accounts/types/account";
import type { Transaction, TransactionType } from "@/features/transactions/types/transaction";
import { buildTransactionAccountKindGroups } from "@/features/transactions/utils/build-transaction-account-kind-groups";

function createAccount(id: string, type: AccountType): Account {
  return {
    id,
    userId: "user-1",
    name: id,
    type,
    initialBalance: 0,
    isActive: true
  };
}

function createTransaction(id: string, accountId: string, type: TransactionType, amount: number): Transaction {
  return {
    id,
    userId: "user-1",
    description: id,
    amount,
    type,
    date: new Date("2026-05-04T12:00:00.000Z"),
    competencyMonth: "2026-05",
    accountId,
    status: type === "income" ? "received" : "paid",
    isRecurring: false
  };
}

function getDebitSummaryAmount(transactions: Transaction[], accounts: Account[]): number {
  const debitGroup = buildTransactionAccountKindGroups(transactions, accounts).find((group) => group.key === "debit");

  return debitGroup?.summaryAmount ?? 0;
}

describe("buildTransactionAccountKindGroups", () => {
  it("calculates 1000 income and 1000 expense as zero debit result", () => {
    const accounts = [createAccount("debit-account", "debit")];
    const transactions = [
      createTransaction("income", "debit-account", "income", 100_000),
      createTransaction("expense", "debit-account", "expense", 100_000)
    ];

    expect(getDebitSummaryAmount(transactions, accounts)).toBe(0);
  });

  it("calculates only income as a positive debit result", () => {
    const accounts = [createAccount("debit-account", "debit")];
    const transactions = [createTransaction("income", "debit-account", "income", 100_000)];

    expect(getDebitSummaryAmount(transactions, accounts)).toBe(100_000);
  });

  it("calculates only expense as a negative debit result", () => {
    const accounts = [createAccount("debit-account", "debit")];
    const transactions = [createTransaction("expense", "debit-account", "expense", 100_000)];

    expect(getDebitSummaryAmount(transactions, accounts)).toBe(-100_000);
  });

  it("does not include credit transactions in the debit summary", () => {
    const accounts = [createAccount("debit-account", "debit"), createAccount("credit-account", "credit")];
    const transactions = [
      createTransaction("income", "debit-account", "income", 100_000),
      createTransaction("expense", "debit-account", "expense", 100_000),
      createTransaction("credit-expense", "credit-account", "expense", 250_000)
    ];
    const groups = buildTransactionAccountKindGroups(transactions, accounts);

    expect(groups.find((group) => group.key === "debit")?.summaryAmount).toBe(0);
    expect(groups.find((group) => group.key === "credit")?.summaryAmount).toBe(250_000);
  });

  it("lists credit expenses in the credit group for visual history", () => {
    const accounts = [createAccount("credit-account", "credit")];
    const transactions = [createTransaction("credit-expense", "credit-account", "expense", 250_000)];
    const creditGroup = buildTransactionAccountKindGroups(transactions, accounts).find((group) => group.key === "credit");

    expect(creditGroup?.transactions).toEqual([expect.objectContaining({ id: "credit-expense" })]);
    expect(creditGroup?.summaryAmount).toBe(250_000);
  });

  it("calculates the credit total using only credit expenses", () => {
    const accounts = [createAccount("credit-account", "credit")];
    const transactions = [
      createTransaction("legacy-credit-income", "credit-account", "income", 100_000),
      createTransaction("credit-expense", "credit-account", "expense", 250_000)
    ];
    const creditGroup = buildTransactionAccountKindGroups(transactions, accounts).find((group) => group.key === "credit");

    expect(creditGroup?.transactions).toHaveLength(2);
    expect(creditGroup?.summaryAmount).toBe(250_000);
  });

  it("does not break when legacy credit income exists", () => {
    const accounts = [createAccount("credit-account", "credit")];
    const transactions = [createTransaction("legacy-credit-income", "credit-account", "income", 100_000)];
    const groups = buildTransactionAccountKindGroups(transactions, accounts);

    expect(groups.find((group) => group.key === "debit")?.summaryAmount).toBe(0);
    expect(groups.find((group) => group.key === "credit")?.summaryAmount).toBe(0);
  });

  it("does not include legacy credit_card transactions in the debit summary", () => {
    const accounts = [createAccount("debit-account", "debit"), createAccount("legacy-credit", "credit_card")];
    const transactions = [
      createTransaction("income", "debit-account", "income", 100_000),
      createTransaction("expense", "debit-account", "expense", 100_000),
      createTransaction("legacy-credit-expense", "legacy-credit", "expense", 250_000)
    ];

    expect(getDebitSummaryAmount(transactions, accounts)).toBe(0);
  });

  it("treats checking, savings, cash and investment as debit accounts", () => {
    const legacyDebitTypes: AccountType[] = ["checking", "savings", "cash", "investment"];
    const accounts = legacyDebitTypes.map((type) => createAccount(`${type}-account`, type));
    const transactions = legacyDebitTypes.map((type) =>
      createTransaction(`${type}-expense`, `${type}-account`, "expense", 100_000)
    );
    const debitGroup = buildTransactionAccountKindGroups(transactions, accounts).find((group) => group.key === "debit");

    expect(debitGroup?.summaryAmount).toBe(-400_000);
    expect(debitGroup?.transactions).toHaveLength(4);
  });
});
