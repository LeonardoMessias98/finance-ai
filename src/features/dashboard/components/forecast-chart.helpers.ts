import type { DashboardForecastSeriesPoint } from "@/features/dashboard/types/dashboard-analytics";

export function calculateProjectedAverageResult(points: DashboardForecastSeriesPoint[]): number {
  if (points.length === 0) {
    return 0;
  }

  const totalProjectedResult = points.reduce((sum, point) => sum + point.estimatedResult, 0);

  return Math.round(totalProjectedResult / points.length);
}
