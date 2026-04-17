import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardCategoryTotal } from "@/features/dashboard/types/dashboard-financial-summary";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";

type DashboardCategoryBreakdownProps = {
  title: string;
  description: string;
  emptyMessage: string;
  items: DashboardCategoryTotal[];
};

export function DashboardCategoryBreakdown({
  title,
  description,
  emptyMessage,
  items
}: DashboardCategoryBreakdownProps) {
  return (
    <Card className="border-primary/10 bg-card/85">
      <CardHeader className="space-y-1">
        <CardTitle className="font-display text-3xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-background/60 px-5 py-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                className="grid gap-3 rounded-[1.5rem] border border-border/80 bg-background/70 p-4 sm:grid-cols-[1fr_auto]"
                key={item.categoryId ?? item.categoryName}
              >
                <div>
                  <p className="text-base font-semibold text-foreground">{item.categoryName}</p>
                  <p className="text-sm text-muted-foreground">{item.transactionCount} transação(ões) aplicada(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {formatAccountBalanceFromCents(item.totalAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
