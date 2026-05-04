import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardLatestTransactions } from "@/features/dashboard/components/dashboard-latest-transactions";
import type { DashboardLatestTransaction } from "@/features/dashboard/types/dashboard-financial-summary";

const latestTransactions: DashboardLatestTransaction[] = [
  {
    id: "debit-transaction",
    description: "Mercado",
    amount: 30_000,
    type: "expense",
    status: "paid",
    date: new Date("2026-05-03T12:00:00.000Z"),
    accountName: "Conta principal",
    accountType: "debit",
    categoryName: "Alimentação"
  },
  {
    id: "credit-transaction",
    description: "Compra de cartas",
    amount: 26_012,
    type: "expense",
    status: "paid",
    date: new Date("2026-05-04T12:00:00.000Z"),
    accountName: "Cartão atual",
    accountType: "credit",
    categoryName: "Lazer"
  },
  {
    id: "legacy-credit-transaction",
    description: "Compra no cartão antigo",
    amount: 50_021,
    type: "expense",
    status: "paid",
    date: new Date("2026-05-05T12:00:00.000Z"),
    accountName: "Cartão antigo",
    accountType: "credit_card",
    categoryName: "Lazer"
  }
];

function renderLatestTransactions(transactions: DashboardLatestTransaction[] = latestTransactions) {
  return render(<DashboardLatestTransactions competencyMonth="2026-05" latestTransactions={transactions} />);
}

describe("DashboardLatestTransactions", () => {
  it("shows recent debit transactions in the debit group", () => {
    renderLatestTransactions();

    const debitGroup = screen.getByRole("region", {
      name: "Recentes Débito"
    });

    expect(within(debitGroup).getByText("Mercado")).toBeInTheDocument();
    expect(within(debitGroup).getByText("-R$ 300,00")).toBeInTheDocument();
    expect(within(debitGroup).queryByText("Compra de cartas")).not.toBeInTheDocument();
  });

  it("shows recent credit transactions in the credit group", () => {
    renderLatestTransactions();

    const creditGroup = screen.getByRole("region", {
      name: "Recentes Crédito"
    });

    expect(within(creditGroup).getByText("Compra de cartas")).toBeInTheDocument();
    expect(within(creditGroup).getByText("-R$ 260,12")).toBeInTheDocument();
    expect(within(creditGroup).queryByText("Mercado")).not.toBeInTheDocument();
  });

  it("treats legacy credit_card transactions as credit", () => {
    renderLatestTransactions();

    const creditGroup = screen.getByRole("region", {
      name: "Recentes Crédito"
    });

    expect(within(creditGroup).getByText("Compra no cartão antigo")).toBeInTheDocument();
    expect(within(creditGroup).getByText("Cartão antigo")).toBeInTheDocument();
  });
});
