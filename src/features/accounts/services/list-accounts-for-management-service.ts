import "server-only";

import { listAccounts } from "@/features/accounts/repositories/account-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function listAccountsForManagement() {
  const user = await requireAuthenticatedAppUser();

  return listAccounts({
    userId: user.id
  });
}
