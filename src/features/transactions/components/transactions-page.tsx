import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { listAccountsForManagement } from "@/features/accounts/services/list-accounts-for-management-service";
import { listCategoriesForManagement } from "@/features/categories/services/list-categories-for-management-service";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { TransactionsFilters } from "@/features/transactions/components/transactions-filters";
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
  filters: {
    competencyMonth: string;
    accountId?: string;
    categoryId?: string;
    type?: TransactionType;
  };
};

export async function TransactionsPage({ editingTransactionId, filters }: TransactionsPageProps) {
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
  const scopeLabel = formatTransactionCompetencyMonth(filters.competencyMonth);

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Transações</h1>
          <p className="text-sm text-muted-foreground">
            {scopeLabel} · {transactions.length} lançamentos
          </p>
        </div>

        {hasEditingError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            A transação selecionada para edição não foi encontrada. A página voltou ao modo de criação.
          </div>
        ) : null}

        <TransactionsFilters accounts={accounts} categories={categories} filters={filters} />

        <Card>
          <CardContent className="grid gap-4 pt-5 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Entradas</p>
              <p className="text-2xl font-semibold text-income">{formatTransactionAmountFromCents(totalIncome)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Saídas</p>
              <p className="text-2xl font-semibold text-destructive">{formatTransactionAmountFromCents(totalExpense)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Resultado</p>
              <p className={`text-2xl font-semibold ${netFlow >= 0 ? "text-income" : "text-destructive"}`}>
                {formatTransactionAmountFromCents(netFlow)}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <div className="xl:sticky xl:top-24 xl:self-start">
            <TransactionForm
              accounts={accounts}
              categories={categories}
              defaultCompetencyMonth={filters.competencyMonth}
              defaultType={filters.type}
              returnHref={returnHref}
              transaction={editingTransaction}
            />
          </div>

          <TransactionsList
            accounts={accounts}
            categories={categories}
            editingTransactionId={editingTransaction?.id}
            filters={filters}
            transactions={transactions}
          />
        </div>
      </section>
    </AppShell>
  );
}
