import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TransactionDateGroups } from "@/features/transactions/components/transaction-date-groups";
import {
  TransactionsAccountKindGroup,
  TransactionsCreditGroup
} from "@/features/transactions/components/transactions-credit-group";
import { transactionsListStyles } from "@/features/transactions/components/transactions-list.styles";
import type { TransactionsListProps } from "@/features/transactions/components/transactions-list.types";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";
import {
  formatTransactionAmountFromCents,
  formatTransactionCompetencyMonth,
  getTransactionTypeLabel
} from "@/features/transactions/utils/transaction-formatters";

export function TransactionsList({
  transactionCount,
  accountKindGroups,
  editingTransactionId,
  filters
}: TransactionsListProps) {
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

  return (
    <Card>
      <CardHeader className={transactionsListStyles.header}>
        <CardTitle className={transactionsListStyles.title}>Lançamentos do mês</CardTitle>
      </CardHeader>
      <CardContent>
        {transactionCount === 0 ? (
          <div className={transactionsListStyles.emptyContainer}>
            <EmptyState
              className={transactionsListStyles.emptyState}
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
          <div className={transactionsListStyles.groups}>
            {accountKindGroups.map((accountKindGroup) => {
              const groupContent = (
                <TransactionDateGroups
                  dateGroups={accountKindGroup.dateGroups}
                  editingTransactionId={editingTransactionId}
                  filters={filters}
                  redirectHref={redirectHref}
                />
              );

              return accountKindGroup.key === "credit" ? (
                <TransactionsCreditGroup
                  key={accountKindGroup.key}
                  title={accountKindGroup.title}
                  totalLabel={formatTransactionAmountFromCents(accountKindGroup.summaryAmount)}
                >
                  {groupContent}
                </TransactionsCreditGroup>
              ) : (
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
