import { BudgetsPage } from "@/features/budgets/components/budgets-page";
import { getCurrentCompetencyMonth, isCompetencyMonth } from "@/lib/dates/competency-month";

type BudgetsRoutePageProps = {
  searchParams?: Promise<{
    budgetId?: string | string[];
    competencyMonth?: string | string[];
  }>;
};

export default async function BudgetsRoutePage({ searchParams }: BudgetsRoutePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const editingBudgetId =
    typeof resolvedSearchParams.budgetId === "string" ? resolvedSearchParams.budgetId : undefined;
  const competencyMonth =
    typeof resolvedSearchParams.competencyMonth === "string" && isCompetencyMonth(resolvedSearchParams.competencyMonth)
      ? resolvedSearchParams.competencyMonth
      : getCurrentCompetencyMonth();

  return <BudgetsPage editingBudgetId={editingBudgetId} competencyMonth={competencyMonth} />;
}
