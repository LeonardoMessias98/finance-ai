import "server-only";

import { Types } from "mongoose";

import { accountFormSchema, type ParsedAccountFormValues } from "@/features/accounts/schemas/account-schema";
import { createAccount as createAccountRecord } from "@/features/accounts/repositories/account-repository";
import { normalizeAccountFormValues } from "@/features/accounts/utils/normalize-account-form-values";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function createAccount(values: ParsedAccountFormValues) {
  const user = await requireAuthenticatedAppUser();
  const payload = accountFormSchema.parse(values);

  // Ensure userId is a valid ObjectId
  if (!Types.ObjectId.isValid(user.id)) {
    throw new Error(`Invalid user ID: ${user.id}`);
  }

  return createAccountRecord({
    userId: user.id,
    ...normalizeAccountFormValues(payload)
  });
}
