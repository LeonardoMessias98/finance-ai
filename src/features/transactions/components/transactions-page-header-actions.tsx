import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OpenTransactionModalButton } from "@/features/transactions/components/open-transaction-modal-button";
import type { TransactionsPageFilters } from "@/features/transactions/components/transactions-page.types";

type TransactionsPageHeaderActionsProps = {
  activeFiltersCount: number;
  filters: TransactionsPageFilters;
  filtersModalHref: string;
};

export function TransactionsPageHeaderActions({
  activeFiltersCount,
  filters,
  filtersModalHref
}: TransactionsPageHeaderActionsProps) {
  const filtersButtonLabel = activeFiltersCount > 0 ? `Filtros (${activeFiltersCount})` : "Filtros";

  return (
    <>
      <Button asChild type="button" variant={activeFiltersCount > 0 ? "default" : "outline"}>
        <Link href={filtersModalHref}>{filtersButtonLabel}</Link>
      </Button>
      <OpenTransactionModalButton
        className="sm:min-w-[12rem]"
        defaultCompetencyMonth={filters.competencyMonth}
        defaultType={filters.type}
      >
        Nova transação
      </OpenTransactionModalButton>
    </>
  );
}
