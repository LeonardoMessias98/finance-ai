import "server-only";

import type { HydratedDocument } from "mongoose";

import {
  createUserSchema,
  updateUserActiveSessionSchema
} from "@/features/auth/schemas/user-schema";
import type {
  CreateUserInput,
  UpdateUserActiveSessionInput,
  User
} from "@/features/auth/types/entities";
import { connectToDatabase } from "@/lib/db/connect";
import { isObjectIdString } from "@/lib/db/object-id";
import { type UserDocument, UserModel } from "@/lib/db/models/user-model";

export type AuthUser = User;

function mapUserDocument(document: HydratedDocument<UserDocument>): AuthUser {
  return {
    id: document._id.toString(),
    firstName: document.firstName,
    lastName: document.lastName,
    birthDate: document.birthDate,
    email: document.email,
    passwordHash: document.passwordHash,
    lastLoginIp: document.lastLoginIp,
    lastLoginLocation: document.lastLoginLocation,
    activeSessionId: document.activeSessionId,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt
  };
}

export async function createUser(input: CreateUserInput): Promise<AuthUser> {
  await connectToDatabase();
  const payload = createUserSchema.parse(input);

  const document = await UserModel.create({
    ...payload,
    email: payload.email.trim().toLowerCase()
  });

  return mapUserDocument(document);
}

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  await connectToDatabase();

  const document = await UserModel.findOne({
    email: email.trim().toLowerCase()
  })
    .collation({
      locale: "en",
      strength: 2
    })
    .exec();

  return document ? mapUserDocument(document) : null;
}

export async function findUserById(userId: string): Promise<AuthUser | null> {
  if (!isObjectIdString(userId)) {
    return null;
  }

  await connectToDatabase();

  const document = await UserModel.findById(userId).exec();

  return document ? mapUserDocument(document) : null;
}

export async function updateUserActiveSession(input: UpdateUserActiveSessionInput): Promise<AuthUser | null> {
  const parsedInput = updateUserActiveSessionSchema.safeParse(input);

  if (!parsedInput.success || !isObjectIdString(parsedInput.data.userId)) {
    return null;
  }

  await connectToDatabase();

  const document = await UserModel.findByIdAndUpdate(
    parsedInput.data.userId,
    {
      activeSessionId: parsedInput.data.sessionId,
      lastLoginIp: parsedInput.data.lastLoginIp,
      ...(parsedInput.data.lastLoginLocation
        ? { lastLoginLocation: parsedInput.data.lastLoginLocation }
        : { $unset: { lastLoginLocation: 1 } })
    },
    {
      new: true,
      runValidators: true
    }
  ).exec();

  return document ? mapUserDocument(document) : null;
}

export async function clearUserActiveSession(input: { userId: string; expectedSessionId?: string }): Promise<void> {
  if (!isObjectIdString(input.userId)) {
    return;
  }

  await connectToDatabase();

  const query = input.expectedSessionId
    ? {
        _id: input.userId,
        activeSessionId: input.expectedSessionId
      }
    : {
        _id: input.userId
      };

  await UserModel.updateOne(query, {
    $unset: {
      activeSessionId: 1
    }
  }).exec();
}
