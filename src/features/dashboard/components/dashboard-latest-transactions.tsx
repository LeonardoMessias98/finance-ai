import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardLatestTransaction } from "@/features/dashboard/types/dashboard-financial-summary";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";
import {
  formatTransactionAmountFromCents,
  formatTransactionDate,
  getTransactionStatusLabel,
  getTransactionTypeLabel
} from "@/features/transactions/utils/transaction-formatters";
import { cn } from "@/lib/utils";

type DashboardLatestTransactionsProps = {
  competencyMonth: string;
  latestTransactions: DashboardLatestTransaction[];
};

function getAmountClassName(type: DashboardLatestTransaction["type"]): string {
  if (type === "income") {
    return "text-income";
  }

  if (type === "expense") {
    return "text-destructive";
  }

  return "text-foreground";
}

export function DashboardLatestTransactions({ competencyMonth, latestTransactions }: DashboardLatestTransactionsProps) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Recentes</CardTitle>
        <CardDescription>Entradas e saídas do mês selecionado.</CardDescription>
      </CardHeader>
      <CardContent>
        {latestTransactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-secondary px-4 py-8 text-center text-sm text-muted-foreground">
            Nenhuma transação neste mês.
          </div>
        ) : (
          <div className="space-y-2">
            {latestTransactions.map((transaction) => {
              const editHref = buildTransactionsHref({
                competencyMonth,
                transactionId: transaction.id
              });

              return (
                <div
                  className="grid gap-3 rounded-xl border border-border bg-secondary/80 p-4 lg:grid-cols-[1fr_auto]"
                  key={transaction.id}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          transaction.type === "income"
                            ? "bg-income"
                            : transaction.type === "expense"
                              ? "bg-destructive"
                              : "bg-primary"
                        )}
                      />
                      <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatTransactionDate(transaction.date)} · {getTransactionTypeLabel(transaction.type)} ·{" "}
                      {getTransactionStatusLabel(transaction.status)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.accountName}
                      {transaction.destinationAccountName ? ` -> ${transaction.destinationAccountName}` : ""}
                      {transaction.categoryName ? ` · ${transaction.categoryName}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end">
                    <p className={cn("text-base font-semibold", getAmountClassName(transaction.type))}>
                      {transaction.type === "income" ? "+" : transaction.type === "expense" ? "-" : ""}
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
        )}
      </CardContent>
    </Card>
  );
}
