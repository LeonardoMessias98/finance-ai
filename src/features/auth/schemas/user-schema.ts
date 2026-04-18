import { z } from "zod";

import { objectIdStringSchema } from "@/lib/db/object-id";

const passwordHashRegex = /^[a-f0-9]{64}$/i;

const userMutationFieldsSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  birthDate: z.date(),
  email: z.string().trim().email().max(160).transform((value) => value.toLowerCase()),
  passwordHash: z.string().trim().regex(passwordHashRegex),
  lastLoginIp: z.string().trim().min(1).max(120).optional(),
  lastLoginLocation: z.string().trim().max(160).optional(),
  activeSessionId: z.string().trim().max(120).optional()
});

export const createUserSchema = userMutationFieldsSchema;

export const updateUserSchema = userMutationFieldsSchema.extend({
  id: objectIdStringSchema
});

export const updateUserActiveSessionSchema = z.object({
  userId: objectIdStringSchema,
  sessionId: z.string().trim().min(1).max(120).optional(),
  lastLoginIp: z.string().trim().min(1).max(120),
  lastLoginLocation: z.string().trim().max(160).optional()
});
