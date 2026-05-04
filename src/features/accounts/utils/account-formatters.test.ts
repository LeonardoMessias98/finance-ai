import { describe, expect, it } from "vitest";

import type { AccountType } from "@/features/accounts/types/account";
import { getAccountTypeLabel } from "@/features/accounts/utils/account-formatters";

describe("account formatters", () => {
  it("shows debit and legacy non-credit account types as Débito", () => {
    const debitTypes: AccountType[] = ["debit", "checking", "savings", "cash", "investment"];

    expect(debitTypes.map((accountType) => getAccountTypeLabel(accountType))).toEqual([
      "Débito",
      "Débito",
      "Débito",
      "Débito",
      "Débito"
    ]);
  });

  it("shows credit and legacy credit_card account types as Crédito", () => {
    const creditTypes: AccountType[] = ["credit", "credit_card"];

    expect(creditTypes.map((accountType) => getAccountTypeLabel(accountType))).toEqual(["Crédito", "Crédito"]);
  });
});
