import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLineChart } from "@/features/dashboard/components/dashboard-line-chart";
import type { DashboardHistoricalSeriesPoint } from "@/features/dashboard/types/dashboard-analytics";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";

type MonthlyBalanceLineChartProps = {
  points: DashboardHistoricalSeriesPoint[];
};

export function MonthlyBalanceLineChart({ points }: MonthlyBalanceLineChartProps) {
  const latestPoint = points[points.length - 1];

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <CardTitle className="text-xl">Últimos meses</CardTitle>
          <CardDescription>Entradas e saídas aplicadas para leitura rápida da evolução recente.</CardDescription>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "hsl(var(--income))" }}
            />
            <span className="text-muted-foreground">Entradas</span>
            <span className="font-medium text-foreground">{formatAccountBalanceFromCents(latestPoint?.income ?? 0)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "hsl(var(--destructive))" }}
            />
            <span className="text-muted-foreground">Saídas</span>
            <span className="font-medium text-foreground">{formatAccountBalanceFromCents(latestPoint?.expense ?? 0)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DashboardLineChart
          ariaLabel="Gráfico de linhas com entradas e saídas dos últimos meses"
          labels={points.map((point) => point.shortLabel)}
          series={[
            {
              label: "Entradas",
              color: "hsl(var(--income))",
              values: points.map((point) => point.income)
            },
            {
              label: "Saídas",
              color: "hsl(var(--destructive))",
              values: points.map((point) => point.expense)
            }
          ]}
        />
      </CardContent>
    </Card>
  );
}
