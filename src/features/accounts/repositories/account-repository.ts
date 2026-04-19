import "server-only";

import type { FilterQuery, HydratedDocument } from "mongoose";
import { Types } from "mongoose";

import { createAccountSchema, updateAccountSchema } from "@/features/accounts/schemas/account-schema";
import type { Account, AccountFilters, CreateAccountInput, UpdateAccountInput } from "@/features/accounts/types/account";
import { connectToDatabase } from "@/lib/db/connect";
import { isObjectIdString } from "@/lib/db/object-id";
import { type AccountDocument, AccountModel } from "@/lib/db/models/account-model";
import { TransactionModel } from "@/lib/db/models/transaction-model";

function mapAccountDocument(document: HydratedDocument<AccountDocument>): Account {
  return {
    id: document._id.toString(),
    userId: document.userId.toString(),
    name: document.name,
    type: document.type,
    initialBalance: document.initialBalance,
    isActive: document.isActive,
    color: document.color,
    icon: document.icon
  };
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  const payload = createAccountSchema.parse(input);

  await connectToDatabase();

  // Ensure userId is converted to ObjectId for Mongoose
  const documentData = {
    ...payload,
    userId: new Types.ObjectId(payload.userId)
  };

  const document = await AccountModel.create(documentData);

  return mapAccountDocument(document);
}

export async function updateAccount(input: UpdateAccountInput): Promise<Account | null> {
  const payload = updateAccountSchema.parse(input);

  await connectToDatabase();

  const document = await AccountModel.findOneAndUpdate(
    {
      _id: payload.id,
      userId: payload.userId
    },
    {
      name: payload.name,
      type: payload.type,
      initialBalance: payload.initialBalance,
      isActive: payload.isActive,
      color: payload.color,
      icon: payload.icon
    },
    {
      new: true,
      runValidators: true
    }
  ).exec();

  return document ? mapAccountDocument(document) : null;
}

export async function findAccountByIdForUser(accountId: string, userId: string): Promise<Account | null> {
  if (!isObjectIdString(accountId) || !isObjectIdString(userId)) {
    return null;
  }

  await connectToDatabase();

  const document = await AccountModel.findOne({
    _id: accountId,
    userId
  }).exec();

  return document ? mapAccountDocument(document) : null;
}

export async function listAccounts(filters: AccountFilters): Promise<Account[]> {
  await connectToDatabase();

  const query: FilterQuery<AccountDocument> = {
    userId: filters.userId
  };

  if (filters.type) {
    query.type = filters.type;
  }

  if (typeof filters.isActive === "boolean") {
    query.isActive = filters.isActive;
  }

  const documents = await AccountModel.find(query)
    .sort({
      isActive: -1,
      name: 1
    })
    .exec();

  return documents.map(mapAccountDocument);
}

export async function setAccountActiveState(accountId: string, userId: string, isActive: boolean): Promise<Account | null> {
  if (!isObjectIdString(accountId) || !isObjectIdString(userId)) {
    return null;
  }

  await connectToDatabase();

  const document = await AccountModel.findOneAndUpdate(
    {
      _id: accountId,
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

  return document ? mapAccountDocument(document) : null;
}

export async function countTransactionsByAccountId(accountId: string, userId: string): Promise<number> {
  if (!isObjectIdString(accountId) || !isObjectIdString(userId)) {
    return 0;
  }

  await connectToDatabase();

  return TransactionModel.countDocuments({
    userId,
    accountId
  }).exec();
}

export async function deleteAccount(accountId: string, userId: string): Promise<Account | null> {
  if (!isObjectIdString(accountId) || !isObjectIdString(userId)) {
    return null;
  }

  await connectToDatabase();

  const document = await AccountModel.findOneAndDelete({
    _id: accountId,
    userId
  }).exec();

  return document ? mapAccountDocument(document) : null;
}
