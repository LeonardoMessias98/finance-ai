import Link from "next/link";

import { AuthenticatedAppShell } from "@/components/layout/authenticated-app-shell";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/ui/status-banner";
import { DashboardAnalyticsSection } from "@/features/dashboard/components/dashboard-analytics-section";
import { DashboardLatestTransactions } from "@/features/dashboard/components/dashboard-latest-transactions";
import { DashboardMonthFilter } from "@/features/dashboard/components/dashboard-month-filter";
import { dashboardPageStyles } from "@/features/dashboard/components/dashboard-page.styles";
import { DashboardSummaryCards } from "@/features/dashboard/components/dashboard-summary-cards";
import { OpenTransactionModalButton } from "@/features/transactions/components/open-transaction-modal-button";
import { getDashboardFinancialSummary } from "@/features/dashboard/services/get-dashboard-financial-summary-service";
import type { TransactionType } from "@/features/transactions/types/transaction";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";
import { createEmptyDashboardFinancialSummary } from "@/features/dashboard/utils/build-dashboard-financial-summary";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import { formatTransactionCompetencyMonth } from "@/features/transactions/utils/transaction-formatters";
import { hasMongoDatabaseUri } from "@/lib/db/connect";

type DashboardPageProps = {
  competencyMonth: string;
  selectedType?: TransactionType;
};

export async function DashboardPage({ competencyMonth, selectedType }: DashboardPageProps) {
  const isDatabaseConfigured = hasMongoDatabaseUri();
  let dashboardSummary = createEmptyDashboardFinancialSummary(competencyMonth);
  let loadingErrorMessage: string | null = null;

  if (isDatabaseConfigured) {
    try {
      dashboardSummary = await getDashboardFinancialSummary({
        competencyMonth,
        latestTransactionsType: selectedType
      });
    } catch (error) {
      console.error("Failed to load dashboard financial summary.", error);
      loadingErrorMessage = "Não foi possível carregar o resumo financeiro agora.";
    }
  }

  return (
    <AuthenticatedAppShell>
      <PageSection>
        <div className={dashboardPageStyles.hero}>
          <div className={dashboardPageStyles.heroContent}>
            <p className={dashboardPageStyles.competencyMonth}>{formatTransactionCompetencyMonth(dashboardSummary.competencyMonth)}</p>
            <h1 className={dashboardPageStyles.balanceLabel}>Saldo atual</h1>
            <p className={dashboardPageStyles.balanceValue}>
              {isDatabaseConfigured && !loadingErrorMessage
                ? formatAccountBalanceFromCents(dashboardSummary.totalCurrentBalance)
                : "Aguardando dados"}
            </p>
          </div>

          <div className={dashboardPageStyles.actions}>
            <OpenTransactionModalButton
              defaultCompetencyMonth={dashboardSummary.competencyMonth}
              defaultType={selectedType}
            >
              Nova transação
            </OpenTransactionModalButton>
            <Button asChild variant="outline">
              <Link
                href={buildTransactionsHref({
                  competencyMonth: dashboardSummary.competencyMonth,
                  type: selectedType
                })}
              >
                Histórico
              </Link>
            </Button>
          </div>
        </div>

        {!isDatabaseConfigured ? (
          <StatusBanner message="Configure `MONGODB_URI` para ver saldo e movimentações reais." />
        ) : null}

        {loadingErrorMessage ? (
          <StatusBanner message={loadingErrorMessage} variant="error" />
        ) : null}

        <DashboardMonthFilter
          competencyMonth={dashboardSummary.competencyMonth}
          dataMonths={dashboardSummary.monthNavigationDataMonths}
          months={dashboardSummary.monthNavigationMonths}
          selectedType={selectedType}
        />

        <DashboardSummaryCards summary={dashboardSummary} />

        <DashboardLatestTransactions
          competencyMonth={dashboardSummary.competencyMonth}
          latestTransactions={dashboardSummary.latestTransactions}
          selectedType={selectedType}
        />

        <DashboardAnalyticsSection analytics={dashboardSummary.analytics} />
      </PageSection>
    </AuthenticatedAppShell>
  );
}
