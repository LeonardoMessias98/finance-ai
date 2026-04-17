import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppHeader } from "@/components/layout/app-header";

describe("AppHeader", () => {
  it("renders the project branding and main navigation", () => {
    render(<AppHeader />);

    expect(screen.getByText("finance-ai")).toBeInTheDocument();
    expect(screen.getByText("controle pessoal")).toBeInTheDocument();
    expect(screen.getByText("Histórico")).toBeInTheDocument();
    expect(screen.getByText("Nova transação")).toBeInTheDocument();
  });
});
