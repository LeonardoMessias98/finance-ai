import { isCreditAccount } from "@/features/accounts/utils/account-type-compatibility";
import type { DashboardLatestTransaction } from "@/features/dashboard/types/dashboard-financial-summary";

export type DashboardLatestTransactionsGroup = {
  key: "debit" | "credit";
  title: string;
  transactions: DashboardLatestTransaction[];
};

export function groupDashboardLatestTransactionsByAccountKind(
  latestTransactions: DashboardLatestTransaction[]
): DashboardLatestTransactionsGroup[] {
  const groups = latestTransactions.reduce<{
    debit: DashboardLatestTransaction[];
    credit: DashboardLatestTransaction[];
  }>(
    (accumulator, transaction) => {
      const groupKey = isCreditAccount(transaction.accountType) ? "credit" : "debit";

      accumulator[groupKey].push(transaction);

      return accumulator;
    },
    {
      debit: [],
      credit: []
    }
  );

  const latestTransactionGroups: DashboardLatestTransactionsGroup[] = [
    {
      key: "debit",
      title: "Débito",
      transactions: groups.debit
    },
    {
      key: "credit",
      title: "Crédito",
      transactions: groups.credit
    }
  ];

  return latestTransactionGroups.filter((group) => group.transactions.length > 0);
}
