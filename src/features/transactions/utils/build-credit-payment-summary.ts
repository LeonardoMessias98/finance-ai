import type { Account } from "@/features/accounts/types/account";
import { isCreditAccount } from "@/features/accounts/utils/account-type-compatibility";
import type {
  CreditPaymentSummary,
  CreditPaymentSummaryAccountGroup,
  CreditPaymentSummaryTransaction
} from "@/features/transactions/types/credit-payment-summary";
import type { Transaction } from "@/features/transactions/types/transaction";

function isTransactionInCreditPaymentMonth(transaction: Transaction, creditPaymentMonth: string): boolean {
  if (transaction.creditPaymentMonth) {
    return transaction.creditPaymentMonth === creditPaymentMonth;
  }

  // Legacy credit transactions did not store creditPaymentMonth.
  // Keep them visible in a simple MVP invoice view by falling back to competencyMonth.
  return transaction.competencyMonth === creditPaymentMonth;
}

function mapSummaryTransaction(transaction: Transaction): CreditPaymentSummaryTransaction {
  return {
    id: transaction.id,
    description: transaction.description,
    amount: transaction.amount,
    date: transaction.date,
    competencyMonth: transaction.competencyMonth,
    creditPaymentMonth: transaction.creditPaymentMonth,
    status: transaction.status
  };
}

function sortSummaryTransactions(
  transactions: CreditPaymentSummaryTransaction[]
): CreditPaymentSummaryTransaction[] {
  return [...transactions].sort((left, right) => {
    const dateDelta = left.date.getTime() - right.date.getTime();

    if (dateDelta !== 0) {
      return dateDelta;
    }

    return left.description.localeCompare(right.description, "pt-BR");
  });
}

export function buildCreditPaymentSummary(input: {
  accounts: Account[];
  transactions: Transaction[];
  creditPaymentMonth: string;
}): CreditPaymentSummary {
  const creditAccountById = new Map(
    input.accounts.filter((account) => isCreditAccount(account.type)).map((account) => [account.id, account])
  );
  const groupsByAccountId = new Map<string, CreditPaymentSummaryAccountGroup>();

  for (const transaction of input.transactions) {
    const account = creditAccountById.get(transaction.accountId);

    if (!account || transaction.type !== "expense") {
      continue;
    }

    if (!isTransactionInCreditPaymentMonth(transaction, input.creditPaymentMonth)) {
      continue;
    }

    const summaryTransaction = mapSummaryTransaction(transaction);
    const existingGroup = groupsByAccountId.get(account.id);

    if (existingGroup) {
      existingGroup.totalAmount += transaction.amount;
      existingGroup.transactions.push(summaryTransaction);
      continue;
    }

    groupsByAccountId.set(account.id, {
      accountId: account.id,
      accountName: account.name,
      accountType: account.type,
      totalAmount: transaction.amount,
      transactions: [summaryTransaction]
    });
  }

  const accountGroups = [...groupsByAccountId.values()]
    .map((group) => ({
      ...group,
      transactions: sortSummaryTransactions(group.transactions)
    }))
    .sort((left, right) => left.accountName.localeCompare(right.accountName, "pt-BR"));
  const transactions = sortSummaryTransactions(accountGroups.flatMap((group) => group.transactions));

  return {
    creditPaymentMonth: input.creditPaymentMonth,
    totalAmount: accountGroups.reduce((sum, group) => sum + group.totalAmount, 0),
    accountGroups,
    transactions
  };
}
