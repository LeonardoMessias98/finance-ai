import { AuthenticatedAppShell } from "@/components/layout/authenticated-app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { ModalShell } from "@/components/ui/modal-shell";
import { StatusBanner } from "@/components/ui/status-banner";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { TransactionsFiltersPanel } from "@/features/transactions/components/transactions-filters";
import { TransactionsList } from "@/features/transactions/components/transactions-list";
import { countActiveTransactionFilters } from "@/features/transactions/components/transactions-page.helpers";
import { TransactionsPageHeaderActions } from "@/features/transactions/components/transactions-page-header-actions";
import type { TransactionsPageProps } from "@/features/transactions/components/transactions-page.types";
import { TransactionsMonthlySummary } from "@/features/transactions/components/transactions-monthly-summary";
import { getTransactionsPageData } from "@/features/transactions/services/get-transactions-page-data-service";
import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";
import { formatTransactionCompetencyMonth } from "@/features/transactions/utils/transaction-formatters";

export { countActiveTransactionFilters } from "@/features/transactions/components/transactions-page.helpers";

export async function TransactionsPage({
  editingTransactionId,
  isFiltersModalOpen = false,
  filters
}: TransactionsPageProps) {
  const { accountKindGroups, accounts, categories, editingTransaction, monthlyDebitSummary, transactions } =
    await getTransactionsPageData({
      filters,
      editingTransactionId
    });

  const hasEditingError = Boolean(editingTransactionId) && !editingTransaction;
  const returnHref = buildTransactionsHref(filters);
  const filtersModalHref = buildTransactionsHref({
    ...filters,
    filtersModal: true
  });
  const scopeLabel = formatTransactionCompetencyMonth(filters.competencyMonth);
  const isEditingModalOpen = Boolean(editingTransaction);
  const activeFiltersCount = countActiveTransactionFilters(filters);

  return (
    <AuthenticatedAppShell>
      <PageSection>
        <PageHeader
          actions={
            <TransactionsPageHeaderActions
              activeFiltersCount={activeFiltersCount}
              filters={filters}
              filtersModalHref={filtersModalHref}
            />
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
            <TransactionsMonthlySummary summary={monthlyDebitSummary} />

            <TransactionsList
              accountKindGroups={accountKindGroups}
              editingTransactionId={editingTransaction?.id}
              filters={filters}
              transactionCount={transactions.length}
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
