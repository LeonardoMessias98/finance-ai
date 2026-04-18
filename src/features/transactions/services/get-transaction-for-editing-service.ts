import "server-only";

import { findTransactionById } from "@/features/transactions/repositories/transaction-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function getTransactionForEditing(transactionId: string) {
  const user = await requireAuthenticatedAppUser();

  return findTransactionById(transactionId, user.id);
}
