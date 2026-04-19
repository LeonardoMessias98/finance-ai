type BuildAccountsHrefInput = {
  accountId?: string;
  create?: boolean;
};

export function buildAccountsHref(input: BuildAccountsHrefInput = {}): string {
  const searchParams = new URLSearchParams();

  if (input.accountId) {
    searchParams.set("accountId", input.accountId);
  }

  if (input.create) {
    searchParams.set("create", "1");
  }

  const queryString = searchParams.toString();

  return queryString.length > 0 ? `/accounts?${queryString}` : "/accounts";
}
