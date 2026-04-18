import { createUserSchema } from "@/features/auth/schemas/user-schema";
import { createAccountSchema } from "@/features/accounts/schemas/account-schema";
import type { AccountType } from "@/features/accounts/types/account";
import { createBudgetSchema } from "@/features/budgets/schemas/budget-schema";
import { createCategorySchema } from "@/features/categories/schemas/category-schema";
import type { CategoryType } from "@/features/categories/types/category";
import { createGoalSchema } from "@/features/goals/schemas/goal-schema";
import { createTransactionSchema } from "@/features/transactions/schemas/transaction-schema";
import { connectToDatabase } from "@/lib/db/connect";
import { AccountModel } from "@/lib/db/models/account-model";
import { BudgetModel } from "@/lib/db/models/budget-model";
import { CategoryModel } from "@/lib/db/models/category-model";
import { GoalModel } from "@/lib/db/models/goal-model";
import { TransactionModel } from "@/lib/db/models/transaction-model";
import { UserModel } from "@/lib/db/models/user-model";
import { type ResetDatabaseResult, resetDatabaseCollections } from "@/lib/db/seeds/reset-database";
import { buildOptionalSampleSeedData, initialAccountSeedData, initialCategorySeedData } from "@/lib/db/seeds/initial-seed-data";

type SeedCounter = {
  created: number;
  existing: number;
};

export type SeedInitialDatabaseOptions = {
  includeSampleData?: boolean;
  resetDatabase?: boolean;
};

export type SeedInitialDatabaseResult = {
  accounts: SeedCounter;
  categories: SeedCounter;
  transactions: SeedCounter;
  budgets: SeedCounter;
  goals: SeedCounter;
  competencyMonth: string;
  includedSampleData: boolean;
  resetApplied: boolean;
  resetSummary?: ResetDatabaseResult;
};

type SeedAccountReference = {
  id: string;
  name: string;
  type: AccountType;
};

type SeedCategoryReference = {
  id: string;
  name: string;
  type: CategoryType;
};

type SeedUserReference = {
  id: string;
  email: string;
};

const defaultSeedPasswordHash = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92";

function buildSeedCounter(): SeedCounter {
  return {
    created: 0,
    existing: 0
  };
}

function registerCounterResult(counter: SeedCounter, created: boolean) {
  if (created) {
    counter.created += 1;
    return;
  }

  counter.existing += 1;
}

function buildAccountSeedKey(name: string, type: AccountType): string {
  return `${type}:${name.trim().toLocaleLowerCase("pt-BR")}`;
}

function buildCategorySeedKey(name: string, type: CategoryType): string {
  return `${type}:${name.trim().toLocaleLowerCase("pt-BR")}`;
}

function getCurrentCompetencyMonth(referenceDate: Date = new Date()): string {
  const year = referenceDate.getUTCFullYear();
  const month = String(referenceDate.getUTCMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function parseBirthDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day, 12));
}

function readSeedUserInput() {
  return {
    firstName: process.env.SEED_USER_FIRST_NAME?.trim() || "Owner",
    lastName: process.env.SEED_USER_LAST_NAME?.trim() || "Finance AI",
    birthDate: process.env.SEED_USER_BIRTH_DATE?.trim() || "1990-01-01",
    email: process.env.SEED_USER_EMAIL?.trim() || "owner@finance-ai.local",
    passwordHash: process.env.SEED_USER_PASSWORD_HASH?.trim() || defaultSeedPasswordHash
  };
}

async function ensureSeedUser(): Promise<SeedUserReference> {
  const input = readSeedUserInput();
  const payload = createUserSchema.parse({
    firstName: input.firstName,
    lastName: input.lastName,
    birthDate: parseBirthDateInput(input.birthDate),
    email: input.email,
    passwordHash: input.passwordHash,
    lastLoginIp: "seed"
  });

  const existingUser = await UserModel.findOne({
    email: payload.email
  })
    .collation({
      locale: "en",
      strength: 2
    })
    .exec();

  if (existingUser) {
    return {
      id: existingUser._id.toString(),
      email: existingUser.email
    };
  }

  const createdUser = await UserModel.create(payload);

  return {
    id: createdUser._id.toString(),
    email: createdUser.email
  };
}

async function ensureAccountSeed(input: { userId: string } & (typeof initialAccountSeedData)[number]): Promise<{
  account: SeedAccountReference;
  created: boolean;
}> {
  const payload = createAccountSchema.parse(input);

  const existingDocument = await AccountModel.findOne({
    userId: payload.userId,
    name: payload.name,
    type: payload.type
  })
    .collation({
      locale: "pt",
      strength: 2
    })
    .exec();

  if (existingDocument) {
    return {
      account: {
        id: existingDocument._id.toString(),
        name: existingDocument.name,
        type: existingDocument.type
      },
      created: false
    };
  }

  const createdDocument = await AccountModel.create(payload);

  return {
    account: {
      id: createdDocument._id.toString(),
      name: createdDocument.name,
      type: createdDocument.type
    },
    created: true
  };
}

async function ensureCategorySeed(input: { userId: string } & (typeof initialCategorySeedData)[number]): Promise<{
  category: SeedCategoryReference;
  created: boolean;
}> {
  const payload = createCategorySchema.parse(input);

  const existingDocument = await CategoryModel.findOne({
    userId: payload.userId,
    name: payload.name,
    type: payload.type
  })
    .collation({
      locale: "en",
      strength: 2
    })
    .exec();

  if (existingDocument) {
    return {
      category: {
        id: existingDocument._id.toString(),
        name: existingDocument.name,
        type: existingDocument.type
      },
      created: false
    };
  }

  const createdDocument = await CategoryModel.create(payload);

  return {
    category: {
      id: createdDocument._id.toString(),
      name: createdDocument.name,
      type: createdDocument.type
    },
    created: true
  };
}

