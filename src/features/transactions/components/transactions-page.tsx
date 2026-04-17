import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModalShell } from "@/components/ui/modal-shell";
import { listAccountsForManagement } from "@/features/accounts/services/list-accounts-for-management-service";
import { listCategoriesForManagement } from "@/features/categories/services/list-categories-for-management-service";
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
  isCreateModalOpen?: boolean;
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
  isCreateModalOpen = false,
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
  const createModalHref = buildTransactionsHref({
    ...filters,
    create: true
  });
  const filtersModalHref = buildTransactionsHref({
    ...filters,
    filtersModal: true
  });
  const scopeLabel = formatTransactionCompetencyMonth(filters.competencyMonth);
  const isTransactionModalOpen = isCreateModalOpen || Boolean(editingTransaction);

  return (
    <AppShell>
      <section className="space-y-6 pt-1">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Transações</h1>
            <p className="text-sm text-muted-foreground">
              {scopeLabel} · {transactions.length} lançamentos
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="lg:hidden" type="button" variant="outline">
              <Link href={filtersModalHref}>Filtros</Link>
            </Button>
            <Button asChild className="sm:min-w-[12rem]" type="button">
              <Link href={createModalHref}>Nova transação</Link>
            </Button>
          </div>
        </div>

        {hasEditingError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            A transação selecionada para edição não foi encontrada. A página voltou ao modo de criação.
          </div>
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

        {isTransactionModalOpen ? (
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
      </section>
    </AppShell>
  );
}
