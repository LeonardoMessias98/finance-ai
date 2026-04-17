import "server-only";

import type { ParsedAccountFormValues } from "@/features/accounts/schemas/account-schema";
import { updateAccount as updateAccountRecord } from "@/features/accounts/repositories/account-repository";
import { normalizeAccountFormValues } from "@/features/accounts/utils/normalize-account-form-values";

export async function updateAccount(accountId: string, values: ParsedAccountFormValues) {
  return updateAccountRecord({
    id: accountId,
    ...normalizeAccountFormValues(values)
  });
}
