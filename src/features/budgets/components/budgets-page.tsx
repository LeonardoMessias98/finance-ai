import { AuthenticatedAppShell } from "@/components/layout/authenticated-app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileOnlyModalShell } from "@/components/ui/mobile-only-modal-shell";
import { StatusBanner } from "@/components/ui/status-banner";
import { listCategoriesForManagement } from "@/features/categories/services/list-categories-for-management-service";
import { BudgetForm } from "@/features/budgets/components/budget-form";
import { BudgetsList } from "@/features/budgets/components/budgets-list";
import { BudgetsMonthFilter } from "@/features/budgets/components/budgets-month-filter";
import { getBudgetForEditing } from "@/features/budgets/services/get-budget-for-editing-service";
import { listBudgetsForManagement } from "@/features/budgets/services/list-budgets-for-management-service";
import { buildBudgetsHref } from "@/features/budgets/utils/build-budgets-href";
import { formatTransactionCompetencyMonth } from "@/features/transactions/utils/transaction-formatters";
import { formatAccountBalanceFromCents } from "@/features/accounts/utils/account-formatters";
import Link from "next/link";

type BudgetsPageProps = {
  editingBudgetId?: string;
  isCreateModalOpen?: boolean;
  competencyMonth: string;
};

export async function BudgetsPage({
  editingBudgetId,
  isCreateModalOpen = false,
  competencyMonth
}: BudgetsPageProps) {
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
  const createHref = buildBudgetsHref({
    competencyMonth,
    create: true
  });
  const isMobileModalOpen = isCreateModalOpen || Boolean(editingBudget);

  return (
    <AuthenticatedAppShell>
      <PageSection>
        <PageHeader
          actions={
            <Button asChild className="lg:hidden" type="button">
              <Link href={createHref}>Novo orçamento</Link>
            </Button>
          }
          description={`${formatTransactionCompetencyMonth(competencyMonth)} · ${budgets.length} categorias acompanhadas`}
          title="Orçamentos"
        />

        {hasEditingError ? (
          <StatusBanner
            message="O orçamento selecionado para edição não foi encontrado. A página voltou ao modo de criação."
            variant="error"
          />
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
          <div className="hidden lg:block">
            <BudgetForm
              budget={editingBudget}
              categories={categories}
              defaultCompetencyMonth={competencyMonth}
              returnHref={returnHref}
            />
          </div>
        </div>

        {isMobileModalOpen ? (
          <MobileOnlyModalShell
            closeHref={returnHref}
            mobileFullscreen
            title={editingBudget ? "Editar orçamento" : "Novo orçamento"}
          >
            <BudgetForm
              budget={editingBudget}
              categories={categories}
              closeOnSuccess
              defaultCompetencyMonth={competencyMonth}
              returnHref={returnHref}
              showCard={false}
            />
          </MobileOnlyModalShell>
        ) : null}
      </PageSection>
    </AuthenticatedAppShell>
  );
}
