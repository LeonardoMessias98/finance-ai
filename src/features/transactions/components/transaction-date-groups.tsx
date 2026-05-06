import { TransactionCard } from "@/features/transactions/components/transaction-card";
import { transactionDateGroupsStyles } from "@/features/transactions/components/transactions-list.styles";
import type { TransactionDateGroupsProps } from "@/features/transactions/components/transactions-list.types";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";

export function TransactionDateGroups({
  dateGroups,
  editingTransactionId,
  filters,
  redirectHref
}: TransactionDateGroupsProps) {
  if (dateGroups.length === 0) {
    return (
      <p className={transactionDateGroupsStyles.empty}>
        Nenhuma transação neste grupo.
      </p>
    );
  }

  return (
    <>
      {dateGroups.map((group) => (
        <section aria-label={`Transações de ${group.label}`} className={transactionDateGroupsStyles.section} key={group.key}>
          <div className={transactionDateGroupsStyles.header}>
            <h4 className={transactionDateGroupsStyles.title}>{group.label}</h4>
            <div className={transactionDateGroupsStyles.divider} />
          </div>

          <div className={transactionDateGroupsStyles.list}>
            {group.transactions.map((item) => {
              const { category, paymentCreditAccount, sourceAccount, transaction } = item;

              return (
                <TransactionCard
                  category={category}
                  editHref={buildTransactionsHref({
                    ...filters,
                    transactionId: transaction.id
                  })}
                  isEditing={editingTransactionId === transaction.id}
                  key={transaction.id}
                  paymentCreditAccount={paymentCreditAccount}
                  redirectHref={redirectHref}
                  sourceAccount={sourceAccount}
                  transaction={transaction}
                />
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
