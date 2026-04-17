import { Card, CardContent } from "@/components/ui/card";
import type { DashboardFinancialSummary } from "@/features/dashboard/types/dashboard-financial-summary";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import { cn } from "@/lib/utils";

type DashboardSummaryCardsProps = {
  summary: DashboardFinancialSummary;
};

export function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card>
        <CardContent className="space-y-2 pt-5">
          <p className="text-sm text-muted-foreground">Entradas</p>
          <p className="text-2xl font-semibold text-income">{formatAccountBalanceFromCents(summary.monthlyIncome)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 pt-5">
          <p className="text-sm text-muted-foreground">Saídas</p>
          <p className="text-2xl font-semibold text-destructive">{formatAccountBalanceFromCents(summary.monthlyExpense)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 pt-5">
          <p className="text-sm text-muted-foreground">Resultado</p>
          <p
            className={cn(
              "text-2xl font-semibold",
              summary.monthlyResult > 0 ? "text-income" : summary.monthlyResult < 0 ? "text-destructive" : "text-foreground"
            )}
          >
            {formatAccountBalanceFromCents(summary.monthlyResult)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
