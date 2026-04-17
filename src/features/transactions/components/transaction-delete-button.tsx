"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteTransactionAction } from "@/features/transactions/actions/delete-transaction-action";

type TransactionDeleteButtonProps = {
  transactionId: string;
  redirectHref: string;
  isInstallmentSeries?: boolean;
};

export function TransactionDeleteButton({
  transactionId,
  redirectHref,
  isInstallmentSeries = false
}: TransactionDeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleDelete() {
    const shouldDelete = window.confirm(
      isInstallmentSeries
        ? "Excluir esta série parcelada? Todas as parcelas relacionadas serão removidas."
        : "Excluir esta transação? Essa ação não pode ser desfeita."
    );

    if (!shouldDelete) {
      return;
    }

    setErrorMessage(null);

    startTransition(async () => {
      const result = await deleteTransactionAction({
        transactionId
      });

      if (result.status === "error") {
        setErrorMessage(result.message);
        return;
      }

      router.replace(redirectHref);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
        disabled={isPending}
        onClick={handleDelete}
        size="sm"
        type="button"
        variant="outline"
      >
        {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        {isInstallmentSeries ? "Excluir série" : "Excluir"}
      </Button>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
}
