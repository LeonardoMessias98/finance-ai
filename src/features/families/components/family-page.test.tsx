import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FamilyPage } from "@/features/families/components/family-page";
import { getFamilyFinancialSummary } from "@/features/families/services/get-family-financial-summary-service";
import type { FamilyFinancialSummary } from "@/features/families/types/family-financial-summary";

vi.mock("server-only", () => ({}));

vi.mock("@/components/layout/authenticated-app-shell", () => ({
  AuthenticatedAppShell: ({ children }: { children: ReactNode }) => <div>{children}</div>
}));

vi.mock("@/features/families/services/get-family-financial-summary-service", () => ({
  getFamilyFinancialSummary: vi.fn()
}));

const familySummary: FamilyFinancialSummary = {
  family: {
    id: "507f1f77bcf86cd799439001",
    name: "Casa",
    ownerUserId: "owner-user",
    members: [
      {
        userId: "owner-user",
        role: "owner",
        canView: true
      }
    ],
    createdAt: new Date("2026-05-03T12:00:00.000Z"),
    updatedAt: new Date("2026-05-03T12:00:00.000Z")
  },
  competencyMonth: "2026-05",
  members: [
    {
      userId: "owner-user",
      displayName: "Leonardo Messias",
      role: "owner",
      canView: true,
      totalCurrentBalance: 120_000,
      monthlyIncome: 100_000,
      monthlyDebitIncome: 100_000,
      monthlyExpense: 30_000,
      monthlyDebitExpense: 30_000,
      monthlyCreditExpense: 26_000,
      monthlyResult: 70_000,
      expenseCategoryBreakdown: {
        memberId: "owner-user",
        memberName: "Leonardo Messias",
        debit: {
          totalExpenses: 30_000,
          expensesByCategory: [
            {
              categoryId: "category-food",
              categoryName: "Alimentação",
              amount: 30_000,
              percentage: 1
            }
          ]
        },
        credit: {
          totalExpenses: 26_000,
          expensesByCategory: [
            {
              categoryId: "category-fun",
              categoryName: "Lazer",
              amount: 26_000,
              percentage: 1
            }
          ]
        }
      },
      latestTransactions: [
        {
          id: "debit-expense",
          description: "Mercado",
          amount: 30_000,
          type: "expense",
          status: "paid",
          date: new Date("2026-05-03T12:00:00.000Z"),
          accountName: "Conta",
          accountType: "checking",
          categoryName: "Alimentação"
        },
        {
          id: "credit-expense",
          description: "Compra no crédito",
          amount: 26_000,
          type: "expense",
          status: "paid",
          date: new Date("2026-05-04T12:00:00.000Z"),
          accountName: "Cartão",
          accountType: "credit_card",
          categoryName: "Lazer"
        }
      ]
    }
  ],
  totalCurrentBalance: 120_000,
  monthlyIncome: 100_000,
  monthlyDebitIncome: 100_000,
  monthlyExpense: 30_000,
  monthlyDebitExpense: 30_000,
  monthlyCreditExpense: 26_000,
  monthlyResult: 70_000
};

async function renderFamilyPage(
  summary: FamilyFinancialSummary | null = familySummary,
  competencyMonth = "2026-05"
) {
  vi.mocked(getFamilyFinancialSummary).mockResolvedValue(summary);

  render(
    await FamilyPage({
      competencyMonth
    })
  );
}

function getMemberCard(memberName: string): HTMLElement {
  return screen.getByRole("region", {
    name: `Resumo de ${memberName}`
  });
}

function getStatValue(container: HTMLElement, label: string): HTMLElement {
  const statContainer = within(container).getByText(label).closest("div");

  if (!statContainer) {
    throw new Error(`Stat container for ${label} was not found.`);
  }

  return within(statContainer).getByText(/R\$/);
}

