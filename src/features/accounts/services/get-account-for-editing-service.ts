import "server-only";

import { findAccountByIdForUser } from "@/features/accounts/repositories/account-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function getAccountForEditing(accountId: string) {
  const user = await requireAuthenticatedAppUser();

  return findAccountByIdForUser(accountId, user.id);
}
