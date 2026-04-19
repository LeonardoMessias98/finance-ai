import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { DashboardExpenseCategoryChartItem } from "@/features/dashboard/types/dashboard-analytics";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";

type ExpenseByCategoryChartProps = {
  items: DashboardExpenseCategoryChartItem[];
};

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0
});

export function ExpenseByCategoryChart({ items }: ExpenseByCategoryChartProps) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl">Onde pesou mais</CardTitle>
        <CardDescription>Distribuição das despesas aplicadas por categoria no mês selecionado.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            className="rounded-xl bg-secondary"
            message="Cadastre despesas aplicadas para enxergar a concentração por categoria."
          />
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div className="space-y-2" key={item.categoryId ?? item.categoryName}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.categoryName}</p>
                    <p className="text-xs text-muted-foreground">{item.transactionCount} lançamento(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{formatAccountBalanceFromCents(item.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">{percentFormatter.format(item.shareOfTotal)}</p>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(8, item.shareOfTotal * 100)}%`,
                      backgroundColor: `hsl(var(--destructive) / ${Math.max(0.38, 0.92 - index * 0.1)})`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
