import "server-only";

import { findAccountById } from "@/features/accounts/repositories/account-repository";

export async function getAccountForEditing(accountId: string) {
  return findAccountById(accountId);
}
