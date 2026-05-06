import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  dashboardAnalyticsCardsStyles,
  getProjectedResultClassName
} from "@/features/dashboard/components/dashboard-analytics-cards.styles";
import { DashboardLineChart } from "@/features/dashboard/components/dashboard-line-chart";
import { calculateProjectedAverageResult } from "@/features/dashboard/components/forecast-chart.helpers";
import type { DashboardForecastSeriesPoint } from "@/features/dashboard/types/dashboard-analytics";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";

type ForecastChartProps = {
  points: DashboardForecastSeriesPoint[];
  description: string;
};

export function ForecastChart({ points, description }: ForecastChartProps) {
  const projectedAverageResult = calculateProjectedAverageResult(points);

  return (
    <Card>
      <CardHeader className={dashboardAnalyticsCardsStyles.headerSpacious}>
        <div className={dashboardAnalyticsCardsStyles.headerCompact}>
          <CardTitle className={dashboardAnalyticsCardsStyles.title}>Próximos meses</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        <div className={dashboardAnalyticsCardsStyles.legend}>
          <div className={dashboardAnalyticsCardsStyles.legendItem}>
            <span
              aria-hidden="true"
              className={dashboardAnalyticsCardsStyles.legendDot}
              style={{ backgroundColor: "hsl(var(--income))" }}
            />
            <span className={dashboardAnalyticsCardsStyles.mutedText}>Entradas estimadas</span>
          </div>
          <div className={dashboardAnalyticsCardsStyles.legendItem}>
            <span
              aria-hidden="true"
              className={dashboardAnalyticsCardsStyles.legendDot}
              style={{ backgroundColor: "hsl(var(--destructive))" }}
            />
            <span className={dashboardAnalyticsCardsStyles.mutedText}>Saídas estimadas</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className={dashboardAnalyticsCardsStyles.forecastContent}>
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

        <div className={dashboardAnalyticsCardsStyles.metricPanel}>
          <p className={dashboardAnalyticsCardsStyles.metricLabel}>Resultado médio estimado</p>
          <p className={getProjectedResultClassName(projectedAverageResult)}>
            {formatAccountBalanceFromCents(projectedAverageResult)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
