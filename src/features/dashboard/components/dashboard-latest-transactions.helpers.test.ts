import { describe, expect, it } from "vitest";

import { groupDashboardLatestTransactionsByAccountKind } from "@/features/dashboard/components/dashboard-latest-transactions.helpers";
import type { DashboardLatestTransaction } from "@/features/dashboard/types/dashboard-financial-summary";

function createLatestTransaction(
  id: string,
  accountType: DashboardLatestTransaction["accountType"]
): DashboardLatestTransaction {
  return {
    id,
    description: id,
    amount: 10_000,
    type: "expense",
    status: "paid",
    date: new Date("2026-05-01T12:00:00.000Z"),
    accountName: id,
    accountType
  };
}

describe("groupDashboardLatestTransactionsByAccountKind", () => {
  it("groups debit and credit transactions", () => {
    const groups = groupDashboardLatestTransactionsByAccountKind([
      createLatestTransaction("debit", "debit"),
      createLatestTransaction("credit", "credit")
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({
      key: "debit",
      title: "Débito",
      transactions: [expect.objectContaining({ id: "debit" })]
    });
    expect(groups[1]).toMatchObject({
      key: "credit",
      title: "Crédito",
      transactions: [expect.objectContaining({ id: "credit" })]
    });
  });

  it("keeps legacy credit_card accounts in the credit group", () => {
    const groups = groupDashboardLatestTransactionsByAccountKind([
      createLatestTransaction("legacy-credit-card", "credit_card")
    ]);

    expect(groups).toEqual([
      expect.objectContaining({
        key: "credit",
        transactions: [expect.objectContaining({ id: "legacy-credit-card" })]
      })
    ]);
  });

  it("omits empty account kind groups", () => {
    const groups = groupDashboardLatestTransactionsByAccountKind([
      createLatestTransaction("debit", "checking")
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.key).toBe("debit");
  });
});
