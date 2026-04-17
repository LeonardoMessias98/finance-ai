import "server-only";

import type { ParsedTransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import {
  createTransaction as createTransactionRecord,
  createTransactionSeries
} from "@/features/transactions/repositories/transaction-repository";
import { assertTransactionRelations } from "@/features/transactions/services/assert-transaction-relations-service";
import { buildInstallmentTransactions } from "@/features/transactions/utils/build-installment-transactions";
import { normalizeTransactionFormValues } from "@/features/transactions/utils/normalize-transaction-form-values";

export async function createTransaction(values: ParsedTransactionFormValues) {
  const payload = normalizeTransactionFormValues(values);

  await assertTransactionRelations(payload);

  if (payload.installment && payload.installment.total > 1) {
    return createTransactionSeries(buildInstallmentTransactions(payload));
  }

  const createdTransaction = await createTransactionRecord(payload);

  return [createdTransaction];
}
