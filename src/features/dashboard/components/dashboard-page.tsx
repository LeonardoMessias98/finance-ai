import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { DashboardLatestTransactions } from "@/features/dashboard/components/dashboard-latest-transactions";
import { DashboardMonthFilter } from "@/features/dashboard/components/dashboard-month-filter";
import { DashboardSummaryCards } from "@/features/dashboard/components/dashboard-summary-cards";
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
    <AppShell>
      <section className="space-y-6 pt-1">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{formatTransactionCompetencyMonth(dashboardSummary.competencyMonth)}</p>
            <h1 className="text-sm font-medium text-muted-foreground">Saldo atual</h1>
            <p className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {isDatabaseConfigured && !loadingErrorMessage
                ? formatAccountBalanceFromCents(dashboardSummary.totalCurrentBalance)
                : "Aguardando dados"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link
                href={buildTransactionsHref({
                  competencyMonth: dashboardSummary.competencyMonth,
                  type: selectedType
                })}
              >
                Nova transação
              </Link>
            </Button>
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
          <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            Configure `MONGODB_URI` para ver saldo e movimentações reais.
          </p>
        ) : null}

        {loadingErrorMessage ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {loadingErrorMessage}
          </p>
        ) : null}

        <DashboardMonthFilter competencyMonth={dashboardSummary.competencyMonth} selectedType={selectedType} />

        <DashboardSummaryCards summary={dashboardSummary} />

        <DashboardLatestTransactions
          competencyMonth={dashboardSummary.competencyMonth}
          latestTransactions={dashboardSummary.latestTransactions}
          selectedType={selectedType}
        />
      </section>
    </AppShell>
  );
}
