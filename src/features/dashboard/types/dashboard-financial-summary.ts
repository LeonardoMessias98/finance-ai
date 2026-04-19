import type { AccountType } from "@/features/accounts/types/account";
import type { DashboardAnalytics } from "@/features/dashboard/types/dashboard-analytics";
import type { TransactionStatus, TransactionType } from "@/features/transactions/types/transaction";

export type DashboardAccountBalance = {
  accountId: string;
  accountName: string;
  accountType: AccountType;
  isActive: boolean;
  color?: string;
  currentBalance: number;
};

export type DashboardCategoryTotal = {
  categoryId?: string;
  categoryName: string;
  totalAmount: number;
  transactionCount: number;
};

export type DashboardLatestTransaction = {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: Date;
  accountName: string;
  categoryName?: string;
};

export type DashboardFinancialSummary = {
  competencyMonth: string;
  totalCurrentBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyResult: number;
  accountBalances: DashboardAccountBalance[];
  incomeTotalsByCategory: DashboardCategoryTotal[];
  expenseTotalsByCategory: DashboardCategoryTotal[];
  latestTransactions: DashboardLatestTransaction[];
  analytics: DashboardAnalytics;
};
