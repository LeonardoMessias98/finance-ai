import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildCategoryExpensePieGradient,
  calculateCategoryExpenseTotal,
  categoryExpensePieChartPercentFormatter,
  getCategoryExpenseSliceColor
} from "@/components/ui/category-expense-pie-chart.helpers";
import type { CategoryExpensePieChartItem } from "@/components/ui/category-expense-pie-chart.types";
import { EmptyState } from "@/components/ui/empty-state";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";

type CategoryExpensePieChartProps = {
  title: string;
  data: CategoryExpensePieChartItem[];
  emptyMessage?: string;
  description?: string;
};

const defaultEmptyMessage = "Sem gastos por categoria neste mês.";

export function CategoryExpensePieChart({
  title,
  data,
  emptyMessage = defaultEmptyMessage,
  description
}: CategoryExpensePieChartProps) {
  const totalAmount = calculateCategoryExpenseTotal(data);

  return (
    <Card aria-label={title} className="bg-background/55" role="region">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : (
          <CardDescription>{formatAccountBalanceFromCents(totalAmount)} em despesas no mês.</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState className="bg-background/60" message={emptyMessage} />
        ) : (
          <div className="grid gap-5 md:grid-cols-[9rem_1fr] md:items-center">
            <div
              aria-label={`Distribuição de gastos por categoria: ${title}`}
              className="mx-auto size-36 rounded-full border border-border shadow-panel"
              role="img"
              style={{
                background: buildCategoryExpensePieGradient(data)
              }}
            />
            <div className="space-y-3">
              {data.map((item, index) => (
                <div
                  className="grid gap-2 rounded-xl border border-border/80 bg-card/70 p-3 sm:grid-cols-[1fr_auto]"
                  key={item.categoryName}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: getCategoryExpenseSliceColor(index)
                      }}
                    />
                    <p className="truncate text-sm font-semibold text-foreground">{item.categoryName}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {formatAccountBalanceFromCents(item.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {categoryExpensePieChartPercentFormatter.format(item.percentage)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
