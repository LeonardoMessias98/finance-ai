import "server-only";

import { findTransactionById } from "@/features/transactions/repositories/transaction-repository";

export async function getTransactionForEditing(transactionId: string) {
  return findTransactionById(transactionId);
}
