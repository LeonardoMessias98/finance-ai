import "server-only";

import { findUserById } from "@/features/auth/repositories/user-repository";
import type { ParsedAddFamilyMemberFormValues } from "@/features/families/schemas/family-schema";
import {
  addFamilyMember as addFamilyMemberRecord,
  findFamilyByIdForOwner
} from "@/features/families/repositories/family-repository";
import {
  DuplicateFamilyMemberError,
  FamilyAccessDeniedError,
  FamilyMemberNotFoundError
} from "@/features/families/services/family-errors";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function addFamilyMember(values: ParsedAddFamilyMemberFormValues) {
  const user = await requireAuthenticatedAppUser();
  const [family, memberUser] = await Promise.all([
    findFamilyByIdForOwner(values.familyId, user.id),
    findUserById(values.memberUserId)
  ]);

  if (!family) {
    throw new FamilyAccessDeniedError();
  }

  if (!memberUser) {
    throw new FamilyMemberNotFoundError();
  }

  if (family.members.some((member) => member.userId === values.memberUserId)) {
    throw new DuplicateFamilyMemberError();
  }

  const updatedFamily = await addFamilyMemberRecord({
    familyId: values.familyId,
    requesterUserId: user.id,
    memberUserId: values.memberUserId
  });

  if (!updatedFamily) {
    throw new DuplicateFamilyMemberError();
  }

  return updatedFamily;
}
