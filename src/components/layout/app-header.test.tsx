import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppHeader } from "@/components/layout/app-header";
import { GlobalTransactionModalContext } from "@/features/transactions/context/global-transaction-modal-context";

const openTransactionModalMock = vi.fn();

vi.mock("@/features/auth/components/logout-button", () => ({
  LogoutButton: () => <button type="button">Sair</button>
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams()
}));

describe("AppHeader", () => {
  beforeEach(() => {
    openTransactionModalMock.mockReset();
  });

  function renderAppHeader() {
    render(
      <GlobalTransactionModalContext.Provider
        value={{
          close: () => {},
          open: openTransactionModalMock
        }}
      >
        <AppHeader />
      </GlobalTransactionModalContext.Provider>
    );
  }

  it("renders the project branding and main navigation", () => {
    renderAppHeader();

    expect(screen.getByLabelText("Início")).toBeInTheDocument();
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Histórico")).toBeInTheDocument();
  });

  it("keeps the full new transaction label available on desktop", () => {
    renderAppHeader();

    expect(screen.getByText("Nova transação")).toHaveClass("sm:not-sr-only");
  });

  it("renders an accessible compact new transaction button on mobile", () => {
    renderAppHeader();

    const button = screen.getByRole("button", { name: "Nova transação" });

    expect(button).toHaveAttribute("aria-label", "Nova transação");
    expect(button).toHaveClass("w-10");
    expect(screen.getByText("Nova transação")).toHaveClass("sr-only");
  });

  it("keeps the new transaction action working", async () => {
    const user = userEvent.setup();

    renderAppHeader();
    await user.click(screen.getByRole("button", { name: "Nova transação" }));

    expect(openTransactionModalMock).toHaveBeenCalledWith({
      defaultCompetencyMonth: expect.stringMatching(/^\d{4}-\d{2}$/),
      defaultType: undefined
    });
  });
});
