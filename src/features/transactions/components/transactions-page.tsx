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
import {
  TransactionsFiltersPanel,
  TransactionsFiltersSidebar
} from "@/features/transactions/components/transactions-filters";
import { TransactionsList } from "@/features/transactions/components/transactions-list";
import { getTransactionForEditing } from "@/features/transactions/services/get-transaction-for-editing-service";
import { listTransactionsForManagement } from "@/features/transactions/services/list-transactions-for-management-service";
import type { TransactionType } from "@/features/transactions/types/transaction";
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

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const netFlow = totalIncome - totalExpense;
  const hasEditingError = Boolean(editingTransactionId) && !editingTransaction;
  const returnHref = buildTransactionsHref(filters);
  const filtersModalHref = buildTransactionsHref({
    ...filters,
    filtersModal: true
  });
  const scopeLabel = formatTransactionCompetencyMonth(filters.competencyMonth);
  const isEditingModalOpen = Boolean(editingTransaction);

  return (
    <AuthenticatedAppShell>
      <PageSection>
        <PageHeader
          actions={
            <>
              <Button asChild className="lg:hidden" type="button" variant="outline">
                <Link href={filtersModalHref}>Filtros</Link>
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

        <div className="grid gap-5 lg:grid-cols-[20.5rem_minmax(0,1fr)] xl:grid-cols-[20.5rem_minmax(0,1fr)]">
          <div className="hidden space-y-5 lg:sticky lg:top-24 lg:block lg:self-start">
            <TransactionsFiltersSidebar accounts={accounts} categories={categories} filters={filters} />
          </div>

          <div className="space-y-5">
            <Card>
              <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Entradas</p>
                  <p className="text-2xl font-semibold text-income">{formatTransactionAmountFromCents(totalIncome)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Saídas</p>
                  <p className="text-2xl font-semibold text-destructive">
                    {formatTransactionAmountFromCents(totalExpense)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Resultado</p>
                  <p className={`text-2xl font-semibold ${netFlow >= 0 ? "text-income" : "text-destructive"}`}>
                    {formatTransactionAmountFromCents(netFlow)}
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
