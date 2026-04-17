type BuildGoalsHrefInput = {
  goalId?: string;
};

export function buildGoalsHref(input: BuildGoalsHrefInput = {}): string {
  const searchParams = new URLSearchParams();

  if (input.goalId) {
    searchParams.set("goalId", input.goalId);
  }

  const queryString = searchParams.toString();

  return queryString.length > 0 ? `/goals?${queryString}` : "/goals";
}
