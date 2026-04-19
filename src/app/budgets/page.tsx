import { redirect } from "next/navigation";

import { BudgetsPage } from "@/features/budgets/components/budgets-page";
import { getOptionalAuthenticatedAppUser } from "@/lib/auth/session";
import { getCurrentCompetencyMonth, isCompetencyMonth } from "@/lib/dates/competency-month";
import { isTruthySearchParam } from "@/lib/search-params";

type BudgetsRoutePageProps = {
  searchParams?: Promise<{
    budgetId?: string | string[];
    create?: string | string[];
    competencyMonth?: string | string[];
  }>;
};

export default async function BudgetsRoutePage({ searchParams }: BudgetsRoutePageProps) {
  const user = await getOptionalAuthenticatedAppUser();

  if (!user) {
    redirect("/login?next=/budgets");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const editingBudgetId =
    typeof resolvedSearchParams.budgetId === "string" ? resolvedSearchParams.budgetId : undefined;
  const competencyMonth =
    typeof resolvedSearchParams.competencyMonth === "string" && isCompetencyMonth(resolvedSearchParams.competencyMonth)
      ? resolvedSearchParams.competencyMonth
      : getCurrentCompetencyMonth();
  const isCreateModalOpen = isTruthySearchParam(resolvedSearchParams.create);

  return (
    <BudgetsPage
      editingBudgetId={editingBudgetId}
      isCreateModalOpen={isCreateModalOpen}
      competencyMonth={competencyMonth}
    />
  );
}
