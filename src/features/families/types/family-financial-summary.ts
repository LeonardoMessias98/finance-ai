import type { DashboardLatestTransaction } from "@/features/dashboard/types/dashboard-financial-summary";
import type { Family } from "@/features/families/types/family";

export type FamilyMemberCategoryExpense = {
  categoryId?: string;
  categoryName: string;
  amount: number;
  percentage: number;
};

export type FamilyMemberCategoryExpenseGroup = {
  totalExpenses: number;
  expensesByCategory: FamilyMemberCategoryExpense[];
};

export type FamilyMemberCategoryExpenseBreakdown = {
  memberId: string;
  memberName: string;
  debit: FamilyMemberCategoryExpenseGroup;
  credit: FamilyMemberCategoryExpenseGroup;
};

export type FamilyMemberFinancialSummary = {
  userId: string;
  displayName: string;
  role: "owner" | "member";
  canView: boolean;
  totalCurrentBalance: number;
  monthlyIncome: number;
  monthlyDebitIncome: number;
  monthlyExpense: number;
  monthlyDebitExpense: number;
  monthlyCreditExpense: number;
  monthlyResult: number;
  latestTransactions: DashboardLatestTransaction[];
  expenseCategoryBreakdown: FamilyMemberCategoryExpenseBreakdown;
};

export type FamilyFinancialSummary = {
  family: Family;
  competencyMonth: string;
  members: FamilyMemberFinancialSummary[];
  totalCurrentBalance: number;
  monthlyIncome: number;
  monthlyDebitIncome: number;
  monthlyExpense: number;
  monthlyDebitExpense: number;
  monthlyCreditExpense: number;
  monthlyResult: number;
};
