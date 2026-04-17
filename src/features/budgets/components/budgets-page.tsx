import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { listCategoriesForManagement } from "@/features/categories/services/list-categories-for-management-service";
import { BudgetForm } from "@/features/budgets/components/budget-form";
import { BudgetsList } from "@/features/budgets/components/budgets-list";
import { BudgetsMonthFilter } from "@/features/budgets/components/budgets-month-filter";
import { getBudgetForEditing } from "@/features/budgets/services/get-budget-for-editing-service";
import { listBudgetsForManagement } from "@/features/budgets/services/list-budgets-for-management-service";
import { buildBudgetsHref } from "@/features/budgets/utils/build-budgets-href";
import { formatTransactionCompetencyMonth } from "@/features/transactions/utils/transaction-formatters";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";

type BudgetsPageProps = {
  editingBudgetId?: string;
  competencyMonth: string;
};

export async function BudgetsPage({ editingBudgetId, competencyMonth }: BudgetsPageProps) {
  const [budgets, editingBudget, categories] = await Promise.all([
    listBudgetsForManagement({
      competencyMonth
    }),
    editingBudgetId ? getBudgetForEditing(editingBudgetId) : Promise.resolve(null),
    listCategoriesForManagement({
      type: "expense"
    })
  ]);

  const totalLimitAmount = budgets.reduce((sum, budget) => sum + budget.limitAmount, 0);
  const totalSpentAmount = budgets.reduce((sum, budget) => sum + budget.spentAmount, 0);
  const warningBudgetsCount = budgets.filter((budget) => budget.consumptionStatus === "warning").length;
  const exceededBudgetsCount = budgets.filter((budget) => budget.consumptionStatus === "exceeded").length;
  const hasEditingError = Boolean(editingBudgetId) && !editingBudget;
  const returnHref = buildBudgetsHref({
    competencyMonth
  });

  return (
    <AppShell>
      <section className="space-y-6 pt-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Orçamentos</h1>
          <p className="text-sm text-muted-foreground">
            {formatTransactionCompetencyMonth(competencyMonth)} · {budgets.length} categorias acompanhadas
          </p>
        </div>

        {hasEditingError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            O orçamento selecionado para edição não foi encontrado. A página voltou ao modo de criação.
          </div>
        ) : null}

        <BudgetsMonthFilter competencyMonth={competencyMonth} />

        <Card>
          <CardContent className="grid gap-4 pt-5 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Limite</p>
              <p className="text-2xl font-semibold text-foreground">{formatAccountBalanceFromCents(totalLimitAmount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Gasto</p>
              <p className="text-2xl font-semibold text-destructive">{formatAccountBalanceFromCents(totalSpentAmount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Alertas</p>
              <p className="text-2xl font-semibold text-warning">{warningBudgetsCount + exceededBudgetsCount}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <BudgetsList budgets={budgets} competencyMonth={competencyMonth} editingBudgetId={editingBudget?.id} />
          <BudgetForm
            budget={editingBudget}
            categories={categories}
            defaultCompetencyMonth={competencyMonth}
            returnHref={returnHref}
          />
        </div>
      </section>
    </AppShell>
  );
}
