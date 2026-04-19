type BuildGoalsHrefInput = {
  create?: boolean;
  goalId?: string;
};

export function buildGoalsHref(input: BuildGoalsHrefInput = {}): string {
  const searchParams = new URLSearchParams();

  if (input.goalId) {
    searchParams.set("goalId", input.goalId);
  }

  if (input.create) {
    searchParams.set("create", "1");
  }

  const queryString = searchParams.toString();

  return queryString.length > 0 ? `/goals?${queryString}` : "/goals";
}
