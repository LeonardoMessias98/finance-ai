import Link from "next/link";
import { PencilLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransactionDeleteButton } from "@/features/transactions/components/transaction-delete-button";
import { TransactionMetaBadge } from "@/features/transactions/components/transaction-meta-badge";
import type { TransactionCardProps } from "@/features/transactions/components/transactions-list.types";
import {
  getStatusBadgeClassName,
  getTransactionCardClassName,
  transactionCardStyles
} from "@/features/transactions/components/transactions-list.styles";
import {
  formatTransactionAmountFromCents,
  getTransactionStatusLabel,
  getTransactionTypeAmountClassName,
  getTransactionTypeDotClassName,
  getTransactionTypeLabel
} from "@/features/transactions/utils/transaction-formatters";
import { cn } from "@/lib/utils";

export function TransactionCard({
  transaction,
  sourceAccount,
  paymentCreditAccount,
  category,
  editHref,
  redirectHref,
  isEditing
}: TransactionCardProps) {
  const isInstallmentSeries = Boolean(transaction.installment && transaction.installment.total > 1);

  return (
    <article className={getTransactionCardClassName(isEditing)}>
      <div className={transactionCardStyles.layout}>
        <div className={transactionCardStyles.main}>
          <div className={transactionCardStyles.headingRow}>
            <span
              aria-hidden="true"
              className={cn(transactionCardStyles.typeDot, getTransactionTypeDotClassName(transaction.type))}
            />
            <div className={transactionCardStyles.content}>
              <div className={transactionCardStyles.badges}>
                <h5 className={transactionCardStyles.title}>
                  {transaction.description}
                </h5>
                <Badge variant="outline">{getTransactionTypeLabel(transaction.type)}</Badge>
                <Badge className={getStatusBadgeClassName(transaction.status)}>
                  {getTransactionStatusLabel(transaction.status)}
                </Badge>
                {transaction.installment ? (
                  <Badge variant="secondary">
                    {transaction.installment.current}/{transaction.installment.total}
                  </Badge>
                ) : null}
                {transaction.isRecurring ? <Badge variant="secondary">Recorrente</Badge> : null}
              </div>

              <div className={transactionCardStyles.meta}>
                <TransactionMetaBadge>{sourceAccount?.name ?? "Conta indisponível"}</TransactionMetaBadge>
                {paymentCreditAccount ? (
                  <TransactionMetaBadge>Cartão: {paymentCreditAccount.name}</TransactionMetaBadge>
                ) : null}
                <TransactionMetaBadge tone="category">{category?.name ?? "Sem categoria"}</TransactionMetaBadge>
              </div>
            </div>
          </div>

          {transaction.notes ? (
            <p className={transactionCardStyles.notes}>{transaction.notes}</p>
          ) : null}
        </div>

        <div className={transactionCardStyles.aside}>
          <p className={cn(transactionCardStyles.amount, getTransactionTypeAmountClassName(transaction.type))}>
            {transaction.type === "income" ? "+" : "-"}
            {formatTransactionAmountFromCents(transaction.amount)}
          </p>
          {isInstallmentSeries ? <p className={transactionCardStyles.installmentNotice}>Série parcelada</p> : null}
          <div className={transactionCardStyles.actions}>
            {isInstallmentSeries ? (
              <div className={transactionCardStyles.disabledEdit}>
                Edição isolada indisponível
              </div>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link href={editHref}>
                  <PencilLine className={transactionCardStyles.editIcon} />
                  Editar
                </Link>
              </Button>
            )}

            <TransactionDeleteButton
              isInstallmentSeries={isInstallmentSeries}
              redirectHref={redirectHref}
              transactionId={transaction.id}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
