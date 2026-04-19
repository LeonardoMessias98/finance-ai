import type { TransactionType } from "@/features/transactions/types/transaction";

type BuildTransactionsHrefInput = {
  transactionId?: string;
  competencyMonth?: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  filtersModal?: boolean;
};

export function buildTransactionsHref(input: BuildTransactionsHrefInput = {}): string {
  const searchParams = new URLSearchParams();

  if (input.transactionId) {
    searchParams.set("transactionId", input.transactionId);
  }

  if (input.competencyMonth) {
    searchParams.set("competencyMonth", input.competencyMonth);
  }

  if (input.accountId) {
    searchParams.set("accountId", input.accountId);
  }

  if (input.categoryId) {
    searchParams.set("categoryId", input.categoryId);
  }

  if (input.type) {
    searchParams.set("type", input.type);
  }

  if (input.filtersModal) {
    searchParams.set("filters", "open");
  }

  const queryString = searchParams.toString();

  return queryString.length > 0 ? `/transactions?${queryString}` : "/transactions";
}
