import Link from "next/link";

import { AuthenticatedAppShell } from "@/components/layout/authenticated-app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModalShell } from "@/components/ui/modal-shell";
import { StatusBanner } from "@/components/ui/status-banner";
import { listAccountsForManagement } from "@/features/accounts/services/list-accounts-for-management-service";
import { listCategoriesForManagement } from "@/features/categories/services/list-categories-for-management-service";
import { OpenTransactionModalButton } from "@/features/transactions/components/open-transaction-modal-button";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { TransactionsFiltersPanel } from "@/features/transactions/components/transactions-filters";
import { TransactionsList } from "@/features/transactions/components/transactions-list";
import { getTransactionForEditing } from "@/features/transactions/services/get-transaction-for-editing-service";
import { listTransactionsForManagement } from "@/features/transactions/services/list-transactions-for-management-service";
import type { TransactionType } from "@/features/transactions/types/transaction";
import { buildDebitTransactionsMonthlySummary } from "@/features/transactions/utils/build-transaction-account-kind-groups";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";
import {
  formatTransactionAmountFromCents,
  formatTransactionCompetencyMonth
} from "@/features/transactions/utils/transaction-formatters";

type TransactionsPageProps = {
  editingTransactionId?: string;
  isFiltersModalOpen?: boolean;
  filters: {
    competencyMonth: string;
    accountId?: string;
    categoryId?: string;
    type?: TransactionType;
  };
};

export function countActiveTransactionFilters(filters: TransactionsPageProps["filters"]): number {
  return [filters.accountId, filters.categoryId, filters.type].filter(Boolean).length;
}

export async function TransactionsPage({
  editingTransactionId,
  isFiltersModalOpen = false,
  filters
}: TransactionsPageProps) {
  const [transactions, editingTransaction, accounts, categories] = await Promise.all([
    listTransactionsForManagement(filters),
    editingTransactionId ? getTransactionForEditing(editingTransactionId) : Promise.resolve(null),
    listAccountsForManagement(),
    listCategoriesForManagement()
  ]);

  const monthlyDebitSummary = buildDebitTransactionsMonthlySummary(transactions, accounts);
  const hasEditingError = Boolean(editingTransactionId) && !editingTransaction;
  const returnHref = buildTransactionsHref(filters);
  const filtersModalHref = buildTransactionsHref({
    ...filters,
    filtersModal: true
  });
  const scopeLabel = formatTransactionCompetencyMonth(filters.competencyMonth);
  const isEditingModalOpen = Boolean(editingTransaction);
  const activeFiltersCount = countActiveTransactionFilters(filters);
  const filtersButtonLabel = activeFiltersCount > 0 ? `Filtros (${activeFiltersCount})` : "Filtros";

  return (
    <AuthenticatedAppShell>
      <PageSection>
        <PageHeader
          actions={
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
          }
          description={`${scopeLabel} · ${transactions.length} lançamentos`}
          title="Transações"
        />

        {hasEditingError ? (
          <StatusBanner
            message="A transação selecionada para edição não foi encontrada. A página voltou ao modo de criação."
            variant="error"
          />
        ) : null}

        <div className="grid gap-5">
          <div className="space-y-5">
            <Card>
              <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Entradas</p>
                  <p className="text-2xl font-semibold text-income">
                    {formatTransactionAmountFromCents(monthlyDebitSummary.incomeAmount)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Saídas</p>
                  <p className="text-2xl font-semibold text-destructive">
                    {formatTransactionAmountFromCents(monthlyDebitSummary.expenseAmount)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Resultado</p>
                  <p
                    className={`text-2xl font-semibold ${
                      monthlyDebitSummary.resultAmount >= 0 ? "text-income" : "text-destructive"
                    }`}
                  >
                    {formatTransactionAmountFromCents(monthlyDebitSummary.resultAmount)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <TransactionsList
              accounts={accounts}
              categories={categories}
              editingTransactionId={editingTransaction?.id}
              filters={filters}
              transactions={transactions}
            />
          </div>
        </div>

        {isFiltersModalOpen ? (
          <ModalShell closeHref={returnHref} mobileFullscreen title="Filtros">
            <TransactionsFiltersPanel
              accounts={accounts}
              categories={categories}
              fieldPrefix="transactions-modal"
              filters={filters}
            />
          </ModalShell>
        ) : null}

        {isEditingModalOpen ? (
          <ModalShell
            closeHref={returnHref}
            contentClassName="pt-6"
            mobileFullscreen
            title={editingTransaction ? "Editar transação" : "Nova transação"}
          >
            <TransactionForm
              accounts={accounts}
              categories={categories}
              closeOnSuccess
              defaultCompetencyMonth={filters.competencyMonth}
              defaultType={filters.type}
              returnHref={returnHref}
              showCard={false}
              transaction={editingTransaction}
            />
          </ModalShell>
        ) : null}
      </PageSection>
    </AuthenticatedAppShell>
  );
}