describe("FamilyPage", () => {
  it("renders the selected month", async () => {
    await renderFamilyPage();

    expect(screen.getByText("maio de 2026")).toBeInTheDocument();
    expect(screen.getByLabelText("Mês exibido")).toHaveDisplayValue("2026-05");
    expect(getFamilyFinancialSummary).toHaveBeenCalledWith({
      competencyMonth: "2026-05"
    });
  });

  it("links to the previous month", async () => {
    await renderFamilyPage();

    expect(screen.getByRole("link", { name: "Anterior" })).toHaveAttribute(
      "href",
      "/family?competencyMonth=2026-04"
    );
  });

  it("links to the next month", async () => {
    await renderFamilyPage();

    expect(screen.getByRole("link", { name: "Próximo" })).toHaveAttribute(
      "href",
      "/family?competencyMonth=2026-06"
    );
  });

  it("updates the family summary for the selected month", async () => {
    await renderFamilyPage(
      {
        ...familySummary,
        competencyMonth: "2026-06",
        totalCurrentBalance: 90_000,
        monthlyDebitIncome: 80_000,
        monthlyDebitExpense: 45_000,
        monthlyCreditExpense: 10_000,
        monthlyResult: 35_000
      },
      "2026-06"
    );

    const familySummaryRegion = screen.getByRole("region", {
      name: "Resumo consolidado da família"
    });

    expect(screen.getByText("junho de 2026")).toBeInTheDocument();
    expect(getFamilyFinancialSummary).toHaveBeenCalledWith({
      competencyMonth: "2026-06"
    });
    expect(getStatValue(familySummaryRegion, "Saldo familiar")).toHaveTextContent("R$ 900,00");
    expect(getStatValue(familySummaryRegion, "Entradas débito")).toHaveTextContent("R$ 800,00");
    expect(getStatValue(familySummaryRegion, "Gastos débito")).toHaveTextContent("R$ 450,00");
    expect(getStatValue(familySummaryRegion, "Gastos crédito")).toHaveTextContent("R$ 100,00");
    expect(getStatValue(familySummaryRegion, "Resultado débito")).toHaveTextContent("R$ 350,00");
  });

  it("updates category charts for the selected month", async () => {
    await renderFamilyPage(
      {
        ...familySummary,
        competencyMonth: "2026-06",
        members: [
          {
            ...familySummary.members[0],
            expenseCategoryBreakdown: {
              memberId: "owner-user",
              memberName: "Leonardo Messias",
              debit: {
                totalExpenses: 45_000,
                expensesByCategory: [
                  {
                    categoryId: "category-transport",
                    categoryName: "Transporte",
                    amount: 45_000,
                    percentage: 1
                  }
                ]
              },
              credit: {
                totalExpenses: 10_000,
                expensesByCategory: [
                  {
                    categoryId: "category-health",
                    categoryName: "Saúde",
                    amount: 10_000,
                    percentage: 1
                  }
                ]
              }
            }
          }
        ]
      },
      "2026-06"
    );

    const categorySection = screen.getByRole("region", {
      name: "Gastos por categoria de Leonardo Messias"
    });

    expect(within(categorySection).getByText("Transporte")).toBeInTheDocument();
    expect(within(categorySection).getByText("Saúde")).toBeInTheDocument();
    expect(within(categorySection).getByRole("region", { name: "Débito" })).toHaveTextContent("R$ 450,00");
    expect(within(categorySection).getByRole("region", { name: "Crédito" })).toHaveTextContent("R$ 100,00");
  });

  it("renders a card for each member", async () => {
    await renderFamilyPage({
      ...familySummary,
      members: [
        familySummary.members[0],
        {
          ...familySummary.members[0],
          userId: "member-user",
          displayName: "Aissa de Oliveira",
          role: "member",
          expenseCategoryBreakdown: {
            ...familySummary.members[0].expenseCategoryBreakdown,
            memberId: "member-user",
            memberName: "Aissa de Oliveira"
          },
          latestTransactions: []
        }
      ]
    });

    expect(getMemberCard("Leonardo Messias")).toBeInTheDocument();
    expect(getMemberCard("Aissa de Oliveira")).toBeInTheDocument();
  });

  it("shows debit and credit expenses separately for each member", async () => {
    await renderFamilyPage();

    const memberCard = getMemberCard("Leonardo Messias");

    expect(within(memberCard).getByText("Débito")).toBeInTheDocument();
    expect(within(memberCard).getByText("Crédito")).toBeInTheDocument();
    expect(within(memberCard).getByText("Gastos débito")).toBeInTheDocument();
    expect(within(memberCard).getByText("Gastos crédito")).toBeInTheDocument();
    expect(within(memberCard).getByText("Resultado débito")).toBeInTheDocument();
    expect(getStatValue(memberCard, "Entradas débito")).toHaveTextContent("R$ 1.000,00");
    expect(getStatValue(memberCard, "Gastos débito")).toHaveTextContent("R$ 300,00");
    expect(getStatValue(memberCard, "Gastos crédito")).toHaveTextContent("R$ 260,00");
    expect(getStatValue(memberCard, "Resultado débito")).toHaveTextContent("R$ 700,00");
    expect(
      within(memberCard).getByText(
        "Crédito aparece apenas como visualização. O saldo muda quando a fatura é paga no débito."
      )
    ).toBeInTheDocument();
  });

  it("shows the consolidated family summary with debit and credit separated", async () => {
    await renderFamilyPage();

    const familySummaryRegion = screen.getByRole("region", {
      name: "Resumo consolidado da família"
    });

    expect(getStatValue(familySummaryRegion, "Saldo familiar")).toHaveTextContent("R$ 1.200,00");
    expect(getStatValue(familySummaryRegion, "Entradas débito")).toHaveTextContent("R$ 1.000,00");
    expect(getStatValue(familySummaryRegion, "Gastos débito")).toHaveTextContent("R$ 300,00");
    expect(getStatValue(familySummaryRegion, "Gastos crédito")).toHaveTextContent("R$ 260,00");
    expect(getStatValue(familySummaryRegion, "Resultado débito")).toHaveTextContent("R$ 700,00");
  });

  it("keeps the compact latest transactions section visible", async () => {
    await renderFamilyPage();

    const memberCard = getMemberCard("Leonardo Messias");

    expect(within(memberCard).getByText("Mercado")).toBeInTheDocument();
    expect(within(memberCard).getByText("Compra no crédito")).toBeInTheDocument();
  });

  it("renders category expense charts by member", async () => {
    await renderFamilyPage();

    const categorySection = screen.getByRole("region", {
      name: "Gastos por categoria de Leonardo Messias"
    });

    expect(screen.getByRole("heading", { name: "Gastos por categoria" })).toBeInTheDocument();
    expect(within(categorySection).getAllByRole("img", { name: /Distribuição de gastos por categoria/ })).toHaveLength(2);
    expect(within(categorySection).getByText("Alimentação")).toBeInTheDocument();
    expect(within(categorySection).getByText("Lazer")).toBeInTheDocument();
    expect(within(categorySection).getByRole("region", { name: "Débito" })).toHaveTextContent("R$ 300,00");
    expect(within(categorySection).getByRole("region", { name: "Crédito" })).toHaveTextContent("R$ 260,00");
  });

  it("handles empty recent transactions and category charts", async () => {
    await renderFamilyPage({
      ...familySummary,
      members: [
        {
          ...familySummary.members[0],
          latestTransactions: [],
          expenseCategoryBreakdown: {
            memberId: "owner-user",
            memberName: "Leonardo Messias",
            debit: {
              totalExpenses: 0,
              expensesByCategory: []
            },
            credit: {
              totalExpenses: 0,
              expensesByCategory: []
            }
          }
        }
      ]
    });

    const memberCard = getMemberCard("Leonardo Messias");
    const categorySection = screen.getByRole("region", {
      name: "Gastos por categoria de Leonardo Messias"
    });

    expect(within(memberCard).getByText("Sem transações no mês.")).toBeInTheDocument();
    expect(within(categorySection).getByText("Sem gastos de débito por categoria neste mês.")).toBeInTheDocument();
    expect(within(categorySection).getByText("Sem gastos de crédito por categoria neste mês.")).toBeInTheDocument();
  });
});
