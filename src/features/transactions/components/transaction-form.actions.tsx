import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { TransactionType } from "@/features/transactions/types/transaction";
import { getTransactionTypeLabel } from "@/features/transactions/utils/transaction-formatters";

type TransactionFormAlertsProps = {
  isInstallmentSeries: boolean;
  availableAccountsCount: number;
  categoryOptionsCount: number;
  transactionType: TransactionType;
};

export function TransactionFormAlerts({
  isInstallmentSeries,
  availableAccountsCount,
  categoryOptionsCount,
  transactionType
}: TransactionFormAlertsProps) {
  return (
    <>
      {isInstallmentSeries ? (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          Parcelas em série ainda não podem ser editadas individualmente.
        </p>
      ) : null}
      {availableAccountsCount === 0 ? (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          Cadastre uma conta antes de lançar transações.
        </p>
      ) : null}
      {categoryOptionsCount === 0 ? (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          Não há categorias ativas para {getTransactionTypeLabel(transactionType).toLowerCase()}.
        </p>
      ) : null}
    </>
  );
}

type TransactionFormActionsProps = {
  isEditing: boolean;
  isPending: boolean;
  isSubmitBlocked: boolean;
  onCancel?: () => void;
  onReset: () => void;
  returnHref?: string;
};

export function TransactionFormActions({
  isEditing,
  isPending,
  isSubmitBlocked,
  onCancel,
  onReset,
  returnHref
}: TransactionFormActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button className="sm:min-w-[12rem]" disabled={isPending || isSubmitBlocked} type="submit">
        {isEditing ? "Salvar" : "Registrar transação"}
      </Button>
      {isEditing ? (
        onCancel ? (
          <Button onClick={onCancel} type="button" variant="outline">
            Cancelar
          </Button>
        ) : returnHref ? (
          <Button asChild type="button" variant="outline">
            <Link href={returnHref}>Cancelar</Link>
          </Button>
        ) : null
      ) : (
        <Button disabled={isPending} onClick={onReset} type="button" variant="outline">
          Limpar
        </Button>
      )}
    </div>
  );
}
