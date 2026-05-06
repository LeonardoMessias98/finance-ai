import "server-only";

import type { Account } from "@/features/accounts/types/account";
import { listAccounts } from "@/features/accounts/repositories/account-repository";
import { isCreditAccount } from "@/features/accounts/utils/account-type-compatibility";
import { findUserById } from "@/features/auth/repositories/user-repository";
import { listCategories } from "@/features/categories/repositories/category-repository";
import type { Category } from "@/features/categories/types/category";
import { buildDashboardFinancialSummary } from "@/features/dashboard/utils/build-dashboard-financial-summary";
import { findFirstFamilyForMember } from "@/features/families/repositories/family-repository";
import type {
  FamilyFinancialSummary,
  FamilyMemberCategoryExpense,
  FamilyMemberCategoryExpenseBreakdown,
  FamilyMemberCategoryExpenseGroup,
  FamilyMemberFinancialSummary
} from "@/features/families/types/family-financial-summary";
import { listTransactions } from "@/features/transactions/repositories/transaction-repository";
import type { Transaction } from "@/features/transactions/types/transaction";
import { buildTransactionAccountKindGroups } from "@/features/transactions/utils/build-transaction-account-kind-groups";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

type GetFamilyFinancialSummaryInput = {
  competencyMonth: string;
};

function buildDisplayName(input: {
  firstName?: string;
  lastName?: string;
  email?: string;
  fallbackUserId: string;
}): string {
  const fullName = [input.firstName, input.lastName].filter(Boolean).join(" ").trim();

  return fullName || input.email || input.fallbackUserId;
}

function buildMemberCategoryExpenses(input: {
  memberId: string;
  memberName: string;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
}): FamilyMemberCategoryExpenseBreakdown {
  const accountById = new Map(input.accounts.map((account) => [account.id, account]));
  const categoryById = new Map(input.categories.map((category) => [category.id, category]));
  const debitTotalsByCategory = new Map<string, Omit<FamilyMemberCategoryExpense, "percentage">>();
  const creditTotalsByCategory = new Map<string, Omit<FamilyMemberCategoryExpense, "percentage">>();

  for (const transaction of input.transactions) {
    if (transaction.type !== "expense") {
      continue;
    }

    const account = accountById.get(transaction.accountId);
    const isCreditExpense = account ? isCreditAccount(account.type) : false;
    const categoryKey = transaction.categoryId ?? "uncategorized";
    const totalsByCategory = isCreditExpense ? creditTotalsByCategory : debitTotalsByCategory;
    const previousTotal = totalsByCategory.get(categoryKey);
    const categoryName = transaction.categoryId
      ? (categoryById.get(transaction.categoryId)?.name ?? "Sem categoria")
      : "Sem categoria";

    totalsByCategory.set(categoryKey, {
      categoryId: transaction.categoryId,
      categoryName,
      amount: (previousTotal?.amount ?? 0) + transaction.amount
    });
  }

  return {
    memberId: input.memberId,
    memberName: input.memberName,
    debit: buildCategoryExpenseGroup(debitTotalsByCategory),
    credit: buildCategoryExpenseGroup(creditTotalsByCategory)
  };
}

function buildCategoryExpenseGroup(
  totalsByCategory: Map<string, Omit<FamilyMemberCategoryExpense, "percentage">>
): FamilyMemberCategoryExpenseGroup {
  let totalExpenses = 0;
  const categories = [...totalsByCategory.values()];

  for (const category of categories) {
    totalExpenses += category.amount;
  }

  const expensesByCategory = categories
    .map((category) => ({
      ...category,
      percentage: totalExpenses > 0 ? category.amount / totalExpenses : 0
    }))
    .sort((left, right) => {
      if (left.amount !== right.amount) {
        return right.amount - left.amount;
      }

      return left.categoryName.localeCompare(right.categoryName, "pt-BR");
    });

  return {
    totalExpenses,
    expensesByCategory
  };
}

function extractCreditExpenseAmount(breakdown: FamilyMemberCategoryExpenseBreakdown): number {
  return breakdown.credit.totalExpenses;
}

function extractDebitExpenseAmount(breakdown: FamilyMemberCategoryExpenseBreakdown): number {
  return breakdown.debit.totalExpenses;
}

function extractDebitIncomeAmount(transactions: Transaction[]): number {
  let incomeAmount = 0;

  for (const transaction of transactions) {
    if (transaction.type === "income") {
      incomeAmount += transaction.amount;
    }
  }

  return incomeAmount;
}

