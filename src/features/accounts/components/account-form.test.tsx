import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AccountForm } from "@/features/accounts/components/account-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn()
  })
}));

vi.mock("@/features/accounts/actions/create-account-action", () => ({
  createAccountAction: vi.fn()
}));

vi.mock("@/features/accounts/actions/update-account-action", () => ({
  updateAccountAction: vi.fn()
}));

describe("AccountForm", () => {
  it("shows initial balance when creating a debit account", () => {
    render(<AccountForm showCard={false} />);

    expect(screen.getByLabelText("Tipo")).toHaveDisplayValue("Débito");
    expect(screen.getByLabelText("Saldo inicial")).toBeInTheDocument();
  });

  it("hides initial balance when creating a credit account", async () => {
    const user = userEvent.setup();

    render(<AccountForm showCard={false} />);
    await user.selectOptions(screen.getByLabelText("Tipo"), "credit");

    expect(screen.getByLabelText("Tipo")).toHaveDisplayValue("Crédito");
    expect(screen.queryByLabelText("Saldo inicial")).not.toBeInTheDocument();
    expect(screen.getByText("Crédito só altera o saldo quando a fatura é paga por uma conta débito.")).toBeInTheDocument();
  });

  it("explains credit account restrictions while editing a credit account", () => {
    render(
      <AccountForm
        account={{
          id: "account-credit",
          userId: "user-1",
          name: "Cartão",
          type: "credit",
          initialBalance: 0,
          isActive: true
        }}
        showCard={false}
      />
    );

    expect(screen.getByText("Contas de crédito não recebem entradas e começam com saldo zero.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Saldo inicial")).not.toBeInTheDocument();
    expect(
      screen.getByText("Crédito só altera o saldo quando a fatura é paga por uma conta débito.")
    ).toBeInTheDocument();
  });
});
