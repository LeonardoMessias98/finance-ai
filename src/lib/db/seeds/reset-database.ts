import { AccountModel } from "@/lib/db/models/account-model";
import { BudgetModel } from "@/lib/db/models/budget-model";
import { CategoryModel } from "@/lib/db/models/category-model";
import { GoalModel } from "@/lib/db/models/goal-model";
import { RefreshTokenModel } from "@/lib/db/models/refresh-token-model";
import { TransactionModel } from "@/lib/db/models/transaction-model";
import { UserModel } from "@/lib/db/models/user-model";

export type ResetDatabaseResult = {
  accounts: number;
  budgets: number;
  categories: number;
  goals: number;
  refreshTokens: number;
  transactions: number;
  users: number;
};

export async function resetDatabaseCollections(): Promise<ResetDatabaseResult> {
  const [
    accountsResult,
    budgetsResult,
    categoriesResult,
    goalsResult,
    refreshTokensResult,
    transactionsResult,
    usersResult
  ] = await Promise.all([
    AccountModel.deleteMany({}).exec(),
    BudgetModel.deleteMany({}).exec(),
    CategoryModel.deleteMany({}).exec(),
    GoalModel.deleteMany({}).exec(),
    RefreshTokenModel.deleteMany({}).exec(),
    TransactionModel.deleteMany({}).exec(),
    UserModel.deleteMany({}).exec()
  ]);

  return {
    accounts: accountsResult.deletedCount,
    budgets: budgetsResult.deletedCount,
    categories: categoriesResult.deletedCount,
    goals: goalsResult.deletedCount,
    refreshTokens: refreshTokensResult.deletedCount,
    transactions: transactionsResult.deletedCount,
    users: usersResult.deletedCount
  };
}
