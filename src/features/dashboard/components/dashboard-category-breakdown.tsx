import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { dashboardListCardsStyles } from "@/features/dashboard/components/dashboard-list-cards.styles";
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
    <Card className={dashboardListCardsStyles.card}>
      <CardHeader className={dashboardListCardsStyles.header}>
        <CardTitle className={dashboardListCardsStyles.title}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState className={dashboardListCardsStyles.emptyState} message={emptyMessage} />
        ) : (
          <div className={dashboardListCardsStyles.list}>
            {items.map((item) => (
              <div
                className={dashboardListCardsStyles.categoryItem}
                key={item.categoryId ?? item.categoryName}
              >
                <div>
                  <p className={dashboardListCardsStyles.categoryName}>{item.categoryName}</p>
                  <p className={dashboardListCardsStyles.description}>{item.transactionCount} transação(ões) aplicada(s)</p>
                </div>
                <div className={dashboardListCardsStyles.valueContainer}>
                  <p className={dashboardListCardsStyles.value}>
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
