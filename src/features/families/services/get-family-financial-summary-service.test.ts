import { beforeEach, describe, expect, it, vi } from "vitest";

import { listAccounts } from "@/features/accounts/repositories/account-repository";
import { findUserById } from "@/features/auth/repositories/user-repository";
import { listCategories } from "@/features/categories/repositories/category-repository";
import { findFirstFamilyForMember } from "@/features/families/repositories/family-repository";
import { getFamilyFinancialSummary } from "@/features/families/services/get-family-financial-summary-service";
import type { Family } from "@/features/families/types/family";
import { listTransactions } from "@/features/transactions/repositories/transaction-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth/session", () => ({
  requireAuthenticatedAppUser: vi.fn()
}));

vi.mock("@/features/families/repositories/family-repository", () => ({
  findFirstFamilyForMember: vi.fn()
}));

vi.mock("@/features/auth/repositories/user-repository", () => ({
  findUserById: vi.fn()
}));

vi.mock("@/features/accounts/repositories/account-repository", () => ({
  listAccounts: vi.fn()
}));

vi.mock("@/features/categories/repositories/category-repository", () => ({
  listCategories: vi.fn()
}));

vi.mock("@/features/transactions/repositories/transaction-repository", () => ({
  listTransactions: vi.fn()
}));

const ownerUserId = "507f1f77bcf86cd799439011";
const memberUserId = "507f1f77bcf86cd799439012";
const blockedUserId = "507f1f77bcf86cd799439013";
const accountId = "507f1f77bcf86cd799439021";
const creditAccountId = "507f1f77bcf86cd799439022";
const categoryIncomeId = "507f1f77bcf86cd799439031";
const categoryExpenseId = "507f1f77bcf86cd799439032";

function buildFamily(): Family {
  return {
    id: "507f1f77bcf86cd799439001",
    name: "Casa",
    ownerUserId,
    members: [
      {
        userId: ownerUserId,
        role: "owner",
        canView: true
      },
      {
        userId: memberUserId,
        role: "member",
        canView: true
      },
      {
        userId: blockedUserId,
        role: "member",
        canView: false
      }
    ],
    createdAt: new Date("2026-05-03T12:00:00.000Z"),
    updatedAt: new Date("2026-05-03T12:00:00.000Z")
  };
}

