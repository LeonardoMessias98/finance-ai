import { describe, expect, it } from "vitest";

import { resolveCreditPaymentMonth } from "@/features/transactions/utils/credit-payment-month";

describe("resolveCreditPaymentMonth", () => {
  it("uses the next month for credit expenses", () => {
    expect(
      resolveCreditPaymentMonth({
        transactionType: "expense",
        accountType: "credit",
        competencyMonth: "2026-05"
      })
    ).toBe("2026-06");
  });

  it("uses the next month for legacy credit_card expenses", () => {
    expect(
      resolveCreditPaymentMonth({
        transactionType: "expense",
        accountType: "credit_card",
        competencyMonth: "2026-12"
      })
    ).toBe("2027-01");
  });

  it("does not use credit payment month for debit expenses", () => {
    expect(
      resolveCreditPaymentMonth({
        transactionType: "expense",
        accountType: "checking",
        competencyMonth: "2026-05"
      })
    ).toBeUndefined();
  });

  it("does not use credit payment month for income", () => {
    expect(
      resolveCreditPaymentMonth({
        transactionType: "income",
        accountType: "credit",
        competencyMonth: "2026-05"
      })
    ).toBeUndefined();
  });
});
