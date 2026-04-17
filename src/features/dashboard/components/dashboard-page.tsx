import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLatestTransactions } from "@/features/dashboard/components/dashboard-latest-transactions";
import { DashboardMonthFilter } from "@/features/dashboard/components/dashboard-month-filter";
import { DashboardSummaryCards } from "@/features/dashboard/components/dashboard-summary-cards";
import { getDashboardFinancialSummary } from "@/features/dashboard/services/get-dashboard-financial-summary-service";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";
import { createEmptyDashboardFinancialSummary } from "@/features/dashboard/utils/build-dashboard-financial-summary";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import { formatTransactionCompetencyMonth } from "@/features/transactions/utils/transaction-formatters";
import { hasMongoDatabaseUri } from "@/lib/db/connect";

type DashboardPageProps = {
  competencyMonth: string;
};

export async function DashboardPage({ competencyMonth }: DashboardPageProps) {
  const isDatabaseConfigured = hasMongoDatabaseUri();
  let dashboardSummary = createEmptyDashboardFinancialSummary(competencyMonth);
  let loadingErrorMessage: string | null = null;

  if (isDatabaseConfigured) {
    try {
      dashboardSummary = await getDashboardFinancialSummary({
        competencyMonth
      });
    } catch (error) {
      console.error("Failed to load dashboard financial summary.", error);
      loadingErrorMessage = "Não foi possível carregar o resumo financeiro agora.";
    }
  }

  return (
    <AppShell>
      <section className="space-y-6">
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
                  competencyMonth: dashboardSummary.competencyMonth
                })}
              >
                Nova transação
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                href={buildTransactionsHref({
                  competencyMonth: dashboardSummary.competencyMonth
                })}
              >
                Ver histórico
              </Link>
            </Button>
          </div>
        </div>

        {!isDatabaseConfigured ? (
          <Card>
            <CardContent className="pt-5 text-sm text-muted-foreground">
              Configure `MONGODB_URI` para ver saldo e movimentações reais.
            </CardContent>
          </Card>
        ) : null}

        {loadingErrorMessage ? (
          <Card className="border-destructive/30">
            <CardContent className="flex items-center gap-3 pt-5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {loadingErrorMessage}
            </CardContent>
          </Card>
        ) : null}

        <DashboardMonthFilter competencyMonth={dashboardSummary.competencyMonth} />

        <DashboardSummaryCards summary={dashboardSummary} />

        <DashboardLatestTransactions
          competencyMonth={dashboardSummary.competencyMonth}
          latestTransactions={dashboardSummary.latestTransactions}
        />
      </section>
    </AppShell>
  );
}