describe("getFamilyFinancialSummary", () => {
  const requireAuthenticatedAppUserMock = vi.mocked(requireAuthenticatedAppUser);
  const findFirstFamilyForMemberMock = vi.mocked(findFirstFamilyForMember);
  const findUserByIdMock = vi.mocked(findUserById);
  const listAccountsMock = vi.mocked(listAccounts);
  const listCategoriesMock = vi.mocked(listCategories);
  const listTransactionsMock = vi.mocked(listTransactions);

  beforeEach(() => {
    requireAuthenticatedAppUserMock.mockReset();
    findFirstFamilyForMemberMock.mockReset();
    findUserByIdMock.mockReset();
    listAccountsMock.mockReset();
    listCategoriesMock.mockReset();
    listTransactionsMock.mockReset();

    requireAuthenticatedAppUserMock.mockResolvedValue({
      id: ownerUserId,
      email: "owner@example.com",
      firstName: "Owner",
      lastName: "User",
      birthDate: new Date("1990-01-01T12:00:00.000Z"),
      sessionId: "session-1"
    });
    findUserByIdMock.mockImplementation(async (userId) => ({
      id: userId,
      email: `${userId}@example.com`,
      firstName: userId === ownerUserId ? "Owner" : "Member",
      lastName: "User",
      birthDate: new Date("1990-01-01T12:00:00.000Z"),
      passwordHash: "0".repeat(64),
      createdAt: new Date("2026-05-03T12:00:00.000Z"),
      updatedAt: new Date("2026-05-03T12:00:00.000Z")
    }));
    listAccountsMock.mockImplementation(async ({ userId }) => [
      {
        id: `${userId}-${accountId}`,
        userId,
        name: "Conta",
        type: userId === ownerUserId ? "checking" : "savings",
        initialBalance: userId === ownerUserId ? 10_000 : 5_000,
        isActive: true
      },
      {
        id: `${userId}-${creditAccountId}`,
        userId,
        name: "Cartão",
        type: userId === ownerUserId ? "credit" : "credit_card",
        initialBalance: 0,
        isActive: true
      }
    ]);
    listCategoriesMock.mockImplementation(async ({ userId }) => [
      {
        id: `${userId}-${categoryIncomeId}`,
        userId,
        name: "Entrada",
        type: "income",
        isActive: true
      },
      {
        id: `${userId}-${categoryExpenseId}`,
        userId,
        name: "Saída",
        type: "expense",
        isActive: true
      }
    ]);
    listTransactionsMock.mockImplementation(async ({ userId, competencyMonth }) => [
      {
        id: `${userId}-income`,
        userId,
        description: "Salário",
        amount: userId === ownerUserId ? 3_000 : 2_000,
        type: "income",
        date: new Date("2026-05-03T12:00:00.000Z"),
        competencyMonth: competencyMonth ?? "2026-05",
        categoryId: `${userId}-${categoryIncomeId}`,
        accountId: `${userId}-${accountId}`,
        status: "received",
        isRecurring: false
      },
      {
        id: `${userId}-expense`,
        userId,
        description: "Mercado",
        amount: 1_000,
        type: "expense",
        date: new Date("2026-05-04T12:00:00.000Z"),
        competencyMonth: competencyMonth ?? "2026-05",
        categoryId: `${userId}-${categoryExpenseId}`,
        accountId: `${userId}-${accountId}`,
        status: "paid",
        isRecurring: false
      },
      {
        id: `${userId}-credit-expense`,
        userId,
        description: "Compra no crédito",
        amount: userId === ownerUserId ? 700 : 500,
        type: "expense",
        date: new Date("2026-05-05T12:00:00.000Z"),
        competencyMonth: competencyMonth ?? "2026-05",
        categoryId: `${userId}-${categoryExpenseId}`,
        accountId: `${userId}-${creditAccountId}`,
        status: "paid",
        isRecurring: false
      },
      {
        id: `${userId}-legacy-credit-income`,
        userId,
        description: "Entrada antiga no crédito",
        amount: 9_000,
        type: "income",
        date: new Date("2026-05-06T12:00:00.000Z"),
        competencyMonth: competencyMonth ?? "2026-05",
        categoryId: `${userId}-${categoryIncomeId}`,
        accountId: `${userId}-${creditAccountId}`,
        status: "received",
        isRecurring: false
      }
    ]);
  });

  it("allows a family member to view the family financial summary", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue(buildFamily());

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(summary?.members).toHaveLength(2);
    expect(summary?.totalCurrentBalance).toBe(18_000);
    expect(summary?.monthlyIncome).toBe(5_000);
    expect(summary?.monthlyDebitIncome).toBe(5_000);
    expect(summary?.monthlyExpense).toBe(2_000);
    expect(summary?.monthlyDebitExpense).toBe(2_000);
    expect(summary?.monthlyCreditExpense).toBe(1_200);
    expect(summary?.monthlyResult).toBe(3_000);
  });

  it("consolidates debit income for the family", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue(buildFamily());

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(summary?.monthlyDebitIncome).toBe(5_000);
  });

  it("consolidates debit expenses for the family without credit expenses", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue(buildFamily());

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(summary?.monthlyDebitExpense).toBe(2_000);
    expect(summary?.monthlyExpense).toBe(2_000);
  });

  it("calculates the family debit net result", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue(buildFamily());

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(summary?.monthlyResult).toBe(3_000);
  });

  it("consolidates credit expenses separately from the main monthly expenses", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue(buildFamily());

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(summary?.monthlyCreditExpense).toBe(1_200);
    expect(summary?.monthlyExpense).not.toBe(3_200);
  });

  it("exposes debit and credit expenses per family member", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue(buildFamily());

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(summary?.members).toEqual([
      expect.objectContaining({
        userId: ownerUserId,
        monthlyDebitExpense: 1_000,
        monthlyCreditExpense: 700,
        monthlyResult: 2_000
      }),
      expect.objectContaining({
        userId: memberUserId,
        monthlyDebitExpense: 1_000,
        monthlyCreditExpense: 500,
        monthlyResult: 1_000
      })
    ]);
  });

  it("groups expenses by category for each family member", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue(buildFamily());

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(summary?.members.find((member) => member.userId === ownerUserId)?.expenseCategoryBreakdown).toEqual(
      expect.objectContaining({
        memberId: ownerUserId,
        memberName: "Owner User",
        debit: {
          totalExpenses: 1_000,
          expensesByCategory: [
            {
              categoryId: `${ownerUserId}-${categoryExpenseId}`,
              categoryName: "Saída",
              amount: 1_000,
              percentage: 1
            }
          ]
        },
        credit: {
          totalExpenses: 700,
          expensesByCategory: [
            {
              categoryId: `${ownerUserId}-${categoryExpenseId}`,
              categoryName: "Saída",
              amount: 700,
              percentage: 1
            }
          ]
        }
      })
    );
    expect(summary?.members.find((member) => member.userId === memberUserId)?.expenseCategoryBreakdown).toEqual(
      expect.objectContaining({
        memberId: memberUserId,
        memberName: "Member User",
        debit: {
          totalExpenses: 1_000,
          expensesByCategory: [
            {
              categoryId: `${memberUserId}-${categoryExpenseId}`,
              categoryName: "Saída",
              amount: 1_000,
              percentage: 1
            }
          ]
        },
        credit: {
          totalExpenses: 500,
          expensesByCategory: [
            {
              categoryId: `${memberUserId}-${categoryExpenseId}`,
              categoryName: "Saída",
              amount: 500,
              percentage: 1
            }
          ]
        }
      })
    );
  });

  it("does not include income in category expenses", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue(buildFamily());

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(
      summary?.members
        .flatMap((member) => [
          ...member.expenseCategoryBreakdown.debit.expensesByCategory,
          ...member.expenseCategoryBreakdown.credit.expensesByCategory
        ])
        .some((category) => category.categoryName === "Entrada")
    ).toBe(false);
  });

  it("calculates debit and credit category percentages from each group total", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue({
      ...buildFamily(),
      members: [
        {
          userId: ownerUserId,
          role: "owner",
          canView: true
        }
      ]
    });
    listCategoriesMock.mockResolvedValue([
      {
        id: "food-category",
        userId: ownerUserId,
        name: "Alimentação",
        type: "expense",
        isActive: true
      },
      {
        id: "transport-category",
        userId: ownerUserId,
        name: "Transporte",
        type: "expense",
        isActive: true
      }
    ]);
    listTransactionsMock.mockResolvedValue([
      {
        id: "debit-food",
        userId: ownerUserId,
        description: "Mercado",
        amount: 300,
        type: "expense",
        date: new Date("2026-05-04T12:00:00.000Z"),
        competencyMonth: "2026-05",
        categoryId: "food-category",
        accountId: `${ownerUserId}-${accountId}`,
        status: "paid",
        isRecurring: false
      },
      {
        id: "debit-transport",
        userId: ownerUserId,
        description: "Transporte",
        amount: 100,
        type: "expense",
        date: new Date("2026-05-04T12:00:00.000Z"),
        competencyMonth: "2026-05",
        categoryId: "transport-category",
        accountId: `${ownerUserId}-${accountId}`,
        status: "paid",
        isRecurring: false
      },
      {
        id: "credit-food",
        userId: ownerUserId,
        description: "Restaurante",
        amount: 150,
        type: "expense",
        date: new Date("2026-05-04T12:00:00.000Z"),
        competencyMonth: "2026-05",
        categoryId: "food-category",
        accountId: `${ownerUserId}-${creditAccountId}`,
        status: "paid",
        isRecurring: false
      },
      {
        id: "credit-transport",
        userId: ownerUserId,
        description: "Aplicativo",
        amount: 150,
        type: "expense",
        date: new Date("2026-05-04T12:00:00.000Z"),
        competencyMonth: "2026-05",
        categoryId: "transport-category",
        accountId: `${ownerUserId}-${creditAccountId}`,
        status: "paid",
        isRecurring: false
      }
    ]);

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });
    const breakdown = summary?.members[0]?.expenseCategoryBreakdown;

    expect(breakdown?.debit.expensesByCategory).toEqual([
      {
        categoryId: "food-category",
        categoryName: "Alimentação",
        amount: 300,
        percentage: 0.75
      },
      {
        categoryId: "transport-category",
        categoryName: "Transporte",
        amount: 100,
        percentage: 0.25
      }
    ]);
    expect(breakdown?.credit.expensesByCategory).toEqual([
      {
        categoryId: "food-category",
        categoryName: "Alimentação",
        amount: 150,
        percentage: 0.5
      },
      {
        categoryId: "transport-category",
        categoryName: "Transporte",
        amount: 150,
        percentage: 0.5
      }
    ]);
  });

  it("uses a safe fallback when an expense has no category", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue({
      ...buildFamily(),
      members: [
        {
          userId: ownerUserId,
          role: "owner",
          canView: true
        }
      ]
    });
    listTransactionsMock.mockResolvedValue([
      {
        id: "missing-category",
        userId: ownerUserId,
        description: "Despesa sem categoria",
        amount: 400,
        type: "expense",
        date: new Date("2026-05-04T12:00:00.000Z"),
        competencyMonth: "2026-05",
        accountId: `${ownerUserId}-${accountId}`,
        status: "paid",
        isRecurring: false
      }
    ]);

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(summary?.members[0]?.expenseCategoryBreakdown.debit.expensesByCategory).toEqual([
      {
        categoryId: undefined,
        categoryName: "Sem categoria",
        amount: 400,
        percentage: 1
      }
    ]);
  });

  it("treats legacy credit_card accounts as credit expenses and ignores legacy credit income", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue(buildFamily());

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(summary?.members.find((member) => member.userId === memberUserId)).toEqual(
      expect.objectContaining({
        monthlyCreditExpense: 500
      })
    );
    expect(summary?.monthlyCreditExpense).toBe(1_200);
    expect(
      summary?.members.find((member) => member.userId === memberUserId)?.expenseCategoryBreakdown.credit
    ).toEqual({
      totalExpenses: 500,
      expensesByCategory: [
        {
          categoryId: `${memberUserId}-${categoryExpenseId}`,
          categoryName: "Saída",
          amount: 500,
          percentage: 1
        }
      ]
    });
  });

  it("treats checking, savings, cash and investment accounts as debit expenses", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue({
      ...buildFamily(),
      members: [
        {
          userId: ownerUserId,
          role: "owner",
          canView: true
        }
      ]
    });
    listAccountsMock.mockResolvedValue([
      {
        id: "checking-account",
        userId: ownerUserId,
        name: "Conta corrente",
        type: "checking",
        initialBalance: 0,
        isActive: true
      },
      {
        id: "savings-account",
        userId: ownerUserId,
        name: "Poupança",
        type: "savings",
        initialBalance: 0,
        isActive: true
      },
      {
        id: "cash-account",
        userId: ownerUserId,
        name: "Dinheiro",
        type: "cash",
        initialBalance: 0,
        isActive: true
      },
      {
        id: "investment-account",
        userId: ownerUserId,
        name: "Investimento",
        type: "investment",
        initialBalance: 0,
        isActive: true
      }
    ]);
    listTransactionsMock.mockResolvedValue([
      {
        id: "checking-expense",
        userId: ownerUserId,
        description: "Checking",
        amount: 100,
        type: "expense",
        date: new Date("2026-05-04T12:00:00.000Z"),
        competencyMonth: "2026-05",
        accountId: "checking-account",
        status: "paid",
        isRecurring: false
      },
      {
        id: "savings-expense",
        userId: ownerUserId,
        description: "Savings",
        amount: 200,
        type: "expense",
        date: new Date("2026-05-04T12:00:00.000Z"),
        competencyMonth: "2026-05",
        accountId: "savings-account",
        status: "paid",
        isRecurring: false
      },
      {
        id: "cash-expense",
        userId: ownerUserId,
        description: "Cash",
        amount: 300,
        type: "expense",
        date: new Date("2026-05-04T12:00:00.000Z"),
        competencyMonth: "2026-05",
        accountId: "cash-account",
        status: "paid",
        isRecurring: false
      },
      {
        id: "investment-expense",
        userId: ownerUserId,
        description: "Investment",
        amount: 400,
        type: "expense",
        date: new Date("2026-05-04T12:00:00.000Z"),
        competencyMonth: "2026-05",
        accountId: "investment-account",
        status: "paid",
        isRecurring: false
      }
    ]);

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(summary?.members[0]).toEqual(
      expect.objectContaining({
        monthlyDebitExpense: 1_000,
        monthlyCreditExpense: 0,
        monthlyResult: -1_000,
        expenseCategoryBreakdown: expect.objectContaining({
          debit: {
            totalExpenses: 1_000,
            expensesByCategory: [
              {
                categoryId: undefined,
                categoryName: "Sem categoria",
                amount: 1_000,
                percentage: 1
              }
            ]
          },
          credit: {
            totalExpenses: 0,
            expensesByCategory: []
          }
        })
      })
    );
  });

  it("keeps a member with no expenses with an empty category list", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue({
      ...buildFamily(),
      members: [
        {
          userId: ownerUserId,
          role: "owner",
          canView: true
        }
      ]
    });
    listTransactionsMock.mockResolvedValue([
      {
        id: "income-only",
        userId: ownerUserId,
        description: "Salário",
        amount: 1_000,
        type: "income",
        date: new Date("2026-05-03T12:00:00.000Z"),
        competencyMonth: "2026-05",
        accountId: `${ownerUserId}-${accountId}`,
        status: "received",
        isRecurring: false
      }
    ]);

    const summary = await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(summary?.members[0]?.expenseCategoryBreakdown).toEqual(
      expect.objectContaining({
        debit: {
          totalExpenses: 0,
          expensesByCategory: []
        },
        credit: {
          totalExpenses: 0,
          expensesByCategory: []
        }
      })
    );
  });

  it("denies access for a user outside a family", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue(null);

    await expect(
      getFamilyFinancialSummary({
        competencyMonth: "2026-05"
      })
    ).resolves.toBeNull();
    expect(listAccountsMock).not.toHaveBeenCalled();
    expect(listTransactionsMock).not.toHaveBeenCalled();
  });

  it("uses only members with view permission when building the summary", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue(buildFamily());

    await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(listAccountsMock).toHaveBeenCalledWith({
      userId: ownerUserId
    });
    expect(listAccountsMock).toHaveBeenCalledWith({
      userId: memberUserId
    });
    expect(listAccountsMock).not.toHaveBeenCalledWith({
      userId: blockedUserId
    });
    expect(findUserByIdMock).not.toHaveBeenCalledWith(blockedUserId);
  });

  it("keeps personal data queries isolated by userId", async () => {
    findFirstFamilyForMemberMock.mockResolvedValue(buildFamily());

    await getFamilyFinancialSummary({
      competencyMonth: "2026-05"
    });

    expect(listTransactionsMock).toHaveBeenCalledWith({
      userId: ownerUserId,
      competencyMonth: "2026-05"
    });
    expect(listTransactionsMock).toHaveBeenCalledWith({
      userId: memberUserId,
      competencyMonth: "2026-05"
    });
  });
});
