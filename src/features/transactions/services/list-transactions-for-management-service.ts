import "server-only";

import type { TransactionFilters } from "@/features/transactions/types/transaction";
import { listTransactions } from "@/features/transactions/repositories/transaction-repository";

type TransactionManagementFilters = Pick<TransactionFilters, "competencyMonth" | "accountId" | "categoryId" | "type">;

export async function listTransactionsForManagement(filters: TransactionManagementFilters = {}) {
  return listTransactions(filters);
}
