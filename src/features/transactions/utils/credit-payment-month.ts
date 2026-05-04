import type { AccountType } from "@/features/accounts/types/account";
import { isCreditAccount } from "@/features/accounts/utils/account-type-compatibility";
import type { TransactionType } from "@/features/transactions/types/transaction";
import { shiftCompetencyMonth } from "@/lib/dates/competency-month";

export function getNextCreditPaymentMonth(competencyMonth: string): string {
  return shiftCompetencyMonth(competencyMonth, 1);
}

export function resolveCreditPaymentMonth(input: {
  transactionType: TransactionType;
  accountType: AccountType | string;
  competencyMonth: string;
}): string | undefined {
  if (input.transactionType !== "expense") {
    return undefined;
  }

  if (!isCreditAccount(input.accountType)) {
    return undefined;
  }

  return getNextCreditPaymentMonth(input.competencyMonth);
}
