import type { ParsedTransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import type { CreateTransactionInput } from "@/features/transactions/types/transaction";
import { getCompetencyMonthFromDate, isCompetencyMonth } from "@/lib/dates/competency-month";

function normalizeOptionalValue(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function parseDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function normalizeTransactionFormValues(
  values: ParsedTransactionFormValues
): Omit<CreateTransactionInput, "userId"> & { isRecurring: boolean } {
  const parsedDate = parseDateInput(values.date);
  const normalizedCompetencyMonth = isCompetencyMonth(values.competencyMonth)
    ? values.competencyMonth
    : getCompetencyMonthFromDate(parsedDate);

  return {
    description: values.description.trim(),
    amount: Math.round(values.amount * 100),
    type: values.type,
    date: parsedDate,
    competencyMonth: normalizedCompetencyMonth,
    installment:
      values.type === "expense" && values.installmentCount > 1
        ? {
            current: 1,
            total: values.installmentCount
          }
        : undefined,
    categoryId: values.categoryId,
    accountId: values.accountId,
    destinationAccountId: values.type === "transfer" ? values.destinationAccountId : undefined,
    notes: normalizeOptionalValue(values.notes),
    status: values.status,
    isRecurring: values.isRecurring
  };
}