function buildFamilyTotals(members: FamilyMemberFinancialSummary[]) {
  return members.reduce(
    (totals, member) => ({
      totalCurrentBalance: totals.totalCurrentBalance + member.totalCurrentBalance,
      monthlyIncome: totals.monthlyIncome + member.monthlyIncome,
      monthlyDebitIncome: totals.monthlyDebitIncome + member.monthlyDebitIncome,
      monthlyExpense: totals.monthlyExpense + member.monthlyExpense,
      monthlyDebitExpense: totals.monthlyDebitExpense + member.monthlyDebitExpense,
      monthlyCreditExpense: totals.monthlyCreditExpense + member.monthlyCreditExpense,
      monthlyResult: totals.monthlyResult + member.monthlyResult
    }),
    {
      totalCurrentBalance: 0,
      monthlyIncome: 0,
      monthlyDebitIncome: 0,
      monthlyExpense: 0,
      monthlyDebitExpense: 0,
      monthlyCreditExpense: 0,
      monthlyResult: 0
    }
  );
}

function buildMemberSummaryResult(input: {
  userId: string;
  displayName: string;
  role: "owner" | "member";
  canView: boolean;
  summary: ReturnType<typeof buildDashboardFinancialSummary>;
  debitTransactions: Transaction[];
  expenseCategoryBreakdown: FamilyMemberCategoryExpenseBreakdown;
}): FamilyMemberFinancialSummary {
  const debitIncomeAmount = extractDebitIncomeAmount(input.debitTransactions);
  const debitExpenseAmount = extractDebitExpenseAmount(input.expenseCategoryBreakdown);
  const creditExpenseAmount = extractCreditExpenseAmount(input.expenseCategoryBreakdown);

  return {
    userId: input.userId,
    displayName: input.displayName,
    role: input.role,
    canView: input.canView,
    totalCurrentBalance: input.summary.totalCurrentBalance,
    monthlyIncome: input.summary.monthlyIncome,
    monthlyDebitIncome: debitIncomeAmount,
    monthlyExpense: input.summary.monthlyExpense,
    monthlyDebitExpense: debitExpenseAmount,
    monthlyCreditExpense: creditExpenseAmount,
    monthlyResult: debitIncomeAmount - debitExpenseAmount,
    latestTransactions: input.summary.latestTransactions,
    expenseCategoryBreakdown: input.expenseCategoryBreakdown
  };
}

async function buildMemberSummary(input: {
  userId: string;
  role: "owner" | "member";
  canView: boolean;
  competencyMonth: string;
}): Promise<FamilyMemberFinancialSummary> {
  const [user, accounts, categories, transactions] = await Promise.all([
    findUserById(input.userId),
    listAccounts({
      userId: input.userId
    }),
    listCategories({
      userId: input.userId
    }),
    listTransactions({
      userId: input.userId,
      competencyMonth: input.competencyMonth
    })
  ]);
  const summary = buildDashboardFinancialSummary({
    accounts,
    categories,
    transactions,
    competencyMonth: input.competencyMonth
  });
  const accountKindGroups = buildTransactionAccountKindGroups(transactions, accounts);
  const debitTransactions = accountKindGroups.find((group) => group.key === "debit")?.transactions ?? [];
  const displayName = buildDisplayName({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    fallbackUserId: input.userId
  });
  const expenseCategoryBreakdown = buildMemberCategoryExpenses({
    memberId: input.userId,
    memberName: displayName,
    accounts,
    categories,
    transactions
  });

  return buildMemberSummaryResult({
    userId: input.userId,
    displayName,
    role: input.role,
    canView: input.canView,
    summary,
    debitTransactions,
    expenseCategoryBreakdown
  });
}

export async function getFamilyFinancialSummary(
  input: GetFamilyFinancialSummaryInput
): Promise<FamilyFinancialSummary | null> {
  const user = await requireAuthenticatedAppUser();
  const family = await findFirstFamilyForMember(user.id);

  if (!family) {
    return null;
  }

  const viewableMembers = family.members.filter((member) => member.canView);
  const members = await Promise.all(
    viewableMembers.map((member) =>
      buildMemberSummary({
        userId: member.userId,
        role: member.role,
        canView: member.canView,
        competencyMonth: input.competencyMonth
      })
    )
  );
  const totals = buildFamilyTotals(members);

  return {
    family,
    competencyMonth: input.competencyMonth,
    members,
    ...totals
  };
}
