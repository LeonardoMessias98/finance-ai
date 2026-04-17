import "server-only";

import type { FilterQuery, HydratedDocument } from "mongoose";

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

  const document = await CategoryModel.create(payload);

  return mapCategoryDocument(document);
}

export async function updateCategory(input: UpdateCategoryInput): Promise<Category | null> {
  const payload = updateCategorySchema.parse(input);

  await connectToDatabase();

  const document = await CategoryModel.findByIdAndUpdate(
    payload.id,
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

export async function findCategoryById(categoryId: string): Promise<Category | null> {
  if (!isObjectIdString(categoryId)) {
    return null;
  }

  await connectToDatabase();

  const document = await CategoryModel.findById(categoryId).exec();

  return document ? mapCategoryDocument(document) : null;
}

export async function listCategories(filters: CategoryFilters = {}): Promise<Category[]> {
  await connectToDatabase();

  const query: FilterQuery<CategoryDocument> = {};

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

export async function setCategoryActiveState(categoryId: string, isActive: boolean): Promise<Category | null> {
  if (!isObjectIdString(categoryId)) {
    return null;
  }

  await connectToDatabase();

  const document = await CategoryModel.findByIdAndUpdate(
    categoryId,
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
  name: string;
  type: CategoryType;
  excludeCategoryId?: string;
}): Promise<Category | null> {
  await connectToDatabase();

  const query: FilterQuery<CategoryDocument> = {
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

export async function countTransactionsByCategoryId(categoryId: string): Promise<number> {
  if (!isObjectIdString(categoryId)) {
    return 0;
  }

  await connectToDatabase();

  return TransactionModel.countDocuments({
    categoryId
  }).exec();
}

export async function deleteCategory(categoryId: string): Promise<Category | null> {
  if (!isObjectIdString(categoryId)) {
    return null;
  }

  await connectToDatabase();

  const document = await CategoryModel.findByIdAndDelete(categoryId).exec();

  return document ? mapCategoryDocument(document) : null;
}
