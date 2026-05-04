import { describe, expect, it } from "vitest";

import { isCreditAccount, isDebitAccount } from "@/features/accounts/utils/account-type-compatibility";

describe("account type compatibility", () => {
  it("treats credit and credit_card as credit accounts", () => {
    expect(isCreditAccount("credit")).toBe(true);
    expect(isCreditAccount("credit_card")).toBe(true);
    expect(isDebitAccount("credit")).toBe(false);
    expect(isDebitAccount("credit_card")).toBe(false);
  });

  it("treats debit and legacy non-credit account types as debit accounts", () => {
    const legacyDebitAccountTypes = ["debit", "checking", "savings", "cash", "investment"];

    for (const accountType of legacyDebitAccountTypes) {
      expect(isCreditAccount(accountType)).toBe(false);
      expect(isDebitAccount(accountType)).toBe(true);
    }
  });

  it("keeps unknown legacy values in the non-credit group", () => {
    expect(isCreditAccount("legacy_wallet")).toBe(false);
    expect(isDebitAccount("legacy_wallet")).toBe(true);
  });
});
