import { Card, CardContent } from "@/components/ui/card";
import type { DashboardFinancialSummary } from "@/features/dashboard/types/dashboard-financial-summary";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import { cn } from "@/lib/utils";

type DashboardSummaryCardsProps = {
  summary: DashboardFinancialSummary;
};

export function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  return (
    <Card>
      <CardContent className="grid gap-4 pt-5 sm:grid-cols-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Entradas</p>
          <p className="text-2xl font-semibold text-income">{formatAccountBalanceFromCents(summary.monthlyIncome)}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Saídas</p>
          <p className="text-2xl font-semibold text-destructive">{formatAccountBalanceFromCents(summary.monthlyExpense)}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Resultado</p>
          <p
            className={cn(
              "text-2xl font-semibold",
              summary.monthlyResult > 0 ? "text-income" : summary.monthlyResult < 0 ? "text-destructive" : "text-foreground"
            )}
          >
            {formatAccountBalanceFromCents(summary.monthlyResult)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
