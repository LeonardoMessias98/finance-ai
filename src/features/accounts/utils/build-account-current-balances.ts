import type { Account, AccountWithCurrentBalance } from "@/features/accounts/types/account";
import { isCreditAccount } from "@/features/accounts/utils/account-type-compatibility";
import type { Transaction } from "@/features/transactions/types/transaction";

function calculateDebitCurrentBalance(account: Account, transactions: Transaction[]): number {
  return transactions.reduce((balance, transaction) => {
    if (transaction.accountId !== account.id) {
      return balance;
    }

    if (transaction.type === "income" && transaction.status === "received") {
      return balance + transaction.amount;
    }

    if (transaction.type === "expense" && transaction.status === "paid") {
      return balance - transaction.amount;
    }

    return balance;
  }, account.initialBalance);
}

function calculateCreditCurrentBalance(account: Account, transactions: Transaction[]): number {
  const spentAmount = transactions
    .filter((transaction) => transaction.accountId === account.id && transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const paidAmount = transactions
    .filter(
      (transaction) =>
        transaction.paymentForCreditAccountId === account.id &&
        transaction.type === "expense" &&
        transaction.status === "paid"
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return (spentAmount - paidAmount) * -1;
}

export function buildAccountsWithCurrentBalances(
  accounts: Account[],
  transactions: Transaction[]
): AccountWithCurrentBalance[] {
  return accounts.map((account) => ({
    ...account,
    currentBalance: isCreditAccount(account.type)
      ? calculateCreditCurrentBalance(account, transactions)
      : calculateDebitCurrentBalance(account, transactions)
  }));
}
