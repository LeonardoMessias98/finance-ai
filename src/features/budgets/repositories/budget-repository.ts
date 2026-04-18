import "server-only";

import type { FilterQuery, HydratedDocument } from "mongoose";
import { Types } from "mongoose";

import { createBudgetSchema, updateBudgetSchema } from "@/features/budgets/schemas/budget-schema";
import type { Budget, BudgetFilters, CreateBudgetInput, UpdateBudgetInput } from "@/features/budgets/types/budget";
import { connectToDatabase } from "@/lib/db/connect";
import { isObjectIdString } from "@/lib/db/object-id";
import { type BudgetDocument, BudgetModel } from "@/lib/db/models/budget-model";

function mapBudgetDocument(document: HydratedDocument<BudgetDocument>): Budget {
  return {
    id: document._id.toString(),
    userId: document.userId.toString(),
    competencyMonth: document.competencyMonth,
    categoryId: document.categoryId.toString(),
    limitAmount: document.limitAmount,
    alertThresholds: document.alertThresholds
  };
}

export async function createBudget(input: CreateBudgetInput): Promise<Budget> {
  const payload = createBudgetSchema.parse(input);

  await connectToDatabase();

  // Ensure userId is converted to ObjectId for Mongoose
  const documentData = {
    ...payload,
    userId: new Types.ObjectId(payload.userId)
  };

  const document = await BudgetModel.create(documentData);

  return mapBudgetDocument(document);
}

export async function updateBudget(input: UpdateBudgetInput): Promise<Budget | null> {
  const payload = updateBudgetSchema.parse(input);

  await connectToDatabase();

  const document = await BudgetModel.findOneAndUpdate(
    {
      _id: payload.id,
      userId: payload.userId
    },
    {
      competencyMonth: payload.competencyMonth,
      categoryId: payload.categoryId,
      limitAmount: payload.limitAmount,
      alertThresholds: payload.alertThresholds
    },
    {
      new: true,
      runValidators: true
    }
  ).exec();

  return document ? mapBudgetDocument(document) : null;
}

export async function findBudgetById(budgetId: string, userId: string): Promise<Budget | null> {
  if (!isObjectIdString(budgetId) || !isObjectIdString(userId)) {
    return null;
  }

  await connectToDatabase();

  const document = await BudgetModel.findOne({
    _id: budgetId,
    userId
  }).exec();

  return document ? mapBudgetDocument(document) : null;
}

export async function listBudgets(filters: BudgetFilters): Promise<Budget[]> {
  await connectToDatabase();

  const query: FilterQuery<BudgetDocument> = {
    userId: filters.userId
  };

  if (filters.competencyMonth) {
    query.competencyMonth = filters.competencyMonth;
  }

  if (filters.categoryId) {
    if (!isObjectIdString(filters.categoryId)) {
      return [];
    }

    query.categoryId = filters.categoryId;
  }

  const documents = await BudgetModel.find(query)
    .sort({
      competencyMonth: -1,
      categoryId: 1
    })
    .exec();

  return documents.map(mapBudgetDocument);
}

export async function findBudgetByCategoryAndMonth(input: {
  userId: string;
  categoryId: string;
  competencyMonth: string;
  excludeBudgetId?: string;
}): Promise<Budget | null> {
  if (!isObjectIdString(input.categoryId) || !isObjectIdString(input.userId)) {
    return null;
  }

  await connectToDatabase();

  const query: FilterQuery<BudgetDocument> = {
    userId: input.userId,
    categoryId: input.categoryId,
    competencyMonth: input.competencyMonth
  };

  if (input.excludeBudgetId && isObjectIdString(input.excludeBudgetId)) {
    query._id = {
      $ne: input.excludeBudgetId
    };
  }

  const document = await BudgetModel.findOne(query).exec();

  return document ? mapBudgetDocument(document) : null;
}
