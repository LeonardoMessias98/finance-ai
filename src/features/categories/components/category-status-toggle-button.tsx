"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, PauseCircle, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleCategoryStatusAction } from "@/features/categories/actions/toggle-category-status-action";

type CategoryStatusToggleButtonProps = {
  categoryId: string;
  isActive: boolean;
};

export function CategoryStatusToggleButton({ categoryId, isActive }: CategoryStatusToggleButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleToggle() {
    setErrorMessage(null);

    startTransition(async () => {
      const result = await toggleCategoryStatusAction({
        categoryId,
        isActive: !isActive
      });

      if (result.status === "error") {
        setErrorMessage(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button disabled={isPending} onClick={handleToggle} size="sm" type="button" variant="outline">
        {isPending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : isActive ? (
          <PauseCircle className="h-4 w-4" />
        ) : (
          <PlayCircle className="h-4 w-4" />
        )}
        {isActive ? "Desativar" : "Ativar"}
      </Button>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
}
