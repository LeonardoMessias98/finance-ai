import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AccountsList } from "@/features/accounts/components/accounts-list";
import type { AccountWithCurrentBalance } from "@/features/accounts/types/account";

vi.mock("@/features/accounts/components/account-delete-button", () => ({
  AccountDeleteButton: ({ accountId }: { accountId: string }) => <button type="button">Excluir {accountId}</button>
}));

const accounts: AccountWithCurrentBalance[] = [
  {
    id: "debit-account",
    userId: "user-1",
    name: "Conta débito",
    type: "debit",
    initialBalance: 10_000,
    currentBalance: 13_000,
    isActive: true
  },
  {
    id: "credit-account",
    userId: "user-1",
    name: "Cartão",
    type: "credit",
    initialBalance: 0,
    currentBalance: -50_000,
    isActive: true
  },
  {
    id: "checking-account",
    userId: "user-1",
    name: "Conta antiga",
    type: "checking",
    initialBalance: 0,
    currentBalance: 20_000,
    isActive: true
  },
  {
    id: "legacy-credit-account",
    userId: "user-1",
    name: "Cartão antigo",
    type: "credit_card",
    initialBalance: 0,
    currentBalance: -30_000,
    isActive: true
  }
];

describe("AccountsList", () => {
  it("shows current balance instead of initial balance", () => {
    render(<AccountsList accounts={accounts} />);

    expect(screen.queryByText(/Saldo inicial/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Saldo atual/i)).toHaveLength(4);
    expect(screen.getByText("Saldo atual R$ 130,00")).toBeInTheDocument();
    expect(screen.getByText("Saldo atual -R$ 500,00")).toBeInTheDocument();
  });

  it("shows legacy checking accounts as debit", () => {
    render(<AccountsList accounts={accounts} />);

    const checkingCard = screen.getByText("Conta antiga").closest("div");

    expect(checkingCard).toHaveTextContent("Débito");
  });

  it("shows legacy credit_card accounts as credit", () => {
    render(<AccountsList accounts={accounts} />);

    const creditCard = screen.getByText("Cartão antigo").closest("div");

    expect(creditCard).toHaveTextContent("Crédito");
  });
});
