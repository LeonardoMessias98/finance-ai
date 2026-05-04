import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isCreditAccount } from "@/features/accounts/utils/account-type-compatibility";
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

type LatestTransactionsGroup = {
  key: "debit" | "credit";
  title: string;
  transactions: DashboardLatestTransaction[];
};

function groupLatestTransactionsByAccountKind(
  latestTransactions: DashboardLatestTransaction[]
): LatestTransactionsGroup[] {
  const debitTransactions = latestTransactions.filter((transaction) => !isCreditAccount(transaction.accountType));
  const creditTransactions = latestTransactions.filter((transaction) => isCreditAccount(transaction.accountType));
  const groups: LatestTransactionsGroup[] = [
    {
      key: "debit",
      title: "Débito",
      transactions: debitTransactions
    },
    {
      key: "credit",
      title: "Crédito",
      transactions: creditTransactions
    }
  ];

  return groups.filter((group) => group.transactions.length > 0);
}

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
  const latestTransactionGroups = groupLatestTransactionsByAccountKind(latestTransactions);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-xl">Recentes</CardTitle>
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
          <EmptyState className="rounded-xl bg-secondary" message={emptyStateMessage} />
        ) : (
          <div className="space-y-5">
            {latestTransactionGroups.map((group) => (
              <section aria-label={`Recentes ${group.title}`} className="space-y-2" key={group.key}>
                <h3 className="text-sm font-semibold text-muted-foreground">{group.title}</h3>

                <div className="space-y-2">
                  {group.transactions.map((transaction) => {
                    const editHref = buildTransactionsHref({
                      competencyMonth,
                      transactionId: transaction.id,
                      type: selectedType
                    });

                    return (
                      <div
                        className="grid gap-3 rounded-xl border border-border bg-secondary/80 p-4 lg:grid-cols-[1fr_auto]"
                        key={transaction.id}
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${getTransactionTypeDotClassName(transaction.type)}`}
                            />
                            <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatTransactionDate(transaction.date)} · {getTransactionStatusLabel(transaction.status)}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <TransactionMetaBadge>{transaction.accountName}</TransactionMetaBadge>
                            {transaction.categoryName ? (
                              <TransactionMetaBadge tone="category">{transaction.categoryName}</TransactionMetaBadge>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end">
                          <p className={`text-base font-semibold ${getTransactionTypeAmountClassName(transaction.type)}`}>
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
