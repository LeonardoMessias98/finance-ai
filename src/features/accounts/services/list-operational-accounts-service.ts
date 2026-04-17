import "server-only";

import { listAccounts } from "@/features/accounts/repositories/account-repository";

// Operational selects should default to active accounts only.
export async function listOperationalAccounts() {
  return listAccounts({
    isActive: true
  });
}
