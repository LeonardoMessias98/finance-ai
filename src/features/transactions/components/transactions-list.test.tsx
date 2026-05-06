import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TransactionsList } from "@/features/transactions/components/transactions-list";
import type { Account } from "@/features/accounts/types/account";
import type { Category } from "@/features/categories/types/category";
import type { Transaction } from "@/features/transactions/types/transaction";
import { buildTransactionsListView } from "@/features/transactions/utils/build-transactions-list-view";

vi.mock("@/features/transactions/components/transaction-delete-button", () => ({
  TransactionDeleteButton: ({ transactionId }: { transactionId: string }) => (
    <button type="button">Excluir {transactionId}</button>
  )
}));

const accounts: Account[] = [
  {
    id: "account-1",
    userId: "user-1",
    name: "Conta principal",
    type: "debit",
    initialBalance: 0,
    isActive: true
  },
  {
    id: "account-credit",
    userId: "user-1",
    name: "Cartão atual",
    type: "credit",
    initialBalance: 0,
    isActive: true
  },
  {
    id: "account-credit-card",
    userId: "user-1",
    name: "Cartão antigo",
    type: "credit_card",
    initialBalance: 0,
    isActive: true
  },
  {
    id: "account-checking",
    userId: "user-1",
    name: "Conta corrente antiga",
    type: "checking",
    initialBalance: 0,
    isActive: true
  },
  {
    id: "account-savings",
    userId: "user-1",
    name: "Poupança antiga",
    type: "savings",
    initialBalance: 0,
    isActive: true
  },
  {
    id: "account-cash",
    userId: "user-1",
    name: "Dinheiro antigo",
    type: "cash",
    initialBalance: 0,
    isActive: true
  },
  {
    id: "account-investment",
    userId: "user-1",
    name: "Investimento antigo",
    type: "investment",
    initialBalance: 0,
    isActive: true
  }
];

const categories: Category[] = [
  {
    id: "category-income",
    userId: "user-1",
    name: "Salário",
    type: "income",
    isActive: true
  },
  {
    id: "category-expense",
    userId: "user-1",
    name: "Mercado",
    type: "expense",
    isActive: true
  }
];

const transactions: Transaction[] = [
  {
    id: "transaction-income",
    userId: "user-1",
    description: "Salário mensal",
    amount: 500_000,
    type: "income",
    date: new Date("2026-05-03T12:00:00.000Z"),
    competencyMonth: "2026-05",
    categoryId: "category-income",
    accountId: "account-1",
    status: "received",
    isRecurring: false
  },
  {
    id: "transaction-expense",
    userId: "user-1",
    description: "Compra do mercado",
    amount: 12_345,
    type: "expense",
    date: new Date("2026-05-04T12:00:00.000Z"),
    competencyMonth: "2026-05",
    categoryId: "category-expense",
    accountId: "account-1",
    status: "paid",
    isRecurring: false
  },
  {
    id: "transaction-credit",
    userId: "user-1",
    description: "Compra no crédito",
    amount: 20_000,
    type: "expense",
    date: new Date("2026-05-04T12:00:00.000Z"),
    competencyMonth: "2026-05",
    categoryId: "category-expense",
    accountId: "account-credit",
    status: "paid",
    isRecurring: false
  },
  {
    id: "transaction-credit-card",
    userId: "user-1",
    description: "Compra no cartão antigo",
    amount: 30_000,
    type: "expense",
    date: new Date("2026-05-05T12:00:00.000Z"),
    competencyMonth: "2026-05",
    categoryId: "category-expense",
    accountId: "account-credit-card",
    status: "paid",
    isRecurring: false
  },
  {
    id: "transaction-credit-income",
    userId: "user-1",
    description: "Receita antiga no crédito",
    amount: 70_000,
    type: "income",
    date: new Date("2026-05-05T12:00:00.000Z"),
    competencyMonth: "2026-05",
    categoryId: "category-income",
    accountId: "account-credit",
    status: "received",
    isRecurring: false
  },
  {
    id: "transaction-checking",
    userId: "user-1",
    description: "Despesa conta corrente antiga",
    amount: 100,
    type: "expense",
    date: new Date("2026-05-05T12:00:00.000Z"),
    competencyMonth: "2026-05",
    categoryId: "category-expense",
    accountId: "account-checking",
    status: "paid",
    isRecurring: false
  },
  {
    id: "transaction-savings",
    userId: "user-1",
    description: "Despesa poupança antiga",
    amount: 200,
    type: "expense",
    date: new Date("2026-05-05T12:00:00.000Z"),
    competencyMonth: "2026-05",
    categoryId: "category-expense",
    accountId: "account-savings",
    status: "paid",
    isRecurring: false
  },
  {
    id: "transaction-cash",
    userId: "user-1",
    description: "Despesa dinheiro antigo",
    amount: 300,
    type: "expense",
    date: new Date("2026-05-05T12:00:00.000Z"),
    competencyMonth: "2026-05",
    categoryId: "category-expense",
    accountId: "account-cash",
    status: "paid",
    isRecurring: false
  },
  {
    id: "transaction-investment",
    userId: "user-1",
    description: "Despesa investimento antigo",
    amount: 400,
    type: "expense",
    date: new Date("2026-05-05T12:00:00.000Z"),
    competencyMonth: "2026-05",
    categoryId: "category-expense",
    accountId: "account-investment",
    status: "paid",
    isRecurring: false
  }
];

