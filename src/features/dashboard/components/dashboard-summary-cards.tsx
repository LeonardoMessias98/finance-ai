import { Card, CardContent } from "@/components/ui/card";
import type { DashboardFinancialSummary } from "@/features/dashboard/types/dashboard-financial-summary";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import { cn } from "@/lib/utils";

type DashboardSummaryCardsProps = {
  summary: DashboardFinancialSummary;
};

export function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  const totalCreditSpent = summary.creditAccountSummaries.reduce((sum, account) => sum + account.spentAmount, 0);
  const totalCreditPaid = summary.creditAccountSummaries.reduce((sum, account) => sum + account.paidAmount, 0);
  const totalCreditOpen = summary.creditAccountSummaries.reduce((sum, account) => sum + account.openAmount, 0);

  return (
    <div className="space-y-4">
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

      {summary.creditAccountSummaries.length > 0 ? (
        <Card>
          <CardContent className="space-y-4 pt-5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Crédito não altera o saldo disponível até a fatura ser paga.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gasto no crédito</p>
                <p className="text-2xl font-semibold text-destructive">{formatAccountBalanceFromCents(totalCreditSpent)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pago no crédito</p>
                <p className="text-2xl font-semibold text-income">{formatAccountBalanceFromCents(totalCreditPaid)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Em aberto</p>
                <p className="text-2xl font-semibold text-foreground">{formatAccountBalanceFromCents(totalCreditOpen)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
