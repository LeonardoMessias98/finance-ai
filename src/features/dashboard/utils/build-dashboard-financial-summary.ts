import type { Account } from "@/features/accounts/types/account";
import { isCreditAccount } from "@/features/accounts/utils/account-type-compatibility";
import type { Category } from "@/features/categories/types/category";
import type {
  DashboardFinancialSummary,
  DashboardCategoryTotal,
  DashboardCreditAccountSummary
} from "@/features/dashboard/types/dashboard-financial-summary";
import { buildDashboardAnalytics, createEmptyDashboardAnalytics } from "@/features/dashboard/utils/build-dashboard-analytics";
import type { Transaction, TransactionType } from "@/features/transactions/types/transaction";
import {
  buildDebitTransactionsMonthlySummary,
  filterDebitTransactions
} from "@/features/transactions/utils/build-transaction-account-kind-groups";

const latestTransactionsLimit = 6;
const latestTransactionsPerAccountKindLimit = 3;

export function isAppliedTransaction(transaction: Transaction): boolean {
  if (transaction.type === "income") {
    return transaction.status === "received";
  }

  return transaction.status === "paid";
}

function sortTransactionsByDate(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((left, right) => {
    const dateDelta = right.date.getTime() - left.date.getTime();

    if (dateDelta !== 0) {
      return dateDelta;
    }

    return left.description.localeCompare(right.description, "pt-BR");
  });
}

function calculateAccountBalances(accounts: Account[], transactions: Transaction[]) {
  const debitAccounts = accounts.filter((account) => !isCreditAccount(account.type));
  const balanceByAccountId = new Map(debitAccounts.map((account) => [account.id, account.initialBalance]));

  for (const transaction of transactions) {
    if (!balanceByAccountId.has(transaction.accountId)) {
      continue;
    }

    if (!isAppliedTransaction(transaction)) {
      continue;
    }

    if (transaction.type === "income") {
      balanceByAccountId.set(
        transaction.accountId,
        (balanceByAccountId.get(transaction.accountId) ?? 0) + transaction.amount
      );
      continue;
    }

    if (transaction.type === "expense") {
      balanceByAccountId.set(
        transaction.accountId,
        (balanceByAccountId.get(transaction.accountId) ?? 0) - transaction.amount
      );
    }
  }

  return [...debitAccounts]
    .map((account) => ({
      accountId: account.id,
      accountName: account.name,
      accountType: account.type,
      isActive: account.isActive,
      color: account.color,
      currentBalance: balanceByAccountId.get(account.id) ?? account.initialBalance
    }))
    .sort((left, right) => {
      if (left.isActive !== right.isActive) {
        return Number(right.isActive) - Number(left.isActive);
      }

      return left.accountName.localeCompare(right.accountName, "pt-BR");
    });
}