function renderTransactionsList() {
  return render(
    <TransactionsList
      accountKindGroups={buildTransactionsListView({
        transactions,
        accounts,
        categories
      })}
      filters={{
        competencyMonth: "2026-05"
      }}
      transactionCount={transactions.length}
    />
  );
}

async function expandCreditGroup() {
  const user = userEvent.setup();
  const creditToggle = screen.getByRole("button", { name: /crédito/i });

  await user.click(creditToggle);

  return {
    user,
    creditToggle
  };
}

async function expandDebitGroup() {
  const user = userEvent.setup();
  const debitToggle = screen.getByRole("button", { name: /débito/i });

  await user.click(debitToggle);

  return {
    user,
    debitToggle
  };
}

describe("TransactionsList", () => {
  it("renders transactions grouped by date", async () => {
    renderTransactionsList();
    await expandDebitGroup();

    expect(screen.getByRole("region", { name: "Transações de 03 de mai. de 2026" })).toBeInTheDocument();
    expect(screen.getAllByRole("region", { name: "Transações de 04 de mai. de 2026" }).length).toBeGreaterThan(0);
  });

  it("shows description, amount, category, account and status", async () => {
    renderTransactionsList();
    await expandDebitGroup();

    expect(screen.getByText("Compra do mercado")).toBeInTheDocument();
    expect(screen.getByText("-R$ 123,45")).toBeInTheDocument();
    expect(screen.getAllByText("Mercado").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Conta principal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Paga").length).toBeGreaterThan(0);
  });

  it("differentiates income and expense visually", async () => {
    renderTransactionsList();
    await expandDebitGroup();

    expect(screen.getByText("+R$ 5.000,00")).toHaveClass("text-income");
    expect(screen.getByText("-R$ 123,45")).toHaveClass("text-destructive");
  });

  it("keeps a responsive card layout without table columns", async () => {
    renderTransactionsList();
    await expandDebitGroup();

    const expenseCard = screen.getByText("Compra do mercado").closest("article");

    expect(expenseCard).toHaveClass("rounded-2xl");
    expect(expenseCard?.querySelector("table")).not.toBeInTheDocument();
    expect(within(expenseCard as HTMLElement).getByRole("link", { name: /editar/i })).toBeInTheDocument();
  });

  it("lists debit transactions in the debit group", async () => {
    renderTransactionsList();
    await expandDebitGroup();

    const debitGroup = screen.getByRole("region", { name: "Grupo Débito" });

    expect(within(debitGroup).getByText("Compra do mercado")).toBeInTheDocument();
    expect(within(debitGroup).queryByText("Compra no crédito")).not.toBeInTheDocument();
  });

  it("lists credit transactions in the credit group", async () => {
    renderTransactionsList();
    await expandCreditGroup();

    const creditGroup = screen.getByRole("region", { name: "Grupo Crédito" });

    expect(within(creditGroup).getByText("Compra no crédito")).toBeInTheDocument();
    expect(within(creditGroup).getByText("Compra no cartão antigo")).toBeInTheDocument();
    expect(within(creditGroup).queryByText("Compra do mercado")).not.toBeInTheDocument();
  });

  it("calculates the debit result", () => {
    renderTransactionsList();

    const debitGroup = screen.getByRole("region", { name: "Grupo Débito" });

    expect(within(debitGroup).getByText("Resultado:")).toBeInTheDocument();
    expect(within(debitGroup).getByText("R$ 4.866,55")).toBeInTheDocument();
  });

  it("calculates the credit total", () => {
    renderTransactionsList();

    const creditGroup = screen.getByRole("region", { name: "Grupo Crédito" });

    expect(within(creditGroup).getByText("R$ 500,00")).toBeInTheDocument();
  });

  it("ignores legacy credit income in the credit visual total", async () => {
    renderTransactionsList();
    await expandCreditGroup();

    const creditGroup = screen.getByRole("region", { name: "Grupo Crédito" });

    expect(within(creditGroup).getByText("R$ 500,00")).toBeInTheDocument();
    expect(within(creditGroup).getByText("Receita antiga no crédito")).toBeInTheDocument();
    expect(within(creditGroup).queryByText("R$ 1.200,00")).not.toBeInTheDocument();
  });

  it("treats legacy credit_card accounts as credit", async () => {
    renderTransactionsList();
    await expandCreditGroup();

    const creditGroup = screen.getByRole("region", { name: "Grupo Crédito" });

    expect(within(creditGroup).getByText("Cartão antigo")).toBeInTheDocument();
    expect(within(creditGroup).getByText("Compra no cartão antigo")).toBeInTheDocument();
  });

  it("treats legacy non-credit accounts as debit", async () => {
    renderTransactionsList();
    await expandDebitGroup();

    const debitGroup = screen.getByRole("region", { name: "Grupo Débito" });

    expect(within(debitGroup).getByText("Conta corrente antiga")).toBeInTheDocument();
    expect(within(debitGroup).getByText("Poupança antiga")).toBeInTheDocument();
    expect(within(debitGroup).getByText("Dinheiro antigo")).toBeInTheDocument();
    expect(within(debitGroup).getByText("Investimento antigo")).toBeInTheDocument();
  });

  it("renders the debit group collapsed", () => {
    renderTransactionsList();

    const debitGroup = screen.getByRole("region", { name: "Grupo Débito" });
    const debitToggle = within(debitGroup).getByRole("button", { name: /débito/i });

    expect(debitToggle).toHaveAttribute("aria-expanded", "false");
    expect(within(debitGroup).getByText("Resultado:")).toBeInTheDocument();
    expect(within(debitGroup).getByText("R$ 4.866,55")).toBeInTheDocument();
    expect(within(debitGroup).queryByText("Compra do mercado")).not.toBeInTheDocument();
  });

  it("expands the debit group when clicking", async () => {
    renderTransactionsList();

    const { debitToggle } = await expandDebitGroup();
    const debitGroup = screen.getByRole("region", { name: "Grupo Débito" });

    expect(debitToggle).toHaveAttribute("aria-expanded", "true");
    expect(within(debitGroup).getByText("Compra do mercado")).toBeInTheDocument();
  });

  it("collapses the debit group when clicking again", async () => {
    renderTransactionsList();

    const { user, debitToggle } = await expandDebitGroup();
    await user.click(debitToggle);

    const debitGroup = screen.getByRole("region", { name: "Grupo Débito" });

    expect(debitToggle).toHaveAttribute("aria-expanded", "false");
    expect(within(debitGroup).queryByText("Compra do mercado")).not.toBeInTheDocument();
  });

  it("keeps the debit result visible when collapsed", async () => {
    renderTransactionsList();

    const { user, debitToggle } = await expandDebitGroup();
    await user.click(debitToggle);

    const debitGroup = screen.getByRole("region", { name: "Grupo Débito" });

    expect(debitToggle).toHaveAttribute("aria-expanded", "false");
    expect(within(debitGroup).getByText("Resultado:")).toBeInTheDocument();
    expect(within(debitGroup).getByText("R$ 4.866,55")).toBeInTheDocument();
  });

  it("renders the credit group collapsed", () => {
    renderTransactionsList();

    const creditGroup = screen.getByRole("region", { name: "Grupo Crédito" });
    const creditToggle = within(creditGroup).getByRole("button", { name: /crédito/i });

    expect(creditToggle).toHaveAttribute("aria-expanded", "false");
    expect(within(creditGroup).getByText("R$ 500,00")).toBeInTheDocument();
    expect(within(creditGroup).queryByText("Compra no crédito")).not.toBeInTheDocument();
  });

  it("expands the credit group when clicking", async () => {
    renderTransactionsList();

    const { creditToggle } = await expandCreditGroup();
    const creditGroup = screen.getByRole("region", { name: "Grupo Crédito" });

    expect(creditToggle).toHaveAttribute("aria-expanded", "true");
    expect(within(creditGroup).getByText("Compra no crédito")).toBeInTheDocument();
  });

  it("collapses the credit group when clicking again", async () => {
    renderTransactionsList();

    const { user, creditToggle } = await expandCreditGroup();
    await user.click(creditToggle);

    const creditGroup = screen.getByRole("region", { name: "Grupo Crédito" });

    expect(creditToggle).toHaveAttribute("aria-expanded", "false");
    expect(within(creditGroup).queryByText("Compra no crédito")).not.toBeInTheDocument();
  });

  it("keeps the credit total visible when collapsed", async () => {
    renderTransactionsList();

    const { user, creditToggle } = await expandCreditGroup();
    await user.click(creditToggle);

    const creditGroup = screen.getByRole("region", { name: "Grupo Crédito" });

    expect(creditToggle).toHaveAttribute("aria-expanded", "false");
    expect(within(creditGroup).getByText("R$ 500,00")).toBeInTheDocument();
  });

  it("explains that credit only affects balance when the invoice is paid", () => {
    renderTransactionsList();

    const creditGroup = screen.getByRole("region", { name: "Grupo Crédito" });

    expect(
      within(creditGroup).getByText("Compras no crédito aparecem aqui, mas só afetam o saldo quando a fatura é paga.")
    ).toBeInTheDocument();
  });
});
