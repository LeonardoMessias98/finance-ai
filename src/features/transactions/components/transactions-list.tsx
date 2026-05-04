import Link from "next/link";
import { PencilLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Account } from "@/features/accounts/types/account";
import type { Category } from "@/features/categories/types/category";
import {
  TransactionsAccountKindGroup,
  TransactionsCreditGroup
} from "@/features/transactions/components/transactions-credit-group";
import { TransactionDeleteButton } from "@/features/transactions/components/transaction-delete-button";
import { TransactionMetaBadge } from "@/features/transactions/components/transaction-meta-badge";
import type { Transaction, TransactionType } from "@/features/transactions/types/transaction";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";
import { buildTransactionAccountKindGroups } from "@/features/transactions/utils/build-transaction-account-kind-groups";
import {
  formatTransactionAmountFromCents,
  formatTransactionCompetencyMonth,
  formatTransactionDate,
  getTransactionStatusLabel,
  getTransactionTypeAmountClassName,
  getTransactionTypeDotClassName,
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

function getStatusBadgeClassName(status: Transaction["status"]): string {
  if (status === "overdue") {
    return "bg-destructive/10 text-destructive";
  }

  if (status === "planned") {
    return "border border-border bg-secondary text-muted-foreground";
  }

  return "bg-primary/12 text-primary";
}

type TransactionDateGroup = {
  key: string;
  label: string;
  transactions: Transaction[];
};

function groupTransactionsByDate(transactions: Transaction[]): TransactionDateGroup[] {
  const groupsByDate = new Map<string, TransactionDateGroup>();

  for (const transaction of transactions) {
    const key = transaction.date.toISOString().slice(0, 10);
    const existingGroup = groupsByDate.get(key);

    if (existingGroup) {
      existingGroup.transactions.push(transaction);
      continue;
    }

    groupsByDate.set(key, {
      key,
      label: formatTransactionDate(transaction.date),
      transactions: [transaction]
    });
  }

  return [...groupsByDate.values()];
}

type TransactionCardProps = {
  transaction: Transaction;
  sourceAccount?: Account;
  paymentCreditAccount?: Account | null;
  category?: Category | null;
  editHref: string;
  redirectHref: string;
  isEditing: boolean;
};

function TransactionCard({
  transaction,
  sourceAccount,
  paymentCreditAccount,
  category,
  editHref,
  redirectHref,
  isEditing
}: TransactionCardProps) {
  const isInstallmentSeries = Boolean(transaction.installment && transaction.installment.total > 1);

  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-background/70 p-4 transition-colors sm:p-5",
        isEditing ? "border-primary/40 bg-primary/5" : ""
      )}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0 space-y-3">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full",
                getTransactionTypeDotClassName(transaction.type)
              )}
            />
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h5 className="break-words text-base font-semibold leading-snug text-foreground sm:text-lg">
                  {transaction.description}
                </h5>
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

              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <TransactionMetaBadge>{sourceAccount?.name ?? "Conta indisponível"}</TransactionMetaBadge>
                {paymentCreditAccount ? (
                  <TransactionMetaBadge>Cartão: {paymentCreditAccount.name}</TransactionMetaBadge>
                ) : null}
                <TransactionMetaBadge tone="category">{category?.name ?? "Sem categoria"}</TransactionMetaBadge>
              </div>
            </div>
          </div>

          {transaction.notes ? (
            <p className="pl-5 text-sm leading-relaxed text-muted-foreground sm:pl-6">{transaction.notes}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-border/70 pt-4 md:min-w-[11rem] md:items-end md:border-t-0 md:pt-0">
          <p className={cn("text-xl font-semibold leading-none", getTransactionTypeAmountClassName(transaction.type))}>
            {transaction.type === "income" ? "+" : "-"}
            {formatTransactionAmountFromCents(transaction.amount)}
          </p>
          {isInstallmentSeries ? <p className="text-sm text-muted-foreground">Série parcelada</p> : null}
          <div className="flex flex-wrap gap-2 md:justify-end">
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
      </div>
    </article>
  );
}

