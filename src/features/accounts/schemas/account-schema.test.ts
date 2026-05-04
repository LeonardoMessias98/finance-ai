import { describe, expect, it } from "vitest";

import { accountFormSchema, accountSchema, createAccountSchema } from "@/features/accounts/schemas/account-schema";

const accountFormValues = {
  name: "Conta principal",
  type: "debit",
  initialBalance: 250,
  isActive: true,
  color: "",
  icon: ""
};

const createAccountInput = {
  userId: "507f1f77bcf86cd799439011",
  name: "Conta principal",
  type: "debit",
  initialBalance: 25000,
  isActive: true
};

describe("account schemas", () => {
  it("allows creating a debit account with an initial balance", () => {
    const result = accountFormSchema.safeParse(accountFormValues);

    expect(result.success).toBe(true);
  });

  it("allows creating a credit account with zero initial balance", () => {
    const result = accountFormSchema.safeParse({
      ...accountFormValues,
      type: "credit",
      initialBalance: 0
    });

    expect(result.success).toBe(true);
  });

  it("rejects a credit account with an initial balance", () => {
    const result = accountFormSchema.safeParse({
      ...accountFormValues,
      type: "credit",
      initialBalance: 1
    });

    expect(result.success).toBe(false);
  });

  it("enforces zero initial balance in the create schema too", () => {
    const result = createAccountSchema.safeParse({
      ...createAccountInput,
      type: "credit",
      initialBalance: 1
    });

    expect(result.success).toBe(false);
  });

  it("keeps legacy persisted account types compatible", () => {
    const legacyTypes = ["checking", "savings", "cash", "investment", "credit_card"];

    for (const accountType of legacyTypes) {
      const result = accountSchema.safeParse({
        id: "507f1f77bcf86cd799439010",
        userId: "507f1f77bcf86cd799439011",
        name: "Conta antiga",
        type: accountType,
        initialBalance: 1000,
        isActive: true
      });

      expect(result.success).toBe(true);
    }
  });
});
