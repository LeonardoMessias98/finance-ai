import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TransactionsPage, countActiveTransactionFilters } from "@/features/transactions/components/transactions-page";
import type { Account } from "@/features/accounts/types/account";
import type { Category } from "@/features/categories/types/category";
import { getTransactionsPageData } from "@/features/transactions/services/get-transactions-page-data-service";
import type { Transaction } from "@/features/transactions/types/transaction";
import { buildDebitTransactionsMonthlySummary } from "@/features/transactions/utils/build-transaction-account-kind-groups";
import { buildTransactionsListView } from "@/features/transactions/utils/build-transactions-list-view";

vi.mock("server-only", () => ({}));

vi.mock("@/components/layout/authenticated-app-shell", () => ({
  AuthenticatedAppShell: ({ children }: { children: ReactNode }) => <div>{children}</div>
}));

vi.mock("@/components/ui/modal-shell", () => ({
  ModalShell: ({ children, title }: { children: ReactNode; title: string }) => (
    <div aria-label={title} role="dialog">
      {children}
    </div>
  )
}));

vi.mock("@/features/transactions/components/open-transaction-modal-button", () => ({
  OpenTransactionModalButton: ({ children }: { children: ReactNode }) => <button type="button">{children}</button>
}));

vi.mock("@/features/transactions/components/transactions-list", () => ({
  TransactionsList: () => <div>Lista de transações</div>
}));

vi.mock("@/features/transactions/services/get-transactions-page-data-service", () => ({
  getTransactionsPageData: vi.fn()
}));

const filters = {
  competencyMonth: "2026-05",
  accountId: "account-1",
  categoryId: "category-1",
  type: "expense" as const
};

const defaultAccounts: Account[] = [
  {
    id: "account-1",
    userId: "user-1",
    name: "Conta principal",
    type: "debit",
    initialBalance: 0,
    isActive: true
  }
];

const defaultTransactions: Transaction[] = [];
const defaultCategories: Category[] = [
  {
    id: "category-income",
    userId: "user-1",
    name: "Salário",
    type: "income",
    isActive: true
  },
  {
    id: "category-1",
    userId: "user-1",
    name: "Mercado",
    type: "expense",
    isActive: true
  }
];

function createTransaction(
  id: string,
  accountId: string,
  type: Transaction["type"],
  amount: number,
  status: Transaction["status"],
  overrides: Partial<Transaction> = {}
): Transaction {
  return {
    id,
    userId: "user-1",
    description: id,
    amount,
    type,
    date: new Date("2026-05-04T12:00:00.000Z"),
    competencyMonth: "2026-05",
    categoryId: type === "income" ? "category-income" : "category-1",
    accountId,
    status,
    isRecurring: false,
    ...overrides
  };
}

function getSummaryValue(label: string): HTMLElement {
  const container = screen.getByText(label).closest("div");

  if (!container) {
    throw new Error(`Summary container for ${label} was not found.`);
  }

  return within(container).getByText(/R\$/);
}

async function renderTransactionsPage(options?: {
  isFiltersModalOpen?: boolean;
  accounts?: Account[];
  transactions?: Transaction[];
}) {
  const accounts = options?.accounts ?? defaultAccounts;
  const categories = defaultCategories;
  const transactions = options?.transactions ?? defaultTransactions;

  vi.mocked(getTransactionsPageData).mockResolvedValue({
    accounts,
    categories,
    transactions,
    editingTransaction: null,
    monthlyDebitSummary: buildDebitTransactionsMonthlySummary(transactions, accounts),
    accountKindGroups: buildTransactionsListView({
      transactions,
      accounts,
      categories
    })
  });

  render(
    await TransactionsPage({
      filters,
      isFiltersModalOpen: options?.isFiltersModalOpen
    })
  );
}

