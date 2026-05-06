import type { Transaction } from "@/features/transactions/types/transaction";
import { shiftCompetencyMonth } from "@/lib/dates/competency-month";

const fallbackPreviousMonths = 2;
const fallbackNextMonths = 2;
const dashboardDataPreviousMonths = 5;
const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];

function listFallbackMonths(competencyMonth: string): string[] {
  return Array.from({ length: fallbackPreviousMonths + fallbackNextMonths + 1 }, (_, index) =>
    shiftCompetencyMonth(competencyMonth, index - fallbackPreviousMonths)
  );
}

export function formatDashboardMonthNavigationLabel(competencyMonth: string): string {
  const [year, month] = competencyMonth.split("-").map(Number);
  const monthName = monthNames[month - 1] ?? competencyMonth;

  return `${monthName}/${String(year).slice(-2)}`;
}

export function buildDashboardMonthNavigationMonths(input: {
  competencyMonth: string;
  transactions: Pick<Transaction, "competencyMonth" | "creditPaymentMonth">[];
}): string[] {
  const months = new Set(listFallbackMonths(input.competencyMonth));
  return [...months].sort();
}

export function buildDashboardMonthNavigationDataMonths(
  transactions: Pick<Transaction, "competencyMonth" | "creditPaymentMonth">[]
): string[] {
  const months = new Set<string>();

  for (const transaction of transactions) {
    months.add(transaction.competencyMonth);

    if (transaction.creditPaymentMonth) {
      months.add(transaction.creditPaymentMonth);
    }
  }

  return [...months].sort();
}

export function listDashboardDataCompetencyMonths(competencyMonth: string): string[] {
  return Array.from({ length: dashboardDataPreviousMonths + 1 }, (_, index) =>
    shiftCompetencyMonth(competencyMonth, index - dashboardDataPreviousMonths)
  );
}
