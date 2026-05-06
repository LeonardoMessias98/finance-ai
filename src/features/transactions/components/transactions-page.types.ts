import type { TransactionType } from "@/features/transactions/types/transaction";

export type TransactionsPageFilters = {
  competencyMonth: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
};

export type TransactionsPageProps = {
  editingTransactionId?: string;
  isFiltersModalOpen?: boolean;
  filters: TransactionsPageFilters;
};

export type MonthlyDebitSummary = {
  incomeAmount: number;
  expenseAmount: number;
  resultAmount: number;
};
