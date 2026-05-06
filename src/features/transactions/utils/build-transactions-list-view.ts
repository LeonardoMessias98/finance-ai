import type { Account } from "@/features/accounts/types/account";
import type { Category } from "@/features/categories/types/category";
import type {
  TransactionAccountKindDateGroup,
  TransactionDateGroup,
  TransactionListItem
} from "@/features/transactions/components/transactions-list.types";
import type { Transaction } from "@/features/transactions/types/transaction";
import { buildTransactionAccountKindGroups } from "@/features/transactions/utils/build-transaction-account-kind-groups";
import { formatTransactionDate } from "@/features/transactions/utils/transaction-formatters";

function groupTransactionItemsByDate(items: TransactionListItem[]): TransactionDateGroup[] {
  const groupsByDate = new Map<string, TransactionDateGroup>();

  for (const item of items) {
    const key = item.transaction.date.toISOString().slice(0, 10);
    const existingGroup = groupsByDate.get(key);

    if (existingGroup) {
      existingGroup.transactions.push(item);
      continue;
    }

    groupsByDate.set(key, {
      key,
      label: formatTransactionDate(item.transaction.date),
      transactions: [item]
    });
  }

  return [...groupsByDate.values()];
}

export function buildTransactionsListView(input: {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
}): TransactionAccountKindDateGroup[] {
  const accountById = new Map(input.accounts.map((account) => [account.id, account]));
  const categoryById = new Map(input.categories.map((category) => [category.id, category]));
  const accountKindGroups = buildTransactionAccountKindGroups(input.transactions, input.accounts);

  return accountKindGroups.map((accountKindGroup) => {
    const items = accountKindGroup.transactions.map((transaction) => ({
      transaction,
      sourceAccount: accountById.get(transaction.accountId),
      paymentCreditAccount: transaction.paymentForCreditAccountId
        ? accountById.get(transaction.paymentForCreditAccountId)
        : null,
      category: transaction.categoryId ? categoryById.get(transaction.categoryId) : null
    }));

    return {
      key: accountKindGroup.key,
      title: accountKindGroup.title,
      summaryAmount: accountKindGroup.summaryAmount,
      dateGroups: groupTransactionItemsByDate(items)
    };
  });
}
