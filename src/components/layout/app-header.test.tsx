import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppHeader } from "@/components/layout/app-header";
import { GlobalTransactionModalContext } from "@/features/transactions/context/global-transaction-modal-context";

vi.mock("@/features/auth/components/logout-button", () => ({
  LogoutButton: () => <button type="button">Sair</button>
}));

vi.mock("@/features/transactions/components/open-transaction-modal-button", () => ({
  OpenTransactionModalButton: ({ children }: { children: ReactNode }) => <button type="button">{children}</button>
}));

describe("AppHeader", () => {
  it("renders the project branding and main navigation", () => {
    render(
      <GlobalTransactionModalContext.Provider
        value={{
          close: () => {},
          open: () => {}
        }}
      >
        <AppHeader />
      </GlobalTransactionModalContext.Provider>
    );

    expect(screen.getByLabelText("Início")).toBeInTheDocument();
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Histórico")).toBeInTheDocument();
    expect(screen.getByText("Nova transação")).toBeInTheDocument();
  });
});
