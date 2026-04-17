type BuildDashboardHrefInput = {
  competencyMonth?: string;
};

export function buildDashboardHref(input: BuildDashboardHrefInput = {}): string {
  const searchParams = new URLSearchParams();

  if (input.competencyMonth) {
    searchParams.set("competencyMonth", input.competencyMonth);
  }

  const queryString = searchParams.toString();

  return queryString.length > 0 ? `/?${queryString}` : "/";
}
