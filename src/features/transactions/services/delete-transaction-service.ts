import "server-only";

import {
  deleteTransaction as deleteTransactionRecord,
  deleteTransactionSeries,
  findTransactionById
} from "@/features/transactions/repositories/transaction-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function deleteTransaction(transactionId: string) {
  const user = await requireAuthenticatedAppUser();
  const existingTransaction = await findTransactionById(transactionId, user.id);

  if (!existingTransaction) {
    return null;
  }

  if (existingTransaction.parentTransactionId) {
    const deletedCount = await deleteTransactionSeries(existingTransaction.parentTransactionId, user.id);

    return {
      deletedTransaction: existingTransaction,
      deletedCount
    };
  }

  const deletedTransaction = await deleteTransactionRecord(transactionId, user.id);

  if (!deletedTransaction) {
    return null;
  }

  return {
    deletedTransaction,
    deletedCount: 1
  };
}
