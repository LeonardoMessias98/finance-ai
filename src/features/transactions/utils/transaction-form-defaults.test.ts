import { describe, expect, it } from "vitest";

import type { Account } from "@/features/accounts/types/account";
import type { Transaction } from "@/features/transactions/types/transaction";
import {
  getDefaultTransactionAccountId,
  getDefaultTransactionFormValues,
  shouldOpenAdvancedTransactionFields
} from "@/features/transactions/utils/transaction-form-defaults";

const accounts: Account[] = [
  {
    id: "507f1f77bcf86cd799439011",
    name: "Carteira",
    type: "cash",
    initialBalance: 0,
    isActive: false
  },
  {
    id: "507f1f77bcf86cd799439012",
    name: "Conta corrente",
    type: "checking",
    initialBalance: 0,
    isActive: true
  }
];

describe("transaction-form-defaults", () => {
  it("prefers the first active account for a new transaction", () => {
    expect(getDefaultTransactionAccountId(accounts)).toBe("507f1f77bcf86cd799439012");
  });

  it("keeps the existing transaction data when editing", () => {
    const transaction: Transaction = {
      id: "507f1f77bcf86cd799439099",
      description: "Salario",
      amount: 425000,
      type: "income",
      date: new Date("2026-03-15T12:00:00.000Z"),
      competencyMonth: "2026-03",
      accountId: "507f1f77bcf86cd799439011",
      status: "received",
      isRecurring: true,
      notes: "Bonus incluso"
    };

    expect(
      getDefaultTransactionFormValues({
        transaction,
        accounts,
        defaultCompetencyMonth: "2026-04"
      })
    ).toMatchObject({
      description: "Salario",
      amount: 4250,
      type: "income",
      date: "2026-03-15",
      competencyMonth: "2026-03",
      accountId: "507f1f77bcf86cd799439011",
      status: "received",
      isRecurring: true,
      notes: "Bonus incluso"
    });
  });

  it("keeps advanced fields collapsed for the default expense flow", () => {
    expect(
      shouldOpenAdvancedTransactionFields({
        type: "expense",
        date: "2026-04-17",
        competencyMonth: "2026-04",
        installmentCount: 1,
        notes: "",
        status: "paid",
        isRecurring: false
      })
    ).toBe(false);
  });

  it("opens advanced fields when the competency month differs from the date", () => {
    expect(
      shouldOpenAdvancedTransactionFields({
        type: "expense",
        date: "2026-04-17",
        competencyMonth: "2026-05",
        installmentCount: 1,
        notes: "",
        status: "paid",
        isRecurring: false
      })
    ).toBe(true);
  });
});
