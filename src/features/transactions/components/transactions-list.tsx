import Link from "next/link";
import { PencilLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Account } from "@/features/accounts/types/account";
import type { Category } from "@/features/categories/types/category";
import { TransactionDeleteButton } from "@/features/transactions/components/transaction-delete-button";
import type { Transaction, TransactionType } from "@/features/transactions/types/transaction";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";
import {
  formatTransactionAmountFromCents,
  formatTransactionCompetencyMonth,
  formatTransactionDate,
  getTransactionStatusLabel,
  getTransactionTypeLabel
} from "@/features/transactions/utils/transaction-formatters";
import { cn } from "@/lib/utils";

type TransactionsListProps = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  editingTransactionId?: string;
  filters: {
    competencyMonth: string;
    accountId?: string;
    categoryId?: string;
    type?: TransactionType;
  };
};

function getTransactionAmountClassName(transactionType: TransactionType): string {
  if (transactionType === "income") {
    return "text-income";
  }

  if (transactionType === "expense") {
    return "text-destructive";
  }

  return "text-foreground";
}

function getStatusBadgeClassName(status: Transaction["status"]): string {
  if (status === "overdue") {
    return "bg-destructive/10 text-destructive";
  }

  if (status === "planned") {
    return "border border-border bg-secondary text-muted-foreground";
  }

  return "bg-primary/12 text-primary";
}

export function TransactionsList({
  transactions,
  accounts,
  categories,
  editingTransactionId,
  filters
}: TransactionsListProps) {
  const accountById = new Map(accounts.map((account) => [account.id, account]));
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const hasAdditionalFilters = Boolean(filters.accountId || filters.categoryId || filters.type);
  const redirectHref = buildTransactionsHref(filters);
  const clearSecondaryFiltersHref = buildTransactionsHref({
    competencyMonth: filters.competencyMonth
  });
  const formattedCompetencyMonth = formatTransactionCompetencyMonth(filters.competencyMonth);

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Lançamentos do mês</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="space-y-4 rounded-xl border border-dashed border-border bg-secondary px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              {hasAdditionalFilters
                ? `Nenhuma transação encontrada em ${formattedCompetencyMonth} com os filtros atuais.`
                : `Nenhuma transação encontrada em ${formattedCompetencyMonth}. Use o formulário acima para registrar o primeiro lançamento.`}
            </p>
            {hasAdditionalFilters ? (
              <Button asChild type="button" variant="outline">
                <Link href={clearSecondaryFiltersHref}>Limpar filtros extras</Link>
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => {
              const sourceAccount = accountById.get(transaction.accountId);
              const destinationAccount = transaction.destinationAccountId
                ? accountById.get(transaction.destinationAccountId)
                : null;
              const category = transaction.categoryId ? categoryById.get(transaction.categoryId) : null;
              const editHref = buildTransactionsHref({
                ...filters,
                transactionId: transaction.id
              });
              const isInstallmentSeries = Boolean(transaction.installment && transaction.installment.total > 1);

              return (
                <div
                  className={cn(
                    "grid gap-4 rounded-xl border border-border bg-secondary/80 p-4 lg:grid-cols-[1fr_auto]",
                    editingTransactionId === transaction.id ? "border-primary/40 bg-card" : ""
                  )}
                  key={transaction.id}
                >
                  <div className="space-y-2">
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
                      <p className="text-base font-medium text-foreground">{transaction.description}</p>
                      <Badge variant="outline">{getTransactionTypeLabel(transaction.type)}</Badge>
                      <Badge className={getStatusBadgeClassName(transaction.status)}>
                        {getTransactionStatusLabel(transaction.status)}
                      </Badge>
                      {transaction.installment ? (
                        <Badge variant="secondary">
                          {transaction.installment.current}/{transaction.installment.total}
                        </Badge>
                      ) : null}
                      {transaction.isRecurring ? <Badge variant="secondary">Recorrente</Badge> : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>{formatTransactionDate(transaction.date)}</span>
                      <span>{sourceAccount?.name ?? "Conta indisponível"}</span>
                      {destinationAccount ? <span>{destinationAccount.name}</span> : null}
                      <span>{category?.name ?? "Sem categoria"}</span>
                    </div>

                    {transaction.notes ? <p className="text-sm text-muted-foreground">{transaction.notes}</p> : null}
                  </div>

                  <div className="flex flex-wrap items-start gap-3 lg:justify-end">
                    <div className="min-w-[9rem] text-right">
                      <p className={cn("text-lg font-semibold", getTransactionAmountClassName(transaction.type))}>
                        {transaction.type === "income" ? "+" : transaction.type === "expense" ? "-" : ""}
                        {formatTransactionAmountFromCents(transaction.amount)}
                      </p>
                      {isInstallmentSeries ? <p className="text-sm text-muted-foreground">Série parcelada</p> : null}
                    </div>

                    {isInstallmentSeries ? (
                      <div className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground">
                        Edição isolada indisponível
                      </div>
                    ) : (
                      <Button asChild size="sm" variant="outline">
                        <Link href={editHref}>
                          <PencilLine className="h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                    )}

                    <TransactionDeleteButton
                      isInstallmentSeries={isInstallmentSeries}
                      redirectHref={redirectHref}
                      transactionId={transaction.id}
                    />
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
