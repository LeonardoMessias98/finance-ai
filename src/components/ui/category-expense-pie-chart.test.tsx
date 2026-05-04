import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoryExpensePieChart } from "@/components/ui/category-expense-pie-chart";

const data = [
  {
    categoryName: "Alimentação",
    amount: 80_000,
    percentage: 0.8
  },
  {
    categoryName: "Transporte",
    amount: 20_000,
    percentage: 0.2
  }
];

describe("CategoryExpensePieChart", () => {
  it("renders the title", () => {
    render(<CategoryExpensePieChart data={data} title="Gastos por categoria" />);

    expect(screen.getByRole("heading", { name: "Gastos por categoria" })).toBeInTheDocument();
  });

  it("renders the pie slices and legend", () => {
    render(<CategoryExpensePieChart data={data} title="Gastos por categoria" />);

    expect(
      screen.getByRole("img", {
        name: "Distribuição de gastos por categoria: Gastos por categoria"
      })
    ).toBeInTheDocument();
    expect(screen.getByText("Alimentação")).toBeInTheDocument();
    expect(screen.getByText("Transporte")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });

  it("renders the empty state", () => {
    render(<CategoryExpensePieChart data={[]} title="Gastos por categoria" />);

    expect(screen.getByText("Sem gastos por categoria neste mês.")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("formats amounts correctly", () => {
    render(<CategoryExpensePieChart data={data} title="Gastos por categoria" />);

    const chart = screen.getByRole("region", {
      name: "Gastos por categoria"
    });

    expect(within(chart).getByText("R$ 800,00")).toBeInTheDocument();
    expect(within(chart).getByText("R$ 200,00")).toBeInTheDocument();
  });
});
