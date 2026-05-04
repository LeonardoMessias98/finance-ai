import type { AccountType } from "@/features/accounts/types/account";

const creditAccountTypes = new Set<string>(["credit", "credit_card"]);

export function isCreditAccount(accountType: AccountType | string): boolean {
  return creditAccountTypes.has(accountType);
}

export function isDebitAccount(accountType: AccountType | string): boolean {
  return !isCreditAccount(accountType);
}
