import type { TransactionType } from "@/features/transactions/types/transaction";

type BuildDashboardHrefInput = {
  competencyMonth?: string;
  type?: TransactionType;
};

export function buildDashboardHref(input: BuildDashboardHrefInput = {}): string {
  const searchParams = new URLSearchParams();

  if (input.competencyMonth) {
    searchParams.set("competencyMonth", input.competencyMonth);
  }

  if (input.type) {
    searchParams.set("type", input.type);
  }

  const queryString = searchParams.toString();

  return queryString.length > 0 ? `/?${queryString}` : "/";
}
