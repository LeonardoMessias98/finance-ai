type BuildBudgetsHrefInput = {
  budgetId?: string;
  create?: boolean;
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

  if (input.create) {
    searchParams.set("create", "1");
  }

  const queryString = searchParams.toString();

  return queryString.length > 0 ? `/budgets?${queryString}` : "/budgets";
}
