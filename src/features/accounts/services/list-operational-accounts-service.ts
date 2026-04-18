import "server-only";

import { listAccounts } from "@/features/accounts/repositories/account-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

// Operational selects should default to active accounts only.
export async function listOperationalAccounts() {
  const user = await requireAuthenticatedAppUser();

  return listAccounts({
    userId: user.id,
    isActive: true
  });
}
