import { describe, expect, it } from "vitest";

import { buildInstallmentTransactions } from "@/features/transactions/utils/build-installment-transactions";
import type { CreateTransactionInput } from "@/features/transactions/types/transaction";

describe("buildInstallmentTransactions", () => {
  const baseTransaction: CreateTransactionInput = {
    userId: "user-1",
    description: "Mercado",
    amount: 10_000,
    type: "expense",
    date: new Date("2026-01-31T12:00:00.000Z"),
    competencyMonth: "2026-01",
    categoryId: "507f1f77bcf86cd799439011",
    accountId: "507f1f77bcf86cd799439012",
    status: "paid"
  };

  it("keeps a 1x installment as a single transaction", () => {
    const result = buildInstallmentTransactions({
      ...baseTransaction,
      installment: {
        current: 1,
        total: 1
      }
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      description: "Mercado",
      amount: 10_000,
      status: "paid",
      installment: {
        current: 1,
        total: 1
      }
    });
  });

  it("splits an expense into future installments with matching competency months", () => {
    const transaction: CreateTransactionInput = {
      ...baseTransaction,
      amount: 10_001,
      description: "Notebook parcelado",
      installment: {
        current: 1,
        total: 3
      }
    };

    const result = buildInstallmentTransactions(transaction);

    expect(result).toHaveLength(3);
    expect(result.map((item) => item.amount)).toEqual([3333, 3333, 3335]);
    expect(result.map((item) => item.description)).toEqual([
      "Notebook parcelado 1/3",
      "Notebook parcelado 2/3",
      "Notebook parcelado 3/3"
    ]);
    expect(result.map((item) => item.installment)).toEqual([
      { current: 1, total: 3 },
      { current: 2, total: 3 },
      { current: 3, total: 3 }
    ]);
    expect(result.map((item) => item.competencyMonth)).toEqual(["2026-01", "2026-02", "2026-03"]);
    expect(result.map((item) => item.status)).toEqual(["paid", "planned", "planned"]);
    expect(result[1]?.date.toISOString()).toBe("2026-02-28T12:00:00.000Z");
  });

  it("creates credit installments with monthly competency months", () => {
    const result = buildInstallmentTransactions({
      ...baseTransaction,
      description: "Compra de cartas",
      date: new Date("2026-05-03T12:00:00.000Z"),
      competencyMonth: "2026-05",
      creditPaymentMonth: "2026-06",
      installment: {
        current: 1,
        total: 3
      }
    });

    expect(result.map((item) => item.description)).toEqual([
      "Compra de cartas 1/3",
      "Compra de cartas 2/3",
      "Compra de cartas 3/3"
    ]);
    expect(result.map((item) => item.competencyMonth)).toEqual(["2026-05", "2026-06", "2026-07"]);
  });

  it("creates creditPaymentMonth in the month after each installment competency", () => {
    const result = buildInstallmentTransactions({
      ...baseTransaction,
      date: new Date("2026-05-03T12:00:00.000Z"),
      competencyMonth: "2026-05",
      creditPaymentMonth: "2026-06",
      installment: {
        current: 1,
        total: 3
      }
    });

    expect(result.map((item) => item.creditPaymentMonth)).toEqual(["2026-06", "2026-07", "2026-08"]);
  });

  it("supports 12 installments", () => {
    const result = buildInstallmentTransactions({
      ...baseTransaction,
      amount: 12_000,
      installment: {
        current: 1,
        total: 12
      }
    });

    expect(result).toHaveLength(12);
    expect(result.at(-1)).toMatchObject({
      description: "Mercado 12/12",
      amount: 1000,
      status: "planned",
      installment: {
        current: 12,
        total: 12
      }
    });
  });

  it("adjusts cent differences in the last installment", () => {
    const result = buildInstallmentTransactions({
      ...baseTransaction,
      amount: 10_000,
      installment: {
        current: 1,
        total: 3
      }
    });

    expect(result.map((item) => item.amount)).toEqual([3333, 3333, 3334]);
  });

  it("creates future installments as planned", () => {
    const result = buildInstallmentTransactions({
      ...baseTransaction,
      installment: {
        current: 1,
        total: 3
      }
    });

    expect(result.map((item) => item.status)).toEqual(["paid", "planned", "planned"]);
  });
});
