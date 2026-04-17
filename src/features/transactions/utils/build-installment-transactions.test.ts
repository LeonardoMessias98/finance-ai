import { describe, expect, it } from "vitest";

import { buildInstallmentTransactions } from "@/features/transactions/utils/build-installment-transactions";
import type { CreateTransactionInput } from "@/features/transactions/types/transaction";

describe("buildInstallmentTransactions", () => {
  it("splits an expense into future installments with matching competency months", () => {
    const transaction: CreateTransactionInput = {
      description: "Notebook parcelado",
      amount: 10_001,
      type: "expense",
      date: new Date("2026-01-31T12:00:00.000Z"),
      competencyMonth: "2026-01",
      categoryId: "507f1f77bcf86cd799439011",
      accountId: "507f1f77bcf86cd799439012",
      status: "paid",
      installment: {
        current: 1,
        total: 3
      }
    };

    const result = buildInstallmentTransactions(transaction);

    expect(result).toHaveLength(3);
    expect(result.map((item) => item.amount)).toEqual([3334, 3334, 3333]);
    expect(result.map((item) => item.installment)).toEqual([
      { current: 1, total: 3 },
      { current: 2, total: 3 },
      { current: 3, total: 3 }
    ]);
    expect(result.map((item) => item.competencyMonth)).toEqual(["2026-01", "2026-02", "2026-03"]);
    expect(result.map((item) => item.status)).toEqual(["paid", "planned", "planned"]);
    expect(result[1]?.date.toISOString()).toBe("2026-02-28T12:00:00.000Z");
  });
});
