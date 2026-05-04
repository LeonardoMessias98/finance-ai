import type { Account } from "@/features/accounts/types/account";
import { isCreditAccount } from "@/features/accounts/utils/account-type-compatibility";
import type { Transaction } from "@/features/transactions/types/transaction";

export type TransactionAccountKindGroup = {
  key: "debit" | "credit";
  title: string;
  transactions: Transaction[];
  summaryAmount: number;
};

export type DebitTransactionsMonthlySummary = {
  incomeAmount: number;
  expenseAmount: number;
  resultAmount: number;
};

function isCreditTransactionAccount(transaction: Transaction, accountById: Map<string, Account>): boolean {
  const sourceAccount = accountById.get(transaction.accountId);

  return sourceAccount ? isCreditAccount(sourceAccount.type) : false;
}

export function filterDebitTransactions(transactions: Transaction[], accounts: Account[]): Transaction[] {
  const accountById = new Map(accounts.map((account) => [account.id, account]));

  return transactions.filter((transaction) => !isCreditTransactionAccount(transaction, accountById));
}

export function calculateDebitTransactionsResult(transactions: Transaction[]): number {
  return transactions.reduce((sum, transaction) => {
    if (transaction.type === "income") {
      return sum + transaction.amount;
    }

    return sum - transaction.amount;
  }, 0);
}

export function calculateCreditTransactionsVisualTotal(transactions: Transaction[]): number {
  return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

export function buildDebitTransactionsMonthlySummary(
  transactions: Transaction[],
  accounts: Account[]
): DebitTransactionsMonthlySummary {
  const debitTransactions = filterDebitTransactions(transactions, accounts);
  const incomeAmount = debitTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenseAmount = debitTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    incomeAmount,
    expenseAmount,
    resultAmount: incomeAmount - expenseAmount
  };
}

export function buildTransactionAccountKindGroups(
  transactions: Transaction[],
  accounts: Account[]
): TransactionAccountKindGroup[] {
  const accountById = new Map(accounts.map((account) => [account.id, account]));
  const debitTransactions: Transaction[] = [];
  const creditTransactions: Transaction[] = [];

  for (const transaction of transactions) {
    if (isCreditTransactionAccount(transaction, accountById)) {
      creditTransactions.push(transaction);
      continue;
    }

    debitTransactions.push(transaction);
  }

  return [
    {
      key: "debit",
      title: "Débito",
      transactions: debitTransactions,
      summaryAmount: calculateDebitTransactionsResult(debitTransactions)
    },
    {
      key: "credit",
      title: "Crédito",
      transactions: creditTransactions,
      summaryAmount: calculateCreditTransactionsVisualTotal(creditTransactions)
    }
  ];
}
