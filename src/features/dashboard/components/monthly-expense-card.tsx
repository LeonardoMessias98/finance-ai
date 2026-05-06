import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  dashboardAnalyticsCardsStyles,
  getDeltaClassName
} from "@/features/dashboard/components/dashboard-analytics-cards.styles";
import { buildMonthlyExpenseComparison } from "@/features/dashboard/components/monthly-expense-card.helpers";
import type { DashboardExpenseInsight } from "@/features/dashboard/types/dashboard-analytics";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";

type MonthlyExpenseCardProps = {
  expenseInsight: DashboardExpenseInsight;
};

export function MonthlyExpenseCard({ expenseInsight }: MonthlyExpenseCardProps) {
  const { averageDelta, averageDeltaText, averageLabel, averageValueText } =
    buildMonthlyExpenseComparison(expenseInsight);

  return (
    <Card>
      <CardHeader className={dashboardAnalyticsCardsStyles.headerCompact}>
        <CardTitle className={dashboardAnalyticsCardsStyles.title}>Gasto do mês</CardTitle>
        <CardDescription>Considera apenas despesas aplicadas na competência selecionada.</CardDescription>
      </CardHeader>
      <CardContent className={dashboardAnalyticsCardsStyles.content}>
        <div className={dashboardAnalyticsCardsStyles.totalBlock}>
          <p className={dashboardAnalyticsCardsStyles.totalValue}>
            {formatAccountBalanceFromCents(expenseInsight.totalAmount)}
          </p>
          <p className={dashboardAnalyticsCardsStyles.mutedText}>
            {expenseInsight.transactionCount} despesa(s) aplicada(s) no mês.
          </p>
        </div>

        <div className={dashboardAnalyticsCardsStyles.metricPanel}>
          <p className={dashboardAnalyticsCardsStyles.metricLabel}>{averageLabel}</p>
          <p className={dashboardAnalyticsCardsStyles.metricValue}>{averageValueText}</p>
          {averageDelta !== null ? (
            <p className={getDeltaClassName(averageDelta)}>{averageDeltaText}</p>
          ) : (
            <p className={dashboardAnalyticsCardsStyles.metricHint}>A comparação aparece quando houver meses anteriores.</p>
          )}
        </div>

        <div className={dashboardAnalyticsCardsStyles.metricPanel}>
          <p className={dashboardAnalyticsCardsStyles.metricLabel}>Maior peso do mês</p>
          {expenseInsight.topCategoryName ? (
            <>
              <p className={dashboardAnalyticsCardsStyles.metricValue}>{expenseInsight.topCategoryName}</p>
              <p className={dashboardAnalyticsCardsStyles.mutedText}>
                {formatAccountBalanceFromCents(expenseInsight.topCategoryAmount ?? 0)}
              </p>
            </>
          ) : (
            <p className={dashboardAnalyticsCardsStyles.metricValue}>Sem categoria de despesa aplicada nesta competência.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
