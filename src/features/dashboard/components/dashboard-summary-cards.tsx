import { Card, CardContent } from "@/components/ui/card";
import { calculateDashboardCreditTotals } from "@/features/dashboard/components/dashboard-summary-cards.helpers";
import { dashboardSummaryCardsStyles, getDashboardResultClassName } from "@/features/dashboard/components/dashboard-summary-cards.styles";
import type { DashboardFinancialSummary } from "@/features/dashboard/types/dashboard-financial-summary";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";

type DashboardSummaryCardsProps = {
  summary: DashboardFinancialSummary;
};

export function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  const creditTotals = calculateDashboardCreditTotals(summary.creditAccountSummaries);

  return (
    <div className={dashboardSummaryCardsStyles.container}>
      <Card>
        <CardContent className={dashboardSummaryCardsStyles.summaryGrid}>
          <div className={dashboardSummaryCardsStyles.stat}>
            <p className={dashboardSummaryCardsStyles.label}>Entradas</p>
            <p className={dashboardSummaryCardsStyles.incomeValue}>{formatAccountBalanceFromCents(summary.monthlyIncome)}</p>
          </div>

          <div className={dashboardSummaryCardsStyles.stat}>
            <p className={dashboardSummaryCardsStyles.label}>Saídas</p>
            <p className={dashboardSummaryCardsStyles.expenseValue}>{formatAccountBalanceFromCents(summary.monthlyExpense)}</p>
          </div>

          <div className={dashboardSummaryCardsStyles.stat}>
            <p className={dashboardSummaryCardsStyles.label}>Resultado</p>
            <p className={getDashboardResultClassName(summary.monthlyResult)}>
              {formatAccountBalanceFromCents(summary.monthlyResult)}
            </p>
          </div>
        </CardContent>
      </Card>

      {summary.creditAccountSummaries.length > 0 ? (
        <Card>
          <CardContent className={dashboardSummaryCardsStyles.creditContent}>
            <p className={dashboardSummaryCardsStyles.creditHint}>
              Crédito não altera o saldo disponível até a fatura ser paga.
            </p>
            <div className={dashboardSummaryCardsStyles.creditGrid}>
              <div className={dashboardSummaryCardsStyles.stat}>
                <p className={dashboardSummaryCardsStyles.label}>Gasto no crédito</p>
                <p className={dashboardSummaryCardsStyles.expenseValue}>{formatAccountBalanceFromCents(creditTotals.spentAmount)}</p>
              </div>
              <div className={dashboardSummaryCardsStyles.stat}>
                <p className={dashboardSummaryCardsStyles.label}>Pago no crédito</p>
                <p className={dashboardSummaryCardsStyles.incomeValue}>{formatAccountBalanceFromCents(creditTotals.paidAmount)}</p>
              </div>
              <div className={dashboardSummaryCardsStyles.stat}>
                <p className={dashboardSummaryCardsStyles.label}>Em aberto</p>
                <p className={dashboardSummaryCardsStyles.foregroundValue}>{formatAccountBalanceFromCents(creditTotals.openAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
