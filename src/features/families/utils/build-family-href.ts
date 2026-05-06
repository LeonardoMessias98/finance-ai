type BuildFamilyHrefInput = {
  competencyMonth?: string;
};

export function buildFamilyHref(input: BuildFamilyHrefInput = {}): string {
  const searchParams = new URLSearchParams();

  if (input.competencyMonth) {
    searchParams.set("competencyMonth", input.competencyMonth);
  }

  const queryString = searchParams.toString();

  return queryString.length > 0 ? `/family?${queryString}` : "/family";
}