describe("TransactionsPage filters", () => {
  it("opens the filters modal from search params", async () => {
    await renderTransactionsPage({ isFiltersModalOpen: true });

    expect(screen.getByRole("dialog", { name: "Filtros" })).toBeInTheDocument();
    expect(screen.getByLabelText("Conta")).toBeInTheDocument();
    expect(screen.getByLabelText("Categoria")).toBeInTheDocument();
  });

  it("renders a GET form to apply filters", async () => {
    await renderTransactionsPage({ isFiltersModalOpen: true });

    const applyButton = screen.getByRole("button", { name: "Aplicar" });
    const form = applyButton.closest("form");

    expect(form).toHaveAttribute("action", "/transactions");
    expect(form).toHaveAttribute("method", "get");
    expect(form?.querySelector('input[name="competencyMonth"]')).toHaveAttribute("value", "2026-05");
  });

  it("renders a clear filters action", async () => {
    await renderTransactionsPage({ isFiltersModalOpen: true });

    expect(screen.getByRole("link", { name: "Limpar" })).toHaveAttribute(
      "href",
      "/transactions?competencyMonth=2026-05"
    );
  });

  it("indicates the amount of active filters", async () => {
    await renderTransactionsPage();

    expect(screen.getByRole("link", { name: "Filtros (3)" })).toHaveAttribute(
      "href",
      "/transactions?competencyMonth=2026-05&accountId=account-1&categoryId=category-1&type=expense&filters=open"
    );
    expect(countActiveTransactionFilters(filters)).toBe(3);
  });
});

describe("TransactionsPage monthly summary", () => {
  it("counts debit income in monthly income", async () => {
    await renderTransactionsPage({
      transactions: [createTransaction("debit-income", "account-1", "income", 100_000, "received")]
    });

    expect(getSummaryValue("Entradas")).toHaveTextContent("R$ 1.000,00");
    expect(getSummaryValue("Resultado")).toHaveTextContent("R$ 1.000,00");
  });

  it("counts debit expense in monthly expense", async () => {
    await renderTransactionsPage({
      transactions: [createTransaction("debit-expense", "account-1", "expense", 100_000, "paid")]
    });

    expect(getSummaryValue("Saídas")).toHaveTextContent("R$ 1.000,00");
    expect(getSummaryValue("Resultado")).toHaveTextContent("-R$ 1.000,00");
  });

  it("counts credit card payment as debit monthly expense", async () => {
    await renderTransactionsPage({
      accounts: [
        ...defaultAccounts,
        {
          id: "credit-account",
          userId: "user-1",
          name: "Cartão",
          type: "credit",
          initialBalance: 0,
          isActive: true
        }
      ],
      transactions: [
        createTransaction("credit-payment", "account-1", "expense", 75_000, "paid", {
          paymentForCreditAccountId: "credit-account"
        })
      ]
    });

    expect(getSummaryValue("Saídas")).toHaveTextContent("R$ 750,00");
    expect(getSummaryValue("Resultado")).toHaveTextContent("-R$ 750,00");
  });

  it("ignores credit expenses in monthly expense and result", async () => {
    await renderTransactionsPage({
      accounts: [
        ...defaultAccounts,
        {
          id: "credit-account",
          userId: "user-1",
          name: "Cartão",
          type: "credit",
          initialBalance: 0,
          isActive: true
        }
      ],
      transactions: [
        createTransaction("debit-income", "account-1", "income", 100_000, "received"),
        createTransaction("debit-expense", "account-1", "expense", 100_000, "paid"),
        createTransaction("credit-expense", "credit-account", "expense", 250_000, "paid")
      ]
    });

    expect(getSummaryValue("Entradas")).toHaveTextContent("R$ 1.000,00");
    expect(getSummaryValue("Saídas")).toHaveTextContent("R$ 1.000,00");
    expect(getSummaryValue("Resultado")).toHaveTextContent("R$ 0,00");
  });

  it("ignores legacy credit income in the main monthly summary", async () => {
    await renderTransactionsPage({
      accounts: [
        ...defaultAccounts,
        {
          id: "credit-account",
          userId: "user-1",
          name: "Cartão",
          type: "credit",
          initialBalance: 0,
          isActive: true
        }
      ],
      transactions: [
        createTransaction("debit-income", "account-1", "income", 100_000, "received"),
        createTransaction("debit-expense", "account-1", "expense", 30_000, "paid"),
        createTransaction("legacy-credit-income", "credit-account", "income", 70_000, "received")
      ]
    });

    expect(getSummaryValue("Entradas")).toHaveTextContent("R$ 1.000,00");
    expect(getSummaryValue("Saídas")).toHaveTextContent("R$ 300,00");
    expect(getSummaryValue("Resultado")).toHaveTextContent("R$ 700,00");
  });
});
