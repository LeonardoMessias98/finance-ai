import "server-only";

import { Types, type FilterQuery, type HydratedDocument } from "mongoose";

import { createTransactionSchema, updateTransactionSchema } from "@/features/transactions/schemas/transaction-schema";
import type {
  CreateTransactionInput,
  Transaction,
  TransactionFilters,
  UpdateTransactionInput
} from "@/features/transactions/types/transaction";
import { connectToDatabase } from "@/lib/db/connect";
import { isObjectIdString } from "@/lib/db/object-id";
import { type TransactionDocument, TransactionModel } from "@/lib/db/models/transaction-model";

function mapTransactionDocument(document: HydratedDocument<TransactionDocument>): Transaction {
  return {
    id: document._id.toString(),
    description: document.description,
    amount: document.amount,
    type: document.type,
    date: document.date,
    competencyMonth: document.competencyMonth,
    categoryId: document.categoryId?.toString(),
    accountId: document.accountId.toString(),
    destinationAccountId: document.destinationAccountId?.toString(),
    notes: document.notes,
    status: document.status,
    isRecurring: document.isRecurring,
    installment: document.installment
      ? {
          current: document.installment.current,
          total: document.installment.total
        }
      : undefined,
    parentTransactionId: document.parentTransactionId?.toString()
  };
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const payload = createTransactionSchema.parse(input);

  await connectToDatabase();

  const document = await TransactionModel.create(payload);

  return mapTransactionDocument(document);
}

export async function createTransactionSeries(inputs: CreateTransactionInput[]): Promise<Transaction[]> {
  const parentTransactionObjectId = new Types.ObjectId();
  const payloads = inputs.map((input) =>
    createTransactionSchema.parse({
      ...input,
      parentTransactionId: parentTransactionObjectId.toString()
    })
  );

  await connectToDatabase();

  const documents = await TransactionModel.insertMany(
    payloads.map((payload, index) => ({
      _id: index === 0 ? parentTransactionObjectId : new Types.ObjectId(),
      ...payload,
      parentTransactionId: parentTransactionObjectId
    })),
    {
      ordered: true
    }
  );

  return documents.map(mapTransactionDocument);
}

export async function updateTransaction(input: UpdateTransactionInput): Promise<Transaction | null> {
  const payload = updateTransactionSchema.parse(input);

  await connectToDatabase();

  const document = await TransactionModel.findByIdAndUpdate(
    payload.id,
    {
      $set: {
        description: payload.description,
        amount: payload.amount,
        type: payload.type,
        date: payload.date,
        competencyMonth: payload.competencyMonth,
        accountId: payload.accountId,
        status: payload.status,
        isRecurring: payload.isRecurring,
        ...(payload.categoryId ? { categoryId: payload.categoryId } : {}),
        ...(payload.destinationAccountId ? { destinationAccountId: payload.destinationAccountId } : {}),
        ...(payload.notes ? { notes: payload.notes } : {}),
        ...(payload.installment ? { installment: payload.installment } : {}),
        ...(payload.parentTransactionId ? { parentTransactionId: payload.parentTransactionId } : {})
      },
      $unset: {
        ...(payload.categoryId ? {} : { categoryId: 1 }),
        ...(payload.destinationAccountId ? {} : { destinationAccountId: 1 }),
        ...(payload.notes ? {} : { notes: 1 }),
        ...(payload.installment ? {} : { installment: 1 }),
        ...(payload.parentTransactionId ? {} : { parentTransactionId: 1 })
      }
    },
    {
      new: true,
      runValidators: true
    }
  ).exec();

  return document ? mapTransactionDocument(document) : null;
}

export async function findTransactionById(transactionId: string): Promise<Transaction | null> {
  if (!isObjectIdString(transactionId)) {
    return null;
  }

  await connectToDatabase();

  const document = await TransactionModel.findById(transactionId).exec();

  return document ? mapTransactionDocument(document) : null;
}

export async function listTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  await connectToDatabase();

  const query: FilterQuery<TransactionDocument> = {};

  if (filters.competencyMonth) {
    query.competencyMonth = filters.competencyMonth;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.accountId) {
    if (!isObjectIdString(filters.accountId)) {
      return [];
    }

    query.$or = [
      {
        accountId: filters.accountId
      },
      {
        destinationAccountId: filters.accountId
      }
    ];
  }

  if (filters.categoryId) {
    if (!isObjectIdString(filters.categoryId)) {
      return [];
    }

    query.categoryId = filters.categoryId;
  }

  const documents = await TransactionModel.find(query)
    .sort({
      date: -1,
      description: 1
    })
    .exec();

  return documents.map(mapTransactionDocument);
}

export async function deleteTransaction(transactionId: string): Promise<Transaction | null> {
  if (!isObjectIdString(transactionId)) {
    return null;
  }

  await connectToDatabase();

  const document = await TransactionModel.findByIdAndDelete(transactionId).exec();

  return document ? mapTransactionDocument(document) : null;
}

export async function deleteTransactionSeries(parentTransactionId: string): Promise<number> {
  if (!isObjectIdString(parentTransactionId)) {
    return 0;
  }

  await connectToDatabase();

  const result = await TransactionModel.deleteMany({
    parentTransactionId
  }).exec();

  return result.deletedCount ?? 0;
}
