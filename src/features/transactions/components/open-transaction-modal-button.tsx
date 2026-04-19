"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useOptionalGlobalTransactionModal } from "@/features/transactions/hooks/use-global-transaction-modal";
import type { OpenGlobalTransactionModalOptions } from "@/features/transactions/types/global-transaction-modal";
import { transactionTypeValues, type TransactionType } from "@/features/transactions/types/transaction";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";
import { getCurrentCompetencyMonth, isCompetencyMonth } from "@/lib/dates/competency-month";

type OpenTransactionModalButtonProps = Omit<React.ComponentProps<typeof Button>, "children" | "onClick" | "type"> &
  OpenGlobalTransactionModalOptions & {
    children: ReactNode;
  };

function isTransactionType(value: string): value is TransactionType {
  return transactionTypeValues.includes(value as TransactionType);
}

export function OpenTransactionModalButton({
  children,
  defaultCompetencyMonth,
  defaultType,
  ...buttonProps
}: OpenTransactionModalButtonProps) {
  const searchParams = useSearchParams();
  const globalTransactionModal = useOptionalGlobalTransactionModal();

  const resolvedCompetencyMonth = (() => {
    if (defaultCompetencyMonth && isCompetencyMonth(defaultCompetencyMonth)) {
      return defaultCompetencyMonth;
    }

    const searchCompetencyMonth = searchParams.get("competencyMonth");

    if (searchCompetencyMonth && isCompetencyMonth(searchCompetencyMonth)) {
      return searchCompetencyMonth;
    }

    return getCurrentCompetencyMonth();
  })();

  const resolvedType = (() => {
    if (defaultType) {
      return defaultType;
    }

    const searchType = searchParams.get("type");

    return searchType && isTransactionType(searchType) ? searchType : undefined;
  })();

  if (!globalTransactionModal) {
    return (
      <Button {...buttonProps} asChild type="button">
        <Link
          href={buildTransactionsHref({
            competencyMonth: resolvedCompetencyMonth,
            type: resolvedType
          })}
        >
          {children}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      {...buttonProps}
      onClick={() => {
        globalTransactionModal.open({
          defaultCompetencyMonth: resolvedCompetencyMonth,
          defaultType: resolvedType
        });
      }}
      type="button"
    >
      {children}
    </Button>
  );
}
