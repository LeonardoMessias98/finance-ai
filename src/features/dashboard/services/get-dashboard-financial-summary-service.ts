import "server-only";

import { listAccountsForManagement } from "@/features/accounts/services/list-accounts-for-management-service";
import { listCategoriesForManagement } from "@/features/categories/services/list-categories-for-management-service";
import { listTransactionsForManagement } from "@/features/transactions/services/list-transactions-for-management-service";
import type { TransactionType } from "@/features/transactions/types/transaction";
import { buildDashboardFinancialSummary } from "@/features/dashboard/utils/build-dashboard-financial-summary";

type GetDashboardFinancialSummaryInput = {
  competencyMonth: string;
  latestTransactionsType?: TransactionType;
};

export async function getDashboardFinancialSummary(input: GetDashboardFinancialSummaryInput) {
  const [accounts, categories, transactions] = await Promise.all([
    listAccountsForManagement(),
    listCategoriesForManagement(),
    listTransactionsForManagement({
      competencyMonth: input.competencyMonth
    })
  ]);

  return buildDashboardFinancialSummary({
    accounts,
    categories,
    transactions,
    competencyMonth: input.competencyMonth,
    latestTransactionsType: input.latestTransactionsType
  });
}
