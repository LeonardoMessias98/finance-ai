import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TransactionsLoading from "@/app/transactions/loading";

describe("TransactionsLoading", () => {
  it("uses the shared loading spinner", () => {
    render(<TransactionsLoading />);

    expect(screen.getByRole("status", { name: "Carregando transações..." })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
