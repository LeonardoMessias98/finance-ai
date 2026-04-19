import { ExpenseByCategoryChart } from "@/features/dashboard/components/expense-by-category-chart";
import { ForecastChart } from "@/features/dashboard/components/forecast-chart";
import { MonthlyBalanceLineChart } from "@/features/dashboard/components/monthly-balance-line-chart";
import { MonthlyExpenseCard } from "@/features/dashboard/components/monthly-expense-card";
import type { DashboardAnalytics } from "@/features/dashboard/types/dashboard-analytics";

type DashboardAnalyticsSectionProps = {
  analytics: DashboardAnalytics;
};

export function DashboardAnalyticsSection({ analytics }: DashboardAnalyticsSectionProps) {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">Leitura mensal</h2>
        <p className="text-sm text-muted-foreground">Resumo visual do mês atual, histórico recente e estimativa simples.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <MonthlyExpenseCard expenseInsight={analytics.expenseInsight} />
        <ExpenseByCategoryChart items={analytics.expenseByCategory} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <MonthlyBalanceLineChart points={analytics.monthlyHistory} />
        <ForecastChart description={analytics.forecastDescription} points={analytics.forecast} />
      </div>
    </section>
  );
}
