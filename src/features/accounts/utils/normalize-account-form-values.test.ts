import { describe, expect, it } from "vitest";

import { normalizeAccountFormValues } from "@/features/accounts/utils/normalize-account-form-values";

describe("normalizeAccountFormValues", () => {
  it("keeps the initial balance for debit accounts", () => {
    expect(
      normalizeAccountFormValues({
        name: "Conta principal",
        type: "debit",
        initialBalance: 250,
        isActive: true,
        color: "",
        icon: ""
      })
    ).toMatchObject({
      type: "debit",
      initialBalance: 25000
    });
  });

  it("forces zero initial balance for credit accounts", () => {
    expect(
      normalizeAccountFormValues({
        name: "Cartao",
        type: "credit",
        initialBalance: 250,
        isActive: true,
        color: "",
        icon: ""
      })
    ).toMatchObject({
      type: "credit",
      initialBalance: 0
    });
  });
});
