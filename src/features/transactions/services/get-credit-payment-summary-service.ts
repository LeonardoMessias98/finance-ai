import "server-only";

import { listAccounts } from "@/features/accounts/repositories/account-repository";
import { listTransactions } from "@/features/transactions/repositories/transaction-repository";
import type { CreditPaymentSummary } from "@/features/transactions/types/credit-payment-summary";
import { buildCreditPaymentSummary } from "@/features/transactions/utils/build-credit-payment-summary";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";
import { isCompetencyMonth } from "@/lib/dates/competency-month";

export async function getCreditPaymentSummary(creditPaymentMonth: string): Promise<CreditPaymentSummary> {
  if (!isCompetencyMonth(creditPaymentMonth)) {
    throw new Error(`Invalid credit payment month: ${creditPaymentMonth}`);
  }

  const user = await requireAuthenticatedAppUser();
  const [accounts, transactions] = await Promise.all([
    listAccounts({
      userId: user.id
    }),
    listTransactions({
      userId: user.id
    })
  ]);

  return buildCreditPaymentSummary({
    accounts,
    transactions,
    creditPaymentMonth
  });
}
