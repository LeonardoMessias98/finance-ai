type BuildBudgetsHrefInput = {
  budgetId?: string;
  competencyMonth?: string;
};

export function buildBudgetsHref(input: BuildBudgetsHrefInput = {}): string {
  const searchParams = new URLSearchParams();

  if (input.budgetId) {
    searchParams.set("budgetId", input.budgetId);
  }

  if (input.competencyMonth) {
    searchParams.set("competencyMonth", input.competencyMonth);
  }

  const queryString = searchParams.toString();

  return queryString.length > 0 ? `/budgets?${queryString}` : "/budgets";
}
