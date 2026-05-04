import { describe, expect, it } from "vitest";

import { createTransactionSchema, transactionFormSchema } from "@/features/transactions/schemas/transaction-schema";

const transactionFormValues = {
  description: "Mercado",
  amount: 100,
  type: "expense",
  date: "2026-05-03",
  competencyMonth: "2026-05",
  installmentCount: 1,
  categoryId: "507f1f77bcf86cd799439011",
  accountId: "507f1f77bcf86cd799439012",
  paymentForCreditAccountId: "",
  notes: "",
  status: "paid",
  isRecurring: false
};

describe("transactionFormSchema", () => {
  it("allows 12 installments for expenses", () => {
    const result = transactionFormSchema.safeParse({
      ...transactionFormValues,
      installmentCount: 12
    });

    expect(result.success).toBe(true);
  });

  it("blocks installment count above 12", () => {
    const result = transactionFormSchema.safeParse({
      ...transactionFormValues,
      installmentCount: 13
    });

    expect(result.success).toBe(false);
  });

  it("blocks installments for income", () => {
    const result = transactionFormSchema.safeParse({
      ...transactionFormValues,
      type: "income",
      status: "received",
      installmentCount: 2
    });

    expect(result.success).toBe(false);
  });

  it("allows card payment association for expenses", () => {
    const result = transactionFormSchema.safeParse({
      ...transactionFormValues,
      paymentForCreditAccountId: "507f1f77bcf86cd799439013"
    });

    expect(result.success).toBe(true);
  });

  it("blocks card payment association for income", () => {
    const result = transactionFormSchema.safeParse({
      ...transactionFormValues,
      type: "income",
      status: "received",
      paymentForCreditAccountId: "507f1f77bcf86cd799439013"
    });

    expect(result.success).toBe(false);
  });
});

describe("createTransactionSchema", () => {
  const transactionValues = {
    userId: "507f1f77bcf86cd799439010",
    description: "Mercado",
    amount: 10_000,
    type: "expense",
    date: new Date("2026-05-03T12:00:00.000Z"),
    competencyMonth: "2026-05",
    categoryId: "507f1f77bcf86cd799439011",
    accountId: "507f1f77bcf86cd799439012",
    status: "paid",
    isRecurring: false
  };

  it("accepts creditPaymentMonth for expense transactions", () => {
    const result = createTransactionSchema.safeParse({
      ...transactionValues,
      creditPaymentMonth: "2026-06"
    });

    expect(result.success).toBe(true);
  });

  it("does not require creditPaymentMonth for debit transactions", () => {
    const result = createTransactionSchema.safeParse(transactionValues);

    expect(result.success).toBe(true);
  });

  it("does not use creditPaymentMonth for income", () => {
    const result = createTransactionSchema.safeParse({
      ...transactionValues,
      type: "income",
      status: "received",
      creditPaymentMonth: "2026-06"
    });

    expect(result.success).toBe(false);
  });

  it("keeps legacy transactions without creditPaymentMonth valid", () => {
    const result = createTransactionSchema.safeParse({
      ...transactionValues,
      description: "Compra antiga"
    });

    expect(result.success).toBe(true);
  });
});
