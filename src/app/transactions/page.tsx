import { TransactionsPage } from "@/features/transactions/components/transactions-page";
import { transactionTypeValues, type TransactionType } from "@/features/transactions/types/transaction";
import { getCurrentCompetencyMonth, isCompetencyMonth } from "@/lib/dates/competency-month";

type TransactionsRoutePageProps = {
  searchParams?: Promise<{
    transactionId?: string | string[];
    competencyMonth?: string | string[];
    accountId?: string | string[];
    categoryId?: string | string[];
    type?: string | string[];
  }>;
};

function isTransactionType(value: string): value is TransactionType {
  return transactionTypeValues.includes(value as TransactionType);
}

export default async function TransactionsRoutePage({ searchParams }: TransactionsRoutePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const editingTransactionId =
    typeof resolvedSearchParams.transactionId === "string" ? resolvedSearchParams.transactionId : undefined;
  const competencyMonth =
    typeof resolvedSearchParams.competencyMonth === "string" && isCompetencyMonth(resolvedSearchParams.competencyMonth)
      ? resolvedSearchParams.competencyMonth
      : getCurrentCompetencyMonth();
  const accountId = typeof resolvedSearchParams.accountId === "string" ? resolvedSearchParams.accountId : undefined;
  const categoryId =
    typeof resolvedSearchParams.categoryId === "string" ? resolvedSearchParams.categoryId : undefined;
  const selectedType =
    typeof resolvedSearchParams.type === "string" && isTransactionType(resolvedSearchParams.type)
      ? resolvedSearchParams.type
      : undefined;

  return (
    <TransactionsPage
      editingTransactionId={editingTransactionId}
      filters={{
        competencyMonth,
        accountId,
        categoryId,
        type: selectedType
      }}
    />
  );
}
