import "server-only";

import type { HydratedDocument } from "mongoose";

import { createRefreshTokenSchema } from "@/features/auth/schemas/refresh-token-schema";
import type {
  CreateRefreshTokenInput,
  RefreshToken
} from "@/features/auth/types/entities";
import { connectToDatabase } from "@/lib/db/connect";
import { isObjectIdString } from "@/lib/db/object-id";
import { type RefreshTokenDocument, RefreshTokenModel } from "@/lib/db/models/refresh-token-model";

export type PersistedRefreshToken = RefreshToken;

function mapRefreshTokenDocument(document: HydratedDocument<RefreshTokenDocument>): PersistedRefreshToken {
  return {
    id: document._id.toString(),
    userId: document.userId.toString(),
    sessionId: document.sessionId,
    tokenHash: document.tokenHash,
    ip: document.ip,
    location: document.location,
    userAgent: document.userAgent,
    expiresAt: document.expiresAt,
    revokedAt: document.revokedAt,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt
  };
}

export async function createRefreshToken(input: CreateRefreshTokenInput): Promise<PersistedRefreshToken> {
  await connectToDatabase();
  const payload = createRefreshTokenSchema.parse(input);

  const document = await RefreshTokenModel.create(payload);

  return mapRefreshTokenDocument(document);
}

export async function findActiveRefreshTokenByHash(tokenHash: string): Promise<PersistedRefreshToken | null> {
  await connectToDatabase();

  const document = await RefreshTokenModel.findOne({
    tokenHash,
    revokedAt: {
      $exists: false
    },
    expiresAt: {
      $gt: new Date()
    }
  }).exec();

  return document ? mapRefreshTokenDocument(document) : null;
}

export async function revokeRefreshTokenById(refreshTokenId: string): Promise<void> {
  if (!isObjectIdString(refreshTokenId)) {
    return;
  }

  await connectToDatabase();

  await RefreshTokenModel.updateOne(
    {
      _id: refreshTokenId,
      revokedAt: {
        $exists: false
      }
    },
    {
      revokedAt: new Date()
    }
  ).exec();
}

export async function revokeRefreshTokensByUserId(userId: string): Promise<void> {
  if (!isObjectIdString(userId)) {
    return;
  }

  await connectToDatabase();

  await RefreshTokenModel.updateMany(
    {
      userId,
      revokedAt: {
        $exists: false
      }
    },
    {
      revokedAt: new Date()
    }
  ).exec();
}

export async function revokeRefreshTokensBySessionId(input: { userId: string; sessionId: string }): Promise<void> {
  if (!isObjectIdString(input.userId)) {
    return;
  }

  await connectToDatabase();

  await RefreshTokenModel.updateMany(
    {
      userId: input.userId,
      sessionId: input.sessionId,
      revokedAt: {
        $exists: false
      }
    },
    {
      revokedAt: new Date()
    }
  ).exec();
}
