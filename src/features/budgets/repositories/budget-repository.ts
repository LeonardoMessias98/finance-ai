import "server-only";

import type { FilterQuery, HydratedDocument } from "mongoose";

import { createBudgetSchema, updateBudgetSchema } from "@/features/budgets/schemas/budget-schema";
import type { Budget, BudgetFilters, CreateBudgetInput, UpdateBudgetInput } from "@/features/budgets/types/budget";
import { connectToDatabase } from "@/lib/db/connect";
import { isObjectIdString } from "@/lib/db/object-id";
import { type BudgetDocument, BudgetModel } from "@/lib/db/models/budget-model";

function mapBudgetDocument(document: HydratedDocument<BudgetDocument>): Budget {
  return {
    id: document._id.toString(),
    competencyMonth: document.competencyMonth,
    categoryId: document.categoryId.toString(),
    limitAmount: document.limitAmount,
    alertThresholds: document.alertThresholds
  };
}

export async function createBudget(input: CreateBudgetInput): Promise<Budget> {
  const payload = createBudgetSchema.parse(input);

  await connectToDatabase();

  const document = await BudgetModel.create(payload);

  return mapBudgetDocument(document);
}

export async function updateBudget(input: UpdateBudgetInput): Promise<Budget | null> {
  const payload = updateBudgetSchema.parse(input);

  await connectToDatabase();

  const document = await BudgetModel.findByIdAndUpdate(
    payload.id,
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

export async function findBudgetById(budgetId: string): Promise<Budget | null> {
  if (!isObjectIdString(budgetId)) {
    return null;
  }

  await connectToDatabase();

  const document = await BudgetModel.findById(budgetId).exec();

  return document ? mapBudgetDocument(document) : null;
}

export async function listBudgets(filters: BudgetFilters = {}): Promise<Budget[]> {
  await connectToDatabase();

  const query: FilterQuery<BudgetDocument> = {};

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
  categoryId: string;
  competencyMonth: string;
  excludeBudgetId?: string;
}): Promise<Budget | null> {
  if (!isObjectIdString(input.categoryId)) {
    return null;
  }

  await connectToDatabase();

  const query: FilterQuery<BudgetDocument> = {
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
