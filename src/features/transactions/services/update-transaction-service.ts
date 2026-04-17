import "server-only";

import type { ParsedTransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import {
  findTransactionById,
  updateTransaction as updateTransactionRecord
} from "@/features/transactions/repositories/transaction-repository";
import { assertTransactionRelations } from "@/features/transactions/services/assert-transaction-relations-service";
import { InstallmentSeriesUpdateNotSupportedError } from "@/features/transactions/services/transaction-errors";
import { normalizeTransactionFormValues } from "@/features/transactions/utils/normalize-transaction-form-values";

export async function updateTransaction(transactionId: string, values: ParsedTransactionFormValues) {
  const existingTransaction = await findTransactionById(transactionId);

  if (!existingTransaction) {
    return null;
  }

  if (existingTransaction.installment && existingTransaction.installment.total > 1 && existingTransaction.parentTransactionId) {
    throw new InstallmentSeriesUpdateNotSupportedError();
  }

  const normalizedValues = normalizeTransactionFormValues(values);
  const payload = {
    id: transactionId,
    ...normalizedValues,
    installment: existingTransaction.installment,
    parentTransactionId: existingTransaction.parentTransactionId
  };

  await assertTransactionRelations(payload);

  return updateTransactionRecord(payload);
}