type TransactionDateGroupsProps = {
  dateGroups: TransactionDateGroup[];
  accountById: Map<string, Account>;
  categoryById: Map<string, Category>;
  editingTransactionId?: string;
  filters: TransactionsListProps["filters"];
  redirectHref: string;
};

function TransactionDateGroups({
  dateGroups,
  accountById,
  categoryById,
  editingTransactionId,
  filters,
  redirectHref
}: TransactionDateGroupsProps) {
  if (dateGroups.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
        Nenhuma transação neste grupo.
      </p>
    );
  }

  return (
    <>
      {dateGroups.map((group) => (
        <section aria-label={`Transações de ${group.label}`} className="space-y-3" key={group.key}>
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-medium text-muted-foreground">{group.label}</h4>
            <div className="h-px flex-1 bg-border/80" />
          </div>

          <div className="space-y-3">
            {group.transactions.map((transaction) => {
              const sourceAccount = accountById.get(transaction.accountId);
              const paymentCreditAccount = transaction.paymentForCreditAccountId
                ? accountById.get(transaction.paymentForCreditAccountId)
                : null;
              const category = transaction.categoryId ? categoryById.get(transaction.categoryId) : null;

              return (
                <TransactionCard
                  category={category}
                  editHref={buildTransactionsHref({
                    ...filters,
                    transactionId: transaction.id
                  })}
                  isEditing={editingTransactionId === transaction.id}
                  key={transaction.id}
                  paymentCreditAccount={paymentCreditAccount}
                  redirectHref={redirectHref}
                  sourceAccount={sourceAccount}
                  transaction={transaction}
                />
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
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
  const hasAdditionalFilters = Boolean(filters.accountId || filters.categoryId);
  const redirectHref = buildTransactionsHref(filters);
  const clearSecondaryFiltersHref = buildTransactionsHref({
    competencyMonth: filters.competencyMonth,
    type: filters.type
  });
  const formattedCompetencyMonth = formatTransactionCompetencyMonth(filters.competencyMonth);
  const emptyStateMessage = filters.type
    ? `Nenhuma ${getTransactionTypeLabel(filters.type).toLowerCase()} encontrada em ${formattedCompetencyMonth}.`
    : `Nenhuma transação encontrada em ${formattedCompetencyMonth}. Use o botão Nova transação para registrar o primeiro lançamento.`;
  const accountKindGroups = buildTransactionAccountKindGroups(transactions, accounts);

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Lançamentos do mês</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="space-y-4">
            <EmptyState
              className="rounded-xl bg-secondary"
              message={
                hasAdditionalFilters
                  ? `Nenhuma transação encontrada em ${formattedCompetencyMonth} com os filtros atuais.`
                  : emptyStateMessage
              }
            />
            {hasAdditionalFilters ? (
              <Button asChild type="button" variant="outline">
                <Link href={clearSecondaryFiltersHref}>Limpar filtros extras</Link>
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="space-y-6">
            {accountKindGroups.map((accountKindGroup) => {
              const dateGroups = groupTransactionsByDate(accountKindGroup.transactions);
              const groupContent = (
                <TransactionDateGroups
                  accountById={accountById}
                  categoryById={categoryById}
                  dateGroups={dateGroups}
                  editingTransactionId={editingTransactionId}
                  filters={filters}
                  redirectHref={redirectHref}
                />
              );

              if (accountKindGroup.key === "credit") {
                return (
                  <TransactionsCreditGroup
                    key={accountKindGroup.key}
                    title={accountKindGroup.title}
                    totalLabel={formatTransactionAmountFromCents(accountKindGroup.summaryAmount)}
                  >
                    {groupContent}
                  </TransactionsCreditGroup>
                );
              }

              return (
                <TransactionsAccountKindGroup
                  key={accountKindGroup.key}
                  summaryLabel="Resultado"
                  summaryValue={formatTransactionAmountFromCents(accountKindGroup.summaryAmount)}
                  title={accountKindGroup.title}
                >
                  {groupContent}
                </TransactionsAccountKindGroup>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
