import { beforeEach, describe, expect, it, vi } from "vitest";

import { findAccountByIdForUser } from "@/features/accounts/repositories/account-repository";
import type { Account } from "@/features/accounts/types/account";
import { findCategoryByIdForUser } from "@/features/categories/repositories/category-repository";
import type { Category } from "@/features/categories/types/category";
import {
  createTransaction as createTransactionRecord,
  createTransactionSeries
} from "@/features/transactions/repositories/transaction-repository";
import type { ParsedTransactionFormValues } from "@/features/transactions/schemas/transaction-schema";
import { createTransaction } from "@/features/transactions/services/create-transaction-service";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth/session", () => ({
  requireAuthenticatedAppUser: vi.fn()
}));

vi.mock("@/features/accounts/repositories/account-repository", () => ({
  findAccountByIdForUser: vi.fn()
}));

vi.mock("@/features/categories/repositories/category-repository", () => ({
  findCategoryByIdForUser: vi.fn()
}));

vi.mock("@/features/transactions/repositories/transaction-repository", () => ({
  createTransaction: vi.fn(),
  createTransactionSeries: vi.fn()
}));

const userId = "507f1f77bcf86cd799439010";
const accountId = "507f1f77bcf86cd799439011";
const categoryId = "507f1f77bcf86cd799439012";
const paymentForCreditAccountId = "507f1f77bcf86cd799439013";

function buildAccount(type: Account["type"], id = accountId): Account {
  return {
    id,
    userId,
    name: "Conta",
    type,
    initialBalance: 0,
    isActive: true
  };
}

function buildCategory(type: Category["type"]): Category {
  return {
    id: categoryId,
    userId,
    name: "Categoria",
    type,
    isActive: true
  };
}

function buildFormValues(overrides: Partial<ParsedTransactionFormValues> = {}): ParsedTransactionFormValues {
  return {
    description: "Compra no cartão",
    amount: 100,
    type: "expense",
    date: "2026-05-03",
    competencyMonth: "2026-05",
    installmentCount: 1,
    categoryId,
    accountId,
    paymentForCreditAccountId: "",
    notes: "",
    status: "paid",
    isRecurring: false,
    ...overrides
  };
}

describe("createTransaction", () => {
  const requireAuthenticatedAppUserMock = vi.mocked(requireAuthenticatedAppUser);
  const findAccountByIdForUserMock = vi.mocked(findAccountByIdForUser);
  const findCategoryByIdForUserMock = vi.mocked(findCategoryByIdForUser);
  const createTransactionRecordMock = vi.mocked(createTransactionRecord);
  const createTransactionSeriesMock = vi.mocked(createTransactionSeries);

  beforeEach(() => {
    requireAuthenticatedAppUserMock.mockResolvedValue({
      id: userId,
      email: "user@example.com",
      firstName: "User",
      lastName: "Example",
      birthDate: new Date("1990-01-01T12:00:00.000Z"),
      sessionId: "session-id"
    });
    findAccountByIdForUserMock.mockReset();
    findCategoryByIdForUserMock.mockReset();
    createTransactionRecordMock.mockReset();
    createTransactionSeriesMock.mockReset();
    findCategoryByIdForUserMock.mockResolvedValue(buildCategory("expense"));
    createTransactionRecordMock.mockImplementation(async (input) => ({
      id: "created-transaction",
      userId: input.userId,
      description: input.description,
      amount: input.amount,
      type: input.type,
      date: input.date,
      competencyMonth: input.competencyMonth,
      creditPaymentMonth: input.creditPaymentMonth,
      categoryId: input.categoryId,
      accountId: input.accountId,
      paymentForCreditAccountId: input.paymentForCreditAccountId,
      notes: input.notes,
      status: input.status,
      isRecurring: input.isRecurring ?? false,
      installment: input.installment,
      parentTransactionId: input.parentTransactionId
    }));
  });

  it("creates credit transactions with creditPaymentMonth in the next month", async () => {
    findAccountByIdForUserMock.mockResolvedValue(buildAccount("credit"));

    const [createdTransaction] = await createTransaction(buildFormValues());

    expect(createdTransaction.creditPaymentMonth).toBe("2026-06");
    expect(createTransactionRecordMock).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId,
        creditPaymentMonth: "2026-06"
      })
    );
  });

  it("does not require creditPaymentMonth for debit transactions", async () => {
    findAccountByIdForUserMock.mockResolvedValue(buildAccount("debit"));

    const [createdTransaction] = await createTransaction(buildFormValues());

    expect(createdTransaction.creditPaymentMonth).toBeUndefined();
    expect(createTransactionRecordMock.mock.calls[0]?.[0].creditPaymentMonth).toBeUndefined();
  });

  it("does not use creditPaymentMonth for income", async () => {
    findAccountByIdForUserMock.mockResolvedValue(buildAccount("debit"));
    findCategoryByIdForUserMock.mockResolvedValue(buildCategory("income"));

    const [createdTransaction] = await createTransaction(
      buildFormValues({
        description: "Entrada",
        type: "income",
        status: "received"
      })
    );

    expect(createdTransaction.creditPaymentMonth).toBeUndefined();
  });

  it("registers credit invoice payment from a debit account", async () => {
    findAccountByIdForUserMock.mockImplementation(async (requestedAccountId) => {
      if (requestedAccountId === paymentForCreditAccountId) {
        return buildAccount("credit", paymentForCreditAccountId);
      }

      return buildAccount("debit", accountId);
    });

    const [createdTransaction] = await createTransaction(
      buildFormValues({
        description: "Pagamento da fatura",
        paymentForCreditAccountId
      })
    );

    expect(createdTransaction).toEqual(
      expect.objectContaining({
        type: "expense",
        accountId,
        paymentForCreditAccountId,
        creditPaymentMonth: undefined
      })
    );
    expect(createTransactionRecordMock).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId,
        paymentForCreditAccountId
      })
    );
  });
});
