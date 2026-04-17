import type { Account } from "@/features/accounts/types/account";
import type { Category } from "@/features/categories/types/category";
import type { DashboardFinancialSummary, DashboardCategoryTotal } from "@/features/dashboard/types/dashboard-financial-summary";
import type { Transaction, TransactionType } from "@/features/transactions/types/transaction";

const latestTransactionsLimit = 6;

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
  const balanceByAccountId = new Map(accounts.map((account) => [account.id, account.initialBalance]));

  for (const transaction of transactions) {
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
      continue;
    }

    balanceByAccountId.set(
      transaction.accountId,
      (balanceByAccountId.get(transaction.accountId) ?? 0) - transaction.amount
    );

    if (transaction.destinationAccountId) {
      balanceByAccountId.set(
        transaction.destinationAccountId,
        (balanceByAccountId.get(transaction.destinationAccountId) ?? 0) + transaction.amount
      );
    }
  }

  return [...accounts]
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
    incomeTotalsByCategory: [],
    expenseTotalsByCategory: [],
    latestTransactions: []
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
  const appliedMonthlyTransactions = monthlyTransactions.filter(isAppliedTransaction);
  const monthlyIncomeTransactions = appliedMonthlyTransactions.filter((transaction) => transaction.type === "income");
  const monthlyExpenseTransactions = appliedMonthlyTransactions.filter((transaction) => transaction.type === "expense");
  const latestTransactions = (input.latestTransactionsType
    ? monthlyTransactions.filter((transaction) => transaction.type === input.latestTransactionsType)
    : monthlyTransactions
  ).slice(0, latestTransactionsLimit);
  const accountById = new Map(input.accounts.map((account) => [account.id, account]));
  const categoryById = new Map(input.categories.map((category) => [category.id, category]));

  return {
    competencyMonth: input.competencyMonth,
    totalCurrentBalance: accountBalances.reduce((sum, account) => sum + account.currentBalance, 0),
    monthlyIncome: monthlyIncomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    monthlyExpense: monthlyExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    monthlyResult:
      monthlyIncomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0) -
      monthlyExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    accountBalances,
    incomeTotalsByCategory: aggregateCategoryTotals(monthlyIncomeTransactions, input.categories),
    expenseTotalsByCategory: aggregateCategoryTotals(monthlyExpenseTransactions, input.categories),
    latestTransactions: latestTransactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      date: transaction.date,
      accountName: accountById.get(transaction.accountId)?.name ?? "Conta indisponível",
      destinationAccountName: transaction.destinationAccountId
        ? (accountById.get(transaction.destinationAccountId)?.name ?? "Conta indisponível")
        : undefined,
      categoryName: transaction.categoryId ? categoryById.get(transaction.categoryId)?.name : undefined
    }))
  };
}
