import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

describe("LoadingSpinner", () => {
  it("renders the loading status", () => {
    render(<LoadingSpinner />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Carregando")).toHaveClass("sr-only");
  });

  it("renders an optional label", () => {
    render(<LoadingSpinner label="Carregando transações..." />);

    expect(screen.getByRole("status", { name: "Carregando transações..." })).toBeInTheDocument();
    expect(screen.getByText("Carregando transações...")).toBeInTheDocument();
  });
});
