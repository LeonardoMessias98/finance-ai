import "server-only";

import { setAccountActiveState } from "@/features/accounts/repositories/account-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function toggleAccountStatus(accountId: string, isActive: boolean) {
  const user = await requireAuthenticatedAppUser();

  return setAccountActiveState(accountId, user.id, isActive);
}
