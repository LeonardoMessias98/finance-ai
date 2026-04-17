import { describe, expect, it } from "vitest";

import {
  formatTransactionCurrencyInput,
  parseTransactionCurrencyInput
} from "@/features/transactions/utils/transaction-currency";

describe("transaction-currency", () => {
  it("formats transaction amounts as BRL", () => {
    expect(formatTransactionCurrencyInput(1234.56)).toBe("R$ 1.234,56");
  });

  it("keeps zero formatted in BRL", () => {
    expect(formatTransactionCurrencyInput(0)).toBe("R$ 0,00");
  });

  it("parses masked BRL input back to a decimal value", () => {
    expect(parseTransactionCurrencyInput("R$ 1.234,56")).toBe(1234.56);
  });

  it("returns zero when no digits are present", () => {
    expect(parseTransactionCurrencyInput("")).toBe(0);
  });
});
