import type { TransactionsPageFilters } from "@/features/transactions/components/transactions-page.types";

export function countActiveTransactionFilters(filters: TransactionsPageFilters): number {
  return [filters.accountId, filters.categoryId, filters.type].filter(Boolean).length;
}
