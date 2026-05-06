import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { groupDashboardLatestTransactionsByAccountKind } from "@/features/dashboard/components/dashboard-latest-transactions.helpers";
import { dashboardLatestTransactionsStyles } from "@/features/dashboard/components/dashboard-latest-transactions.styles";
import type { DashboardLatestTransaction } from "@/features/dashboard/types/dashboard-financial-summary";
import { TransactionMetaBadge } from "@/features/transactions/components/transaction-meta-badge";
import { TransactionTypeFilter } from "@/features/transactions/components/transaction-type-filter";
import type { TransactionType } from "@/features/transactions/types/transaction";
import { buildDashboardHref } from "@/features/dashboard/utils/build-dashboard-href";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";
import {
  formatTransactionAmountFromCents,
  formatTransactionDate,
  getTransactionTypeAmountClassName,
  getTransactionTypeDotClassName,
  getTransactionStatusLabel,
  getTransactionTypeLabel
} from "@/features/transactions/utils/transaction-formatters";

type DashboardLatestTransactionsProps = {
  competencyMonth: string;
  latestTransactions: DashboardLatestTransaction[];
  selectedType?: TransactionType;
};

export function DashboardLatestTransactions({
  competencyMonth,
  latestTransactions,
  selectedType
}: DashboardLatestTransactionsProps) {
  const transactionsHref = buildTransactionsHref({
    competencyMonth,
    type: selectedType
  });
  const emptyStateMessage = selectedType
    ? `Nenhuma ${getTransactionTypeLabel(selectedType).toLowerCase()} neste mês.`
    : "Nenhuma transação neste mês.";
  const latestTransactionGroups = groupDashboardLatestTransactionsByAccountKind(latestTransactions);

  return (
    <Card>
      <CardHeader className={dashboardLatestTransactionsStyles.header}>
        <div className={dashboardLatestTransactionsStyles.headerRow}>
          <CardTitle className={dashboardLatestTransactionsStyles.title}>Recentes</CardTitle>
          <Button asChild size="sm" variant="ghost">
            <Link href={transactionsHref}>Histórico</Link>
          </Button>
        </div>

        <TransactionTypeFilter
          buildHref={(type) =>
            buildDashboardHref({
              competencyMonth,
              type
            })
          }
          selectedType={selectedType}
        />
      </CardHeader>
      <CardContent>
        {latestTransactions.length === 0 ? (
          <EmptyState className={dashboardLatestTransactionsStyles.emptyState} message={emptyStateMessage} />
        ) : (
          <div className={dashboardLatestTransactionsStyles.groupList}>
            {latestTransactionGroups.map((group) => (
              <section aria-label={`Recentes ${group.title}`} className={dashboardLatestTransactionsStyles.group} key={group.key}>
                <h3 className={dashboardLatestTransactionsStyles.groupTitle}>{group.title}</h3>

                <div className={dashboardLatestTransactionsStyles.transactionList}>
                  {group.transactions.map((transaction) => {
                    const editHref = buildTransactionsHref({
                      competencyMonth,
                      transactionId: transaction.id,
                      type: selectedType
                    });

                    return (
                      <div
                        className={dashboardLatestTransactionsStyles.transactionItem}
                        key={transaction.id}
                      >
                        <div className={dashboardLatestTransactionsStyles.transactionMain}>
                          <div className={dashboardLatestTransactionsStyles.descriptionRow}>
                            <span
                              className={`${dashboardLatestTransactionsStyles.typeDot} ${getTransactionTypeDotClassName(transaction.type)}`}
                            />
                            <p className={dashboardLatestTransactionsStyles.description}>{transaction.description}</p>
                          </div>
                          <p className={dashboardLatestTransactionsStyles.metaText}>
                            {formatTransactionDate(transaction.date)} · {getTransactionStatusLabel(transaction.status)}
                          </p>
                          <div className={dashboardLatestTransactionsStyles.metaList}>
                            <TransactionMetaBadge>{transaction.accountName}</TransactionMetaBadge>
                            {transaction.categoryName ? (
                              <TransactionMetaBadge tone="category">{transaction.categoryName}</TransactionMetaBadge>
                            ) : null}
                          </div>
                        </div>
                        <div className={dashboardLatestTransactionsStyles.transactionAside}>
                          <p className={`${dashboardLatestTransactionsStyles.amount} ${getTransactionTypeAmountClassName(transaction.type)}`}>
                            {transaction.type === "income" ? "+" : "-"}
                            {formatTransactionAmountFromCents(transaction.amount)}
                          </p>
                          <Button asChild size="sm" variant="ghost">
                            <Link href={editHref}>Editar</Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
