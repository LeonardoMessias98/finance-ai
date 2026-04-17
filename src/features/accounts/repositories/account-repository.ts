import "server-only";

import type { FilterQuery, HydratedDocument } from "mongoose";

import { createAccountSchema, updateAccountSchema } from "@/features/accounts/schemas/account-schema";
import type { Account, AccountFilters, CreateAccountInput, UpdateAccountInput } from "@/features/accounts/types/account";
import { connectToDatabase } from "@/lib/db/connect";
import { isObjectIdString } from "@/lib/db/object-id";
import { type AccountDocument, AccountModel } from "@/lib/db/models/account-model";

function mapAccountDocument(document: HydratedDocument<AccountDocument>): Account {
  return {
    id: document._id.toString(),
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

  const document = await AccountModel.create(payload);

  return mapAccountDocument(document);
}

export async function updateAccount(input: UpdateAccountInput): Promise<Account | null> {
  const payload = updateAccountSchema.parse(input);

  await connectToDatabase();

  const document = await AccountModel.findByIdAndUpdate(
    payload.id,
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

export async function findAccountById(accountId: string): Promise<Account | null> {
  if (!isObjectIdString(accountId)) {
    return null;
  }

  await connectToDatabase();

  const document = await AccountModel.findById(accountId).exec();

  return document ? mapAccountDocument(document) : null;
}

export async function listAccounts(filters: AccountFilters = {}): Promise<Account[]> {
  await connectToDatabase();

  const query: FilterQuery<AccountDocument> = {};

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

export async function setAccountActiveState(accountId: string, isActive: boolean): Promise<Account | null> {
  if (!isObjectIdString(accountId)) {
    return null;
  }

  await connectToDatabase();

  const document = await AccountModel.findByIdAndUpdate(
    accountId,
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
