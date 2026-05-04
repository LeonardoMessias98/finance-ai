import "server-only";

import { Types } from "mongoose";

import { findAccountByIdForUser } from "@/features/accounts/repositories/account-repository";
import type { ParsedTransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import {
  createTransaction as createTransactionRecord,
  createTransactionSeries
} from "@/features/transactions/repositories/transaction-repository";
import { assertTransactionRelations } from "@/features/transactions/services/assert-transaction-relations-service";
import { buildInstallmentTransactions } from "@/features/transactions/utils/build-installment-transactions";
import { resolveCreditPaymentMonth } from "@/features/transactions/utils/credit-payment-month";
import { normalizeTransactionFormValues } from "@/features/transactions/utils/normalize-transaction-form-values";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function createTransaction(values: ParsedTransactionFormValues) {
  const user = await requireAuthenticatedAppUser();

  // Ensure userId is a valid ObjectId
  if (!Types.ObjectId.isValid(user.id)) {
    throw new Error(`Invalid user ID: ${user.id}`);
  }

  const payload = normalizeTransactionFormValues(values);

  await assertTransactionRelations(payload, user.id);

  const sourceAccount = await findAccountByIdForUser(payload.accountId, user.id);
  const creditPaymentMonth = sourceAccount
    ? resolveCreditPaymentMonth({
        transactionType: payload.type,
        accountType: sourceAccount.type,
        competencyMonth: payload.competencyMonth
      })
    : undefined;
  const payloadWithCreditPaymentMonth = {
    ...payload,
    ...(creditPaymentMonth ? { creditPaymentMonth } : {})
  };

  if (payloadWithCreditPaymentMonth.installment && payloadWithCreditPaymentMonth.installment.total > 1) {
    return createTransactionSeries(
      buildInstallmentTransactions({
        userId: user.id,
        ...payloadWithCreditPaymentMonth
      })
    );
  }

  const createdTransaction = await createTransactionRecord({
    userId: user.id,
    ...payloadWithCreditPaymentMonth
  });

  return [createdTransaction];
}
