import type { Account } from "@/features/accounts/types/account";
import type { TransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import type { Transaction, TransactionType } from "@/features/transactions/types/transaction";
import { getDefaultTransactionStatus } from "@/features/transactions/utils/transaction-formatters";
import {
  formatDateAsInputValue,
  getCompetencyMonthFromDateInput,
  getCurrentCompetencyMonth,
  getDefaultDateInputForCompetencyMonth
} from "@/lib/dates/competency-month";

function formatDateForInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getDefaultDateInput(selectedCompetencyMonth?: string): string {
  if (!selectedCompetencyMonth) {
    return formatDateAsInputValue();
  }

  return getDefaultDateInputForCompetencyMonth(selectedCompetencyMonth);
}

export function getDefaultTransactionAccountId(accounts: Account[], selectedAccountId?: string): string {
  if (selectedAccountId && accounts.some((account) => account.id === selectedAccountId)) {
    return selectedAccountId;
  }

  return accounts.find((account) => account.isActive)?.id ?? accounts[0]?.id ?? "";
}

export function getDefaultTransactionFormValues(input: {
  transaction?: Transaction | null;
  accounts: Account[];
  defaultType?: TransactionType;
  defaultCompetencyMonth?: string;
}): TransactionFormValues {
  const transactionType = input.transaction?.type ?? input.defaultType ?? "expense";

  return {
    description: input.transaction?.description ?? "",
    amount: input.transaction ? input.transaction.amount / 100 : 0,
    type: transactionType,
    date: input.transaction
      ? formatDateForInput(input.transaction.date)
      : getDefaultDateInput(input.defaultCompetencyMonth),
    competencyMonth:
      input.transaction?.competencyMonth ?? input.defaultCompetencyMonth ?? getCurrentCompetencyMonth(),
    installmentCount: input.transaction?.installment?.total ?? 1,
    categoryId: input.transaction?.categoryId ?? "",
    accountId: getDefaultTransactionAccountId(input.accounts, input.transaction?.accountId),
    notes: input.transaction?.notes ?? "",
    status: input.transaction?.status ?? getDefaultTransactionStatus(transactionType),
    isRecurring: input.transaction?.isRecurring ?? false
  };
}

export function shouldOpenAdvancedTransactionFields(
  values: Pick<
    TransactionFormValues,
    "competencyMonth" | "date" | "installmentCount" | "notes" | "status" | "isRecurring" | "type"
  >
): boolean {
  const derivedCompetencyMonth = getCompetencyMonthFromDateInput(values.date);

  return (
    values.notes.trim().length > 0 ||
    values.isRecurring ||
    values.installmentCount > 1 ||
    values.status !== getDefaultTransactionStatus(values.type) ||
    (Boolean(derivedCompetencyMonth) && values.competencyMonth !== derivedCompetencyMonth)
  );
}
