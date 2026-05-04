import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Account } from "@/features/accounts/types/account";
import { findAccountByIdForUser } from "@/features/accounts/repositories/account-repository";
import type { Category } from "@/features/categories/types/category";
import { findCategoryByIdForUser } from "@/features/categories/repositories/category-repository";
import { assertTransactionRelations } from "@/features/transactions/services/assert-transaction-relations-service";
import { TransactionBusinessError } from "@/features/transactions/services/transaction-errors";

vi.mock("server-only", () => ({}));

vi.mock("@/features/accounts/repositories/account-repository", () => ({
  findAccountByIdForUser: vi.fn()
}));

vi.mock("@/features/categories/repositories/category-repository", () => ({
  findCategoryByIdForUser: vi.fn()
}));

const creditAccountIncomeMessage =
  "Contas de crédito não aceitam receitas. Use uma conta de débito para registrar entradas.";
const userId = "507f1f77bcf86cd799439011";
const accountId = "507f1f77bcf86cd799439012";
const categoryId = "507f1f77bcf86cd799439013";
const paymentForCreditAccountId = "507f1f77bcf86cd799439014";

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

describe("assertTransactionRelations", () => {
  const findAccountByIdForUserMock = vi.mocked(findAccountByIdForUser);
  const findCategoryByIdForUserMock = vi.mocked(findCategoryByIdForUser);

  beforeEach(() => {
    findAccountByIdForUserMock.mockReset();
    findCategoryByIdForUserMock.mockReset();
  });

  it("prevents income in a credit account", async () => {
    findAccountByIdForUserMock.mockResolvedValue(buildAccount("credit"));
    findCategoryByIdForUserMock.mockResolvedValue(buildCategory("income"));

    await expect(
      assertTransactionRelations(
        {
          type: "income",
          accountId,
          categoryId
        },
        userId
      )
    ).rejects.toMatchObject({
      message: creditAccountIncomeMessage,
      fieldErrors: {
        accountId: [creditAccountIncomeMessage]
      }
    } satisfies Partial<TransactionBusinessError>);
  });

  it("prevents income in a legacy credit_card account", async () => {
    findAccountByIdForUserMock.mockResolvedValue(buildAccount("credit_card"));
    findCategoryByIdForUserMock.mockResolvedValue(buildCategory("income"));

    await expect(
      assertTransactionRelations(
        {
          type: "income",
          accountId,
          categoryId
        },
        userId
      )
    ).rejects.toThrow(creditAccountIncomeMessage);
  });

  it("allows income in non-credit accounts", async () => {
    findAccountByIdForUserMock.mockResolvedValue(buildAccount("checking"));
    findCategoryByIdForUserMock.mockResolvedValue(buildCategory("income"));

    await expect(
      assertTransactionRelations(
        {
          type: "income",
          accountId,
          categoryId
        },
        userId
      )
    ).resolves.toBeUndefined();
  });

  it("allows expense in credit accounts", async () => {
    findAccountByIdForUserMock.mockResolvedValue(buildAccount("credit"));
    findCategoryByIdForUserMock.mockResolvedValue(buildCategory("expense"));

    await expect(
      assertTransactionRelations(
        {
          type: "expense",
          accountId,
          categoryId
        },
        userId
      )
    ).resolves.toBeUndefined();
  });

  it("blocks installment expenses in non-credit accounts", async () => {
    findAccountByIdForUserMock.mockResolvedValue(buildAccount("debit"));
    findCategoryByIdForUserMock.mockResolvedValue(buildCategory("expense"));

    await expect(
      assertTransactionRelations(
        {
          type: "expense",
          accountId,
          categoryId,
          installment: {
            current: 1,
            total: 2
          }
        },
        userId
      )
    ).rejects.toThrow("Parcelamento está disponível apenas para despesas em contas de crédito.");
  });

  it("allows installment expenses in credit accounts", async () => {
    findAccountByIdForUserMock.mockResolvedValue(buildAccount("credit"));
    findCategoryByIdForUserMock.mockResolvedValue(buildCategory("expense"));

    await expect(
      assertTransactionRelations(
        {
          type: "expense",
          accountId,
          categoryId,
          installment: {
            current: 1,
            total: 12
          }
        },
        userId
      )
    ).resolves.toBeUndefined();
  });

  it("allows card payment from a debit account", async () => {
    findAccountByIdForUserMock.mockImplementation(async (requestedAccountId) => {
      if (requestedAccountId === paymentForCreditAccountId) {
        return buildAccount("credit", paymentForCreditAccountId);
      }

      return buildAccount("debit", accountId);
    });
    findCategoryByIdForUserMock.mockResolvedValue(buildCategory("expense"));

    await expect(
      assertTransactionRelations(
        {
          type: "expense",
          accountId,
          categoryId,
          paymentForCreditAccountId
        },
        userId
      )
    ).resolves.toBeUndefined();
  });

  it("associates card payment with a credit account", async () => {
    findAccountByIdForUserMock.mockImplementation(async (requestedAccountId) => {
      if (requestedAccountId === paymentForCreditAccountId) {
        return buildAccount("credit_card", paymentForCreditAccountId);
      }

      return buildAccount("checking", accountId);
    });
    findCategoryByIdForUserMock.mockResolvedValue(buildCategory("expense"));

    await expect(
      assertTransactionRelations(
        {
          type: "expense",
          accountId,
          categoryId,
          paymentForCreditAccountId
        },
        userId
      )
    ).resolves.toBeUndefined();
  });

  it("prevents card payment from a credit account", async () => {
    findAccountByIdForUserMock.mockImplementation(async (requestedAccountId) => {
      if (requestedAccountId === paymentForCreditAccountId) {
        return buildAccount("credit", paymentForCreditAccountId);
      }

      return buildAccount("credit", accountId);
    });
    findCategoryByIdForUserMock.mockResolvedValue(buildCategory("expense"));

    await expect(
      assertTransactionRelations(
        {
          type: "expense",
          accountId,
          categoryId,
          paymentForCreditAccountId
        },
        userId
      )
    ).rejects.toMatchObject({
      fieldErrors: {
        accountId: ["Pagamento de cartão deve sair de uma conta de débito."]
      }
    } satisfies Partial<TransactionBusinessError>);
  });

  it("prevents card payment association with a non-credit account", async () => {
    findAccountByIdForUserMock.mockImplementation(async (requestedAccountId) => {
      if (requestedAccountId === paymentForCreditAccountId) {
        return buildAccount("debit", paymentForCreditAccountId);
      }

      return buildAccount("debit", accountId);
    });
    findCategoryByIdForUserMock.mockResolvedValue(buildCategory("expense"));

    await expect(
      assertTransactionRelations(
        {
          type: "expense",
          accountId,
          categoryId,
          paymentForCreditAccountId
        },
        userId
      )
    ).rejects.toMatchObject({
      fieldErrors: {
        paymentForCreditAccountId: ["Associe o pagamento a uma conta de crédito."]
      }
    } satisfies Partial<TransactionBusinessError>);
  });
});
