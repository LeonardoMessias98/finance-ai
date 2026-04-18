import "server-only";

import type { FilterQuery, HydratedDocument } from "mongoose";
import { Types } from "mongoose";

import { createCategorySchema, updateCategorySchema } from "@/features/categories/schemas/category-schema";
import type {
  Category,
  CategoryFilters,
  CategoryType,
  CreateCategoryInput,
  UpdateCategoryInput
} from "@/features/categories/types/category";
import { connectToDatabase } from "@/lib/db/connect";
import { isObjectIdString } from "@/lib/db/object-id";
import { type CategoryDocument, CategoryModel } from "@/lib/db/models/category-model";
import { TransactionModel } from "@/lib/db/models/transaction-model";

function mapCategoryDocument(document: HydratedDocument<CategoryDocument>): Category {
  return {
    id: document._id.toString(),
    userId: document.userId.toString(),
    name: document.name,
    type: document.type,
    isActive: document.isActive,
    color: document.color,
    icon: document.icon
  };
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const payload = createCategorySchema.parse(input);

  await connectToDatabase();

  // Ensure userId is converted to ObjectId for Mongoose
  const documentData = {
    ...payload,
    userId: new Types.ObjectId(payload.userId)
  };

  const document = await CategoryModel.create(documentData);

  return mapCategoryDocument(document);
}

export async function updateCategory(input: UpdateCategoryInput): Promise<Category | null> {
  const payload = updateCategorySchema.parse(input);

  await connectToDatabase();

  const document = await CategoryModel.findOneAndUpdate(
    {
      _id: payload.id,
      userId: payload.userId
    },
    {
      name: payload.name,
      type: payload.type,
      isActive: payload.isActive,
      color: payload.color,
      icon: payload.icon
    },
    {
      new: true,
      runValidators: true
    }
  ).exec();

  return document ? mapCategoryDocument(document) : null;
}

export async function findCategoryByIdForUser(categoryId: string, userId: string): Promise<Category | null> {
  if (!isObjectIdString(categoryId) || !isObjectIdString(userId)) {
    return null;
  }

  await connectToDatabase();

  const document = await CategoryModel.findOne({
    _id: categoryId,
    userId
  }).exec();

  return document ? mapCategoryDocument(document) : null;
}

export async function listCategories(filters: CategoryFilters): Promise<Category[]> {
  await connectToDatabase();

  const query: FilterQuery<CategoryDocument> = {
    userId: filters.userId
  };

  if (filters.type) {
    query.type = filters.type;
  }

  if (typeof filters.isActive === "boolean") {
    query.isActive = filters.isActive;
  }

  const documents = await CategoryModel.find(query)
    .sort({
      type: 1,
      name: 1
    })
    .exec();

  return documents.map(mapCategoryDocument);
}

export async function setCategoryActiveState(
  categoryId: string,
  userId: string,
  isActive: boolean
): Promise<Category | null> {
  if (!isObjectIdString(categoryId) || !isObjectIdString(userId)) {
    return null;
  }

  await connectToDatabase();

  const document = await CategoryModel.findOneAndUpdate(
    {
      _id: categoryId,
      userId
    },
    {
      isActive
    },
    {
      new: true,
      runValidators: true
    }
  ).exec();

  return document ? mapCategoryDocument(document) : null;
}

export async function findCategoryByNameAndType(input: {
  userId: string;
  name: string;
  type: CategoryType;
  excludeCategoryId?: string;
}): Promise<Category | null> {
  await connectToDatabase();

  const query: FilterQuery<CategoryDocument> = {
    userId: input.userId,
    type: input.type,
    name: input.name.trim()
  };

  if (input.excludeCategoryId && isObjectIdString(input.excludeCategoryId)) {
    query._id = {
      $ne: input.excludeCategoryId
    };
  }

  const document = await CategoryModel.findOne(query).collation({
    locale: "en",
    strength: 2
  });

  return document ? mapCategoryDocument(document) : null;
}

export async function countTransactionsByCategoryId(categoryId: string, userId: string): Promise<number> {
  if (!isObjectIdString(categoryId) || !isObjectIdString(userId)) {
    return 0;
  }

  await connectToDatabase();

  return TransactionModel.countDocuments({
    userId,
    categoryId
  }).exec();
}

export async function deleteCategory(categoryId: string, userId: string): Promise<Category | null> {
  if (!isObjectIdString(categoryId) || !isObjectIdString(userId)) {
    return null;
  }

  await connectToDatabase();

  const document = await CategoryModel.findOneAndDelete({
    _id: categoryId,
    userId
  }).exec();

  return document ? mapCategoryDocument(document) : null;
}
