import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardExpenseInsight } from "@/features/dashboard/types/dashboard-analytics";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import { cn } from "@/lib/utils";

type MonthlyExpenseCardProps = {
  expenseInsight: DashboardExpenseInsight;
};

export function MonthlyExpenseCard({ expenseInsight }: MonthlyExpenseCardProps) {
  const averageDelta =
    expenseInsight.averagePreviousMonths !== null ? expenseInsight.totalAmount - expenseInsight.averagePreviousMonths : null;
  const averageLabel =
    expenseInsight.averagePreviousMonths !== null
      ? `Média dos ${expenseInsight.averageWindowSize} mês(es) anteriores`
      : "Sem base anterior suficiente";

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl">Gasto do mês</CardTitle>
        <CardDescription>Considera apenas despesas aplicadas na competência selecionada.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {formatAccountBalanceFromCents(expenseInsight.totalAmount)}
          </p>
          <p className="text-sm text-muted-foreground">
            {expenseInsight.transactionCount} despesa(s) aplicada(s) no mês.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-secondary/70 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{averageLabel}</p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {expenseInsight.averagePreviousMonths !== null
              ? formatAccountBalanceFromCents(expenseInsight.averagePreviousMonths)
              : "Ainda sem histórico"}
          </p>
          {averageDelta !== null ? (
            <p
              className={cn(
                "mt-1 text-sm",
                averageDelta > 0 ? "text-destructive" : averageDelta < 0 ? "text-income" : "text-muted-foreground"
              )}
            >
              {averageDelta > 0 ? "Acima" : averageDelta < 0 ? "Abaixo" : "Em linha"} da média recente em{" "}
              {formatAccountBalanceFromCents(Math.abs(averageDelta))}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">A comparação aparece quando houver meses anteriores.</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-secondary/70 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Maior peso do mês</p>
          {expenseInsight.topCategoryName ? (
            <>
              <p className="mt-2 text-lg font-semibold text-foreground">{expenseInsight.topCategoryName}</p>
              <p className="text-sm text-muted-foreground">
                {formatAccountBalanceFromCents(expenseInsight.topCategoryAmount ?? 0)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Sem categoria de despesa aplicada nesta competência.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
