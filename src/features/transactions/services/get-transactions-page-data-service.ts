import "server-only";

import { listAccounts } from "@/features/accounts/repositories/account-repository";
import { listCategories } from "@/features/categories/repositories/category-repository";
import type { TransactionAccountKindDateGroup } from "@/features/transactions/components/transactions-list.types";
import { findTransactionById, listTransactions } from "@/features/transactions/repositories/transaction-repository";
import type { Transaction, TransactionFilters } from "@/features/transactions/types/transaction";
import {
  buildDebitTransactionsMonthlySummary,
  type DebitTransactionsMonthlySummary
} from "@/features/transactions/utils/build-transaction-account-kind-groups";
import { buildTransactionsListView } from "@/features/transactions/utils/build-transactions-list-view";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

type TransactionsPageDataFilters = Pick<TransactionFilters, "competencyMonth" | "accountId" | "categoryId" | "type">;

export type TransactionsPageData = {
  accounts: Awaited<ReturnType<typeof listAccounts>>;
  categories: Awaited<ReturnType<typeof listCategories>>;
  transactions: Transaction[];
  editingTransaction: Transaction | null;
  monthlyDebitSummary: DebitTransactionsMonthlySummary;
  accountKindGroups: TransactionAccountKindDateGroup[];
};

export async function getTransactionsPageData(input: {
  filters: TransactionsPageDataFilters;
  editingTransactionId?: string;
}): Promise<TransactionsPageData> {
  const user = await requireAuthenticatedAppUser();
  const [transactions, editingTransaction, accounts, categories] = await Promise.all([
    listTransactions({
      userId: user.id,
      ...input.filters
    }),
    input.editingTransactionId ? findTransactionById(input.editingTransactionId, user.id) : Promise.resolve(null),
    listAccounts({
      userId: user.id
    }),
    listCategories({
      userId: user.id
    })
  ]);

  return {
    accounts,
    categories,
    transactions,
    editingTransaction,
    monthlyDebitSummary: buildDebitTransactionsMonthlySummary(transactions, accounts),
    accountKindGroups: buildTransactionsListView({
      transactions,
      accounts,
      categories
    })
  };
}