function calculateCreditAccountSummaries(accounts: Account[], transactions: Transaction[]): DashboardCreditAccountSummary[] {
  const creditAccounts = accounts.filter((account) => isCreditAccount(account.type));

  return creditAccounts
    .map((account) => {
      const spentAmount = transactions
        .filter(
          (transaction) =>
            transaction.accountId === account.id && transaction.type === "expense" && isAppliedTransaction(transaction)
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      const paidAmount = transactions
        .filter(
          (transaction) =>
            transaction.paymentForCreditAccountId === account.id &&
            transaction.type === "expense" &&
            isAppliedTransaction(transaction)
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        accountId: account.id,
        accountName: account.name,
        accountType: account.type,
        isActive: account.isActive,
        color: account.color,
        spentAmount,
        paidAmount,
        openAmount: spentAmount - paidAmount
      };
    })
    .sort((left, right) => {
      if (left.isActive !== right.isActive) {
        return Number(right.isActive) - Number(left.isActive);
      }

      return left.accountName.localeCompare(right.accountName, "pt-BR");
    });
}

function selectLatestTransactions(transactions: Transaction[], accounts: Account[]): Transaction[] {
  const accountById = new Map(accounts.map((account) => [account.id, account]));
  const debitTransactions = transactions.filter((transaction) => {
    const account = accountById.get(transaction.accountId);

    return !account || !isCreditAccount(account.type);
  });
  const creditTransactions = transactions.filter((transaction) => {
    const account = accountById.get(transaction.accountId);

    return account ? isCreditAccount(account.type) : false;
  });

  if (debitTransactions.length === 0 || creditTransactions.length === 0) {
    return transactions.slice(0, latestTransactionsLimit);
  }

  return [
    ...debitTransactions.slice(0, latestTransactionsPerAccountKindLimit),
    ...creditTransactions.slice(0, latestTransactionsPerAccountKindLimit)
  ];
}

function aggregateCategoryTotals(transactions: Transaction[], categories: Category[]): DashboardCategoryTotal[] {
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const totalsByCategoryId = new Map<string, DashboardCategoryTotal>();

  for (const transaction of transactions) {
    const categoryId = transaction.categoryId ?? `missing:${transaction.type}`;
    const categoryName = transaction.categoryId
      ? (categoryById.get(transaction.categoryId)?.name ?? "Categoria removida")
      : "Sem categoria";
    const previousTotals = totalsByCategoryId.get(categoryId);

    totalsByCategoryId.set(categoryId, {
      categoryId: transaction.categoryId,
      categoryName,
      totalAmount: (previousTotals?.totalAmount ?? 0) + transaction.amount,
      transactionCount: (previousTotals?.transactionCount ?? 0) + 1
    });
  }

  return [...totalsByCategoryId.values()].sort((left, right) => {
    if (left.totalAmount !== right.totalAmount) {
      return right.totalAmount - left.totalAmount;
    }

    return left.categoryName.localeCompare(right.categoryName, "pt-BR");
  });
}

export function createEmptyDashboardFinancialSummary(competencyMonth: string): DashboardFinancialSummary {
  return {
    competencyMonth,
    totalCurrentBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    monthlyResult: 0,
    accountBalances: [],
    creditAccountSummaries: [],
    incomeTotalsByCategory: [],
    expenseTotalsByCategory: [],
    latestTransactions: [],
    analytics: createEmptyDashboardAnalytics(competencyMonth)
  };
}

export function buildDashboardFinancialSummary(input: {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  competencyMonth: string;
  latestTransactionsType?: TransactionType;
}): DashboardFinancialSummary {
  const monthlyTransactions = sortTransactionsByDate(
    input.transactions.filter((transaction) => transaction.competencyMonth === input.competencyMonth)
  );
  const accountBalances = calculateAccountBalances(input.accounts, monthlyTransactions);
  const creditAccountSummaries = calculateCreditAccountSummaries(input.accounts, monthlyTransactions);
  const appliedTransactions = input.transactions.filter(isAppliedTransaction);
  const appliedMonthlyTransactions = monthlyTransactions.filter(isAppliedTransaction);
  const appliedDebitTransactions = filterDebitTransactions(appliedTransactions, input.accounts);
  const appliedMonthlyDebitTransactions = filterDebitTransactions(appliedMonthlyTransactions, input.accounts);
  const monthlyIncomeTransactions = appliedMonthlyDebitTransactions.filter((transaction) => transaction.type === "income");
  const monthlyExpenseTransactions = appliedMonthlyDebitTransactions.filter(
    (transaction) => transaction.type === "expense"
  );
  const monthlyDebitSummary = buildDebitTransactionsMonthlySummary(appliedMonthlyTransactions, input.accounts);
  const expenseTotalsByCategory = aggregateCategoryTotals(monthlyExpenseTransactions, input.categories);
  const latestTransactionsCandidates = input.latestTransactionsType
    ? monthlyTransactions.filter((transaction) => transaction.type === input.latestTransactionsType)
    : monthlyTransactions;
  const latestTransactions = selectLatestTransactions(latestTransactionsCandidates, input.accounts);
  const accountById = new Map(input.accounts.map((account) => [account.id, account]));
  const categoryById = new Map(input.categories.map((category) => [category.id, category]));

  return {
    competencyMonth: input.competencyMonth,
    totalCurrentBalance: accountBalances.reduce((sum, account) => sum + account.currentBalance, 0),
    monthlyIncome: monthlyDebitSummary.incomeAmount,
    monthlyExpense: monthlyDebitSummary.expenseAmount,
    monthlyResult: monthlyDebitSummary.resultAmount,
    accountBalances,
    creditAccountSummaries,
    incomeTotalsByCategory: aggregateCategoryTotals(monthlyIncomeTransactions, input.categories),
    expenseTotalsByCategory,
    latestTransactions: latestTransactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      date: transaction.date,
      accountName: accountById.get(transaction.accountId)?.name ?? "Conta indisponível",
      accountType: accountById.get(transaction.accountId)?.type ?? "debit",
      categoryName: transaction.categoryId ? categoryById.get(transaction.categoryId)?.name : undefined
    })),
    analytics: buildDashboardAnalytics({
      competencyMonth: input.competencyMonth,
      allAppliedTransactions: appliedDebitTransactions,
      monthlyExpenseTransactions,
      expenseTotalsByCategory
    })
  };
}
