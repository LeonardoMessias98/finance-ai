import "server-only";

import { setAccountActiveState } from "@/features/accounts/repositories/account-repository";

export async function toggleAccountStatus(accountId: string, isActive: boolean) {
  return setAccountActiveState(accountId, isActive);
}
