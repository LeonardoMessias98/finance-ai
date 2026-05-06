import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import type { DashboardExpenseInsight } from "@/features/dashboard/types/dashboard-analytics";

export type MonthlyExpenseComparison = {
  averageDelta: number | null;
  averageDeltaText: string | null;
  averageLabel: string;
  averageValueText: string;
};

export function buildMonthlyExpenseComparison(expenseInsight: DashboardExpenseInsight): MonthlyExpenseComparison {
  if (expenseInsight.averagePreviousMonths === null) {
    return {
      averageDelta: null,
      averageDeltaText: null,
      averageLabel: "Sem base anterior suficiente",
      averageValueText: "Ainda sem histórico"
    };
  }

  const averageDelta = expenseInsight.totalAmount - expenseInsight.averagePreviousMonths;
  const averageDeltaStatus = averageDelta > 0 ? "Acima" : averageDelta < 0 ? "Abaixo" : "Em linha";

  return {
    averageDelta,
    averageDeltaText: `${averageDeltaStatus} da média recente em ${formatAccountBalanceFromCents(Math.abs(averageDelta))}`,
    averageLabel: `Média dos ${expenseInsight.averageWindowSize} mês(es) anteriores`,
    averageValueText: formatAccountBalanceFromCents(expenseInsight.averagePreviousMonths)
  };
}
