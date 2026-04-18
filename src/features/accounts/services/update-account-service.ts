import "server-only";

import type { ParsedAccountFormValues } from "@/features/accounts/schemas/account-schema";
import { updateAccount as updateAccountRecord } from "@/features/accounts/repositories/account-repository";
import { normalizeAccountFormValues } from "@/features/accounts/utils/normalize-account-form-values";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function updateAccount(accountId: string, values: ParsedAccountFormValues) {
  const user = await requireAuthenticatedAppUser();

  return updateAccountRecord({
    id: accountId,
    userId: user.id,
    ...normalizeAccountFormValues(values)
  });
}
