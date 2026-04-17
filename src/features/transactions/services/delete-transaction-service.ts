import "server-only";

import {
  deleteTransaction as deleteTransactionRecord,
  deleteTransactionSeries,
  findTransactionById
} from "@/features/transactions/repositories/transaction-repository";

export async function deleteTransaction(transactionId: string) {
  const existingTransaction = await findTransactionById(transactionId);

  if (!existingTransaction) {
    return null;
  }

  if (existingTransaction.parentTransactionId) {
    const deletedCount = await deleteTransactionSeries(existingTransaction.parentTransactionId);

    return {
      deletedTransaction: existingTransaction,
      deletedCount
    };
  }

  const deletedTransaction = await deleteTransactionRecord(transactionId);

  if (!deletedTransaction) {
    return null;
  }

  return {
    deletedTransaction,
    deletedCount: 1
  };
}
