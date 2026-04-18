import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/features/auth/components/login-form";

const loginActionMock = vi.fn();
const replaceMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("@/features/auth/actions/login-action", () => ({
  loginAction: (...args: unknown[]) => loginActionMock(...args)
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    refresh: refreshMock
  })
}));

describe("LoginForm", () => {
  beforeEach(() => {
    loginActionMock.mockReset();
    replaceMock.mockReset();
    refreshMock.mockReset();
  });

  it("mostra erros de validacao antes de enviar", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Informe um email válido.")).toBeInTheDocument();
    expect(screen.getByText("Use no mínimo 6 caracteres.")).toBeInTheDocument();
    expect(loginActionMock).not.toHaveBeenCalled();
  });

  it("mostra erro de senha fora do padrao", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "owner@finance-ai.local");
    await user.type(screen.getByLabelText("Senha"), "123 456");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("A senha não pode conter espaços.")).toBeInTheDocument();
    expect(loginActionMock).not.toHaveBeenCalled();
  });
});
