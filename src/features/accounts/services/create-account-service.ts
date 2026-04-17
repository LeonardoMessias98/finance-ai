import "server-only";

import type { ParsedAccountFormValues } from "@/features/accounts/schemas/account-schema";
import { createAccount as createAccountRecord } from "@/features/accounts/repositories/account-repository";
import { normalizeAccountFormValues } from "@/features/accounts/utils/normalize-account-form-values";

export async function createAccount(values: ParsedAccountFormValues) {
  return createAccountRecord(normalizeAccountFormValues(values));
}
