import "server-only";

import type { TransactionFilters } from "@/features/transactions/types/transaction";
import { listTransactions } from "@/features/transactions/repositories/transaction-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

type TransactionManagementFilters = Pick<TransactionFilters, "competencyMonth" | "accountId" | "categoryId" | "type">;

export async function listTransactionsForManagement(filters: TransactionManagementFilters = {}) {
  const user = await requireAuthenticatedAppUser();

  return listTransactions({
    userId: user.id,
    ...filters
  });
}
