import { z } from "zod";

import { objectIdStringSchema } from "@/lib/db/object-id";

const tokenHashRegex = /^[a-f0-9]{64}$/i;

const refreshTokenMutationFieldsSchema = z.object({
  userId: objectIdStringSchema,
  sessionId: z.string().trim().min(1).max(120),
  tokenHash: z.string().trim().regex(tokenHashRegex, "Hash de token inválido."),
  ip: z.string().trim().min(1).max(120),
  location: z.string().trim().max(160).optional(),
  userAgent: z.string().trim().min(1).max(400),
  expiresAt: z.date(),
  revokedAt: z.date().optional()
});

export const createRefreshTokenSchema = refreshTokenMutationFieldsSchema.omit({
  revokedAt: true
});

export const updateRefreshTokenSchema = refreshTokenMutationFieldsSchema.extend({
  id: objectIdStringSchema
});
