import "server-only";

import { Types } from "mongoose";

import type { ParsedCreateFamilyFormValues } from "@/features/families/schemas/family-schema";
import { createFamily as createFamilyRecord } from "@/features/families/repositories/family-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function createFamily(values: ParsedCreateFamilyFormValues) {
  const user = await requireAuthenticatedAppUser();

  if (!Types.ObjectId.isValid(user.id)) {
    throw new Error(`Invalid user ID: ${user.id}`);
  }

  return createFamilyRecord({
    name: values.name.trim(),
    ownerUserId: user.id
  });
}
