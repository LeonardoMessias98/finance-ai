import "server-only";

import type { FilterQuery, HydratedDocument } from "mongoose";

import { createGoalSchema, updateGoalSchema } from "@/features/goals/schemas/goal-schema";
import type { CreateGoalInput, Goal, GoalFilters, UpdateGoalInput } from "@/features/goals/types/goal";
import { connectToDatabase } from "@/lib/db/connect";
import { isObjectIdString } from "@/lib/db/object-id";
import { type GoalDocument, GoalModel } from "@/lib/db/models/goal-model";

function mapGoalDocument(document: HydratedDocument<GoalDocument>): Goal {
  return {
    id: document._id.toString(),
    name: document.name,
    targetAmount: document.targetAmount,
    currentAmount: document.currentAmount,
    targetDate: document.targetDate,
    isCompleted: document.isCompleted
  };
}

export async function createGoal(input: CreateGoalInput): Promise<Goal> {
  const payload = createGoalSchema.parse(input);

  await connectToDatabase();

  const document = await GoalModel.create(payload);

  return mapGoalDocument(document);
}

export async function updateGoal(input: UpdateGoalInput): Promise<Goal | null> {
  const payload = updateGoalSchema.parse(input);

  await connectToDatabase();

  const document = await GoalModel.findByIdAndUpdate(
    payload.id,
    {
      name: payload.name,
      targetAmount: payload.targetAmount,
      currentAmount: payload.currentAmount,
      targetDate: payload.targetDate,
      isCompleted: payload.isCompleted
    },
    {
      new: true,
      runValidators: true
    }
  ).exec();

  return document ? mapGoalDocument(document) : null;
}

export async function findGoalById(goalId: string): Promise<Goal | null> {
  if (!isObjectIdString(goalId)) {
    return null;
  }

  await connectToDatabase();

  const document = await GoalModel.findById(goalId).exec();

  return document ? mapGoalDocument(document) : null;
}

export async function listGoals(filters: GoalFilters = {}): Promise<Goal[]> {
  await connectToDatabase();

  const query: FilterQuery<GoalDocument> = {};

  if (typeof filters.isCompleted === "boolean") {
    query.isCompleted = filters.isCompleted;
  }

  const documents = await GoalModel.find(query)
    .sort({
      isCompleted: 1,
      targetDate: 1,
      name: 1
    })
    .exec();

  return documents.map(mapGoalDocument);
}
