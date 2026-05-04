import type { CreateTransactionInput } from "@/features/transactions/types/transaction";
import { getCompetencyMonthFromDate } from "@/lib/dates/competency-month";
import { getNextCreditPaymentMonth } from "@/features/transactions/utils/credit-payment-month";

function addMonthsToUtcDate(date: Date, monthsToAdd: number): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + monthsToAdd;
  const day = date.getUTCDate();
  const targetYear = year + Math.floor(month / 12);
  const normalizedMonth = ((month % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0, 12)).getUTCDate();

  return new Date(Date.UTC(targetYear, normalizedMonth, Math.min(day, lastDayOfTargetMonth), 12));
}

function splitAmountAcrossInstallments(totalAmount: number, installmentTotal: number): number[] {
  const baseAmount = Math.floor(totalAmount / installmentTotal);

  return Array.from({ length: installmentTotal }, (_, index) =>
    index === installmentTotal - 1 ? totalAmount - baseAmount * (installmentTotal - 1) : baseAmount
  );
}

export function buildInstallmentTransactions(transaction: CreateTransactionInput): CreateTransactionInput[] {
  if (!transaction.installment || transaction.installment.total <= 1) {
    return [transaction];
  }

  const installmentTotal = transaction.installment.total;
  const installmentAmounts = splitAmountAcrossInstallments(transaction.amount, installmentTotal);

  return installmentAmounts.map((installmentAmount, index) => {
    const installmentDate = addMonthsToUtcDate(transaction.date, index);
    const competencyMonth = getCompetencyMonthFromDate(installmentDate);

    return {
      ...transaction,
      description: `${transaction.description} ${index + 1}/${installmentTotal}`,
      amount: installmentAmount,
      date: installmentDate,
      competencyMonth,
      creditPaymentMonth: transaction.creditPaymentMonth ? getNextCreditPaymentMonth(competencyMonth) : undefined,
      status: index === 0 ? transaction.status : "planned",
      installment: {
        current: index + 1,
        total: installmentTotal
      }
    };
  });
}
