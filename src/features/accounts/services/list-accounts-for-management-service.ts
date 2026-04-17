import "server-only";

import { listAccounts } from "@/features/accounts/repositories/account-repository";

export async function listAccountsForManagement() {
  return listAccounts();
}
