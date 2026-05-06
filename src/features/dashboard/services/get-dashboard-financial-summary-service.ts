import "server-only";

import { listAccounts } from "@/features/accounts/repositories/account-repository";
import { listCategories } from "@/features/categories/repositories/category-repository";
import {
  listTransactionMonthReferences,
  listTransactionsForDashboard
} from "@/features/transactions/repositories/transaction-repository";
import type { TransactionType } from "@/features/transactions/types/transaction";
import { buildDashboardFinancialSummary } from "@/features/dashboard/utils/build-dashboard-financial-summary";
import { listDashboardDataCompetencyMonths } from "@/features/dashboard/utils/dashboard-month-navigation";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

type GetDashboardFinancialSummaryInput = {
  competencyMonth: string;
  latestTransactionsType?: TransactionType;
};

export async function getDashboardFinancialSummary(input: GetDashboardFinancialSummaryInput) {
  const user = await requireAuthenticatedAppUser();
  const dashboardCompetencyMonths = listDashboardDataCompetencyMonths(input.competencyMonth);

  const [accounts, categories, transactions, monthNavigationTransactions] = await Promise.all([
    listAccounts({
      userId: user.id
    }),
    listCategories({
      userId: user.id
    }),
    listTransactionsForDashboard({
      userId: user.id,
      competencyMonths: dashboardCompetencyMonths
    }),
    listTransactionMonthReferences(user.id)
  ]);

  return buildDashboardFinancialSummary({
    accounts,
    categories,
    transactions,
    monthNavigationTransactions,
    competencyMonth: input.competencyMonth,
    latestTransactionsType: input.latestTransactionsType
  });
}
