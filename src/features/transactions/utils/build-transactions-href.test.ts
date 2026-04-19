import { describe, expect, it } from "vitest";

import { buildTransactionsHref } from "@/features/transactions/utils/build-transactions-href";

describe("build-transactions-href", () => {
  it("builds a base href with transaction filters", () => {
    expect(
      buildTransactionsHref({
        competencyMonth: "2026-04",
        type: "expense",
        accountId: "acc-1"
      })
    ).toBe("/transactions?competencyMonth=2026-04&accountId=acc-1&type=expense");
  });

  it("includes the filters modal flag when requested", () => {
    expect(
      buildTransactionsHref({
        competencyMonth: "2026-04",
        filtersModal: true
      })
    ).toBe("/transactions?competencyMonth=2026-04&filters=open");
  });
});
