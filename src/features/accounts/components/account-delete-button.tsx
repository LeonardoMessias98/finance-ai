"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteAccountAction } from "@/features/accounts/actions/delete-account-action";

type AccountDeleteButtonProps = {
  accountId: string;
  redirectHref: string;
};

export function AccountDeleteButton({ accountId, redirectHref }: AccountDeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleDelete() {
    const shouldDelete = window.confirm("Excluir esta conta? Essa ação não pode ser desfeita.");

    if (!shouldDelete) {
      return;
    }

    setErrorMessage(null);

    startTransition(async () => {
      const result = await deleteAccountAction({
        accountId
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
        Excluir
      </Button>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
}
