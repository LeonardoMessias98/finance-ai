import "server-only";

import {
  countTransactionsByAccountId,
  deleteAccount as deleteAccountRecord
} from "@/features/accounts/repositories/account-repository";
import { findAccountById } from "@/features/accounts/repositories/account-repository";
import { AccountHasTransactionsError } from "@/features/accounts/services/account-errors";

export async function deleteAccount(accountId: string) {
  const existingAccount = await findAccountById(accountId);

  if (!existingAccount) {
    return null;
  }

  const relatedTransactionsCount = await countTransactionsByAccountId(accountId);

  if (relatedTransactionsCount > 0) {
    throw new AccountHasTransactionsError();
  }

  return deleteAccountRecord(accountId);
}