async function ensureSampleTransaction(
  input: { userId: string } & ReturnType<typeof buildOptionalSampleSeedData>["transactions"][number]
): Promise<boolean> {
  const payload = createTransactionSchema.parse(input);
  const existingDocument = await TransactionModel.findOne({
    userId: payload.userId,
    description: payload.description,
    amount: payload.amount,
    type: payload.type,
    date: payload.date,
    competencyMonth: payload.competencyMonth,
    accountId: payload.accountId,
    ...(payload.categoryId ? { categoryId: payload.categoryId } : { categoryId: { $exists: false } }),
    ...(payload.destinationAccountId
      ? { destinationAccountId: payload.destinationAccountId }
      : { destinationAccountId: { $exists: false } })
  }).exec();

  if (existingDocument) {
    return false;
  }

  await TransactionModel.create(payload);

  return true;
}

async function ensureSampleBudget(
  input: { userId: string } & ReturnType<typeof buildOptionalSampleSeedData>["budgets"][number]
): Promise<boolean> {
  const payload = createBudgetSchema.parse(input);
  const existingDocument = await BudgetModel.findOne({
    userId: payload.userId,
    competencyMonth: payload.competencyMonth,
    categoryId: payload.categoryId
  }).exec();

  if (existingDocument) {
    return false;
  }

  await BudgetModel.create(payload);

  return true;
}

async function ensureSampleGoal(
  input: { userId: string } & ReturnType<typeof buildOptionalSampleSeedData>["goals"][number]
): Promise<boolean> {
  const payload = createGoalSchema.parse(input);
  const existingDocument = await GoalModel.findOne({
    userId: payload.userId,
    name: payload.name
  })
    .collation({
      locale: "pt",
      strength: 2
    })
    .exec();

  if (existingDocument) {
    return false;
  }

  await GoalModel.create(payload);

  return true;
}

function requireAccountReference(accountMap: Map<string, SeedAccountReference>, input: {
  name: string;
  type: AccountType;
}): SeedAccountReference {
  const account = accountMap.get(buildAccountSeedKey(input.name, input.type));

  if (!account) {
    throw new Error(`Seed account not found: ${input.type}:${input.name}`);
  }

  return account;
}

function requireCategoryReference(categoryMap: Map<string, SeedCategoryReference>, input: {
  name: string;
  type: CategoryType;
}): SeedCategoryReference {
  const category = categoryMap.get(buildCategorySeedKey(input.name, input.type));

  if (!category) {
    throw new Error(`Seed category not found: ${input.type}:${input.name}`);
  }

  return category;
}

export async function seedInitialDatabase(options: SeedInitialDatabaseOptions = {}): Promise<SeedInitialDatabaseResult> {
  await connectToDatabase();

  const resetSummary = options.resetDatabase ? await resetDatabaseCollections() : undefined;

  const seedUser = await ensureSeedUser();
  const accountMap = new Map<string, SeedAccountReference>();
  const categoryMap = new Map<string, SeedCategoryReference>();
  const competencyMonth = getCurrentCompetencyMonth();

  const result: SeedInitialDatabaseResult = {
    accounts: buildSeedCounter(),
    categories: buildSeedCounter(),
    transactions: buildSeedCounter(),
    budgets: buildSeedCounter(),
    goals: buildSeedCounter(),
    competencyMonth,
    includedSampleData: options.includeSampleData ?? false,
    resetApplied: Boolean(options.resetDatabase),
    ...(resetSummary ? { resetSummary } : {})
  };

  for (const input of initialAccountSeedData) {
    const { account, created } = await ensureAccountSeed({
      userId: seedUser.id,
      ...input
    });

    accountMap.set(buildAccountSeedKey(account.name, account.type), account);
    registerCounterResult(result.accounts, created);
  }

  for (const input of initialCategorySeedData) {
    const { category, created } = await ensureCategorySeed({
      userId: seedUser.id,
      ...input
    });

    categoryMap.set(buildCategorySeedKey(category.name, category.type), category);
    registerCounterResult(result.categories, created);
  }

  if (!result.includedSampleData) {
    return result;
  }

  const checkingAccount = requireAccountReference(accountMap, {
    name: "Conta corrente",
    type: "checking"
  });
  const savingsAccount = requireAccountReference(accountMap, {
    name: "Reserva",
    type: "savings"
  });
  const salaryCategory = requireCategoryReference(categoryMap, {
    name: "salário",
    type: "income"
  });
  const marketCategory = requireCategoryReference(categoryMap, {
    name: "mercado",
    type: "expense"
  });
  const sampleData = buildOptionalSampleSeedData({
    checkingAccountId: checkingAccount.id,
    savingsAccountId: savingsAccount.id,
    salaryCategoryId: salaryCategory.id,
    marketCategoryId: marketCategory.id,
    competencyMonth
  });

  for (const input of sampleData.transactions) {
    registerCounterResult(
      result.transactions,
      await ensureSampleTransaction({
        userId: seedUser.id,
        ...input
      })
    );
  }

  for (const input of sampleData.budgets) {
    registerCounterResult(
      result.budgets,
      await ensureSampleBudget({
        userId: seedUser.id,
        ...input
      })
    );
  }

  for (const input of sampleData.goals) {
    registerCounterResult(
      result.goals,
      await ensureSampleGoal({
        userId: seedUser.id,
        ...input
      })
    );
  }

  return result;
}
