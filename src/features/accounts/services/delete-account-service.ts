import "server-only";

import {
  countTransactionsByAccountId,
  deleteAccount as deleteAccountRecord
} from "@/features/accounts/repositories/account-repository";
import { findAccountByIdForUser } from "@/features/accounts/repositories/account-repository";
import { AccountHasTransactionsError } from "@/features/accounts/services/account-errors";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function deleteAccount(accountId: string) {
  const user = await requireAuthenticatedAppUser();
  const existingAccount = await findAccountByIdForUser(accountId, user.id);

  if (!existingAccount) {
    return null;
  }

  const relatedTransactionsCount = await countTransactionsByAccountId(accountId, user.id);

  if (relatedTransactionsCount > 0) {
    throw new AccountHasTransactionsError();
  }

  return deleteAccountRecord(accountId, user.id);
}
