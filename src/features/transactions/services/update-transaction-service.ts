import "server-only";

import { findAccountByIdForUser } from "@/features/accounts/repositories/account-repository";
import type { ParsedTransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import {
  findTransactionById,
  updateTransaction as updateTransactionRecord
} from "@/features/transactions/repositories/transaction-repository";
import { assertTransactionRelations } from "@/features/transactions/services/assert-transaction-relations-service";
import { InstallmentSeriesUpdateNotSupportedError } from "@/features/transactions/services/transaction-errors";
import { resolveCreditPaymentMonth } from "@/features/transactions/utils/credit-payment-month";
import { normalizeTransactionFormValues } from "@/features/transactions/utils/normalize-transaction-form-values";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function updateTransaction(transactionId: string, values: ParsedTransactionFormValues) {
  const user = await requireAuthenticatedAppUser();
  const existingTransaction = await findTransactionById(transactionId, user.id);

  if (!existingTransaction) {
    return null;
  }

  if (existingTransaction.installment && existingTransaction.installment.total > 1 && existingTransaction.parentTransactionId) {
    throw new InstallmentSeriesUpdateNotSupportedError();
  }

  const normalizedValues = normalizeTransactionFormValues(values);
  const payload = {
    id: transactionId,
    userId: user.id,
    ...normalizedValues,
    installment: existingTransaction.installment,
    parentTransactionId: existingTransaction.parentTransactionId
  };

  await assertTransactionRelations(payload, user.id);

  const sourceAccount = await findAccountByIdForUser(payload.accountId, user.id);
  const creditPaymentMonth = sourceAccount
    ? resolveCreditPaymentMonth({
        transactionType: payload.type,
        accountType: sourceAccount.type,
        competencyMonth: payload.competencyMonth
      })
    : undefined;

  return updateTransactionRecord({
    ...payload,
    creditPaymentMonth
  });
}
