import type { Account } from "@/features/accounts/types/account";
import type { Category } from "@/features/categories/types/category";
import type { Transaction, TransactionType } from "@/features/transactions/types/transaction";
import type { TransactionAccountKindGroupKey } from "@/features/transactions/utils/build-transaction-account-kind-groups";

export type TransactionsListFilters = {
  competencyMonth: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
};

export type TransactionsListProps = {
  transactionCount: number;
  accountKindGroups: TransactionAccountKindDateGroup[];
  editingTransactionId?: string;
  filters: TransactionsListFilters;
};

export type TransactionListItem = {
  transaction: Transaction;
  sourceAccount?: Account;
  paymentCreditAccount?: Account | null;
  category?: Category | null;
};

export type TransactionDateGroup = {
  key: string;
  label: string;
  transactions: TransactionListItem[];
};

export type TransactionAccountKindDateGroup = {
  key: TransactionAccountKindGroupKey;
  title: string;
  summaryAmount: number;
  dateGroups: TransactionDateGroup[];
};

export type TransactionCardProps = {
  transaction: Transaction;
  sourceAccount?: Account;
  paymentCreditAccount?: Account | null;
  category?: Category | null;
  editHref: string;
  redirectHref: string;
  isEditing: boolean;
};

export type TransactionDateGroupsProps = {
  dateGroups: TransactionDateGroup[];
  editingTransactionId?: string;
  filters: TransactionsListFilters;
  redirectHref: string;
};
