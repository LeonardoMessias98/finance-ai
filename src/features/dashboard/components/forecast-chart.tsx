import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLineChart } from "@/features/dashboard/components/dashboard-line-chart";
import type { DashboardForecastSeriesPoint } from "@/features/dashboard/types/dashboard-analytics";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import { cn } from "@/lib/utils";

type ForecastChartProps = {
  points: DashboardForecastSeriesPoint[];
  description: string;
};

export function ForecastChart({ points, description }: ForecastChartProps) {
  const projectedAverageResult =
    points.length > 0
      ? Math.round(points.reduce((sum, point) => sum + point.estimatedResult, 0) / points.length)
      : 0;

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <CardTitle className="text-xl">Próximos meses</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "hsl(var(--income))" }}
            />
            <span className="text-muted-foreground">Entradas estimadas</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "hsl(var(--destructive))" }}
            />
            <span className="text-muted-foreground">Saídas estimadas</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <DashboardLineChart
          ariaLabel="Gráfico de previsão simples de entradas e saídas para os próximos meses"
          labels={points.map((point) => point.shortLabel)}
          series={[
            {
              label: "Entradas estimadas",
              color: "hsl(var(--income))",
              dashed: true,
              values: points.map((point) => point.estimatedIncome)
            },
            {
              label: "Saídas estimadas",
              color: "hsl(var(--destructive))",
              dashed: true,
              values: points.map((point) => point.estimatedExpense)
            }
          ]}
        />

        <div className="rounded-xl border border-border bg-secondary/70 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Resultado médio estimado</p>
          <p
            className={cn(
              "mt-2 text-lg font-semibold",
              projectedAverageResult > 0
                ? "text-income"
                : projectedAverageResult < 0
                  ? "text-destructive"
                  : "text-foreground"
            )}
          >
            {formatAccountBalanceFromCents(projectedAverageResult)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
